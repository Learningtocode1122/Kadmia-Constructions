// ============================================================
// KADMIA CRM — Google Apps Script (copy this into script.google.com)
// ============================================================
// SETUP:
// 1. Go to https://script.google.com
// 2. Create a new project
// 3. Paste this entire file
// 4. Click Deploy → New Deployment → Web App
// 5. Execute as: "Me" / Access: "Anyone"
// 6. Copy the deployment URL
// 7. Paste it as SHEET_API_URL in crm.html and contact form
// ============================================================

var SHEET_ID = ''; // Will be set automatically on first run

function getOrCreateSheet() {
  if (SHEET_ID) {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    if (ss) return ss;
  }
  var ss = SpreadsheetApp.create('Kadmia CRM Leads');
  SHEET_ID = ss.getId();
  // Save SHEET_ID as a script property
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', SHEET_ID);

  var sheet = ss.getActiveSheet();
  sheet.setName('Leads');
  sheet.appendRow(['Date', 'Name', 'Email', 'Phone', 'Message', 'Status', 'Notes']);
  sheet.setFrozenRows(1);
  sheet.getRange('A1:G1').setFontWeight('bold').setBackground('#0a1628').setFontColor('#c8a96e');
  sheet.autoResizeColumns(1, 7);
  return ss;
}

// Called when contact form is submitted
function doPost(e) {
  try {
    PropertiesService.getScriptProperties().setProperty('SHEET_ID',
      PropertiesService.getScriptProperties().getProperty('SHEET_ID') || '');
    SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');

    var ss = getOrCreateSheet();
    var sheet = ss.getSheetByName('Leads');
    if (!sheet) {
      sheet = ss.getActiveSheet();
      sheet.setName('Leads');
      sheet.appendRow(['Date', 'Name', 'Email', 'Phone', 'Message', 'Status', 'Notes']);
    }

    var params = e.parameter;
    var date = new Date().toISOString().split('T')[0];

    sheet.appendRow([
      date,
      params.name || '',
      params.email || '',
      params.phone || '',
      params.message || '',
      'New',
      ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Called by CRM dashboard to fetch leads
function doGet(e) {
  try {
    SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    var ss = getOrCreateSheet();
    var sheet = ss.getSheetByName('Leads');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ leads: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var leads = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[1] && row[1].toString().trim()) {
        leads.push({
          date: row[0] || '',
          name: row[1] || '',
          email: row[2] || '',
          phone: row[3] || '',
          message: row[4] || '',
          status: row[5] || 'New',
          notes: row[6] || ''
        });
      }
    }

    leads.reverse(); // Newest first

    return ContentService.createTextOutput(JSON.stringify({ leads: leads }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ leads: [], error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Update lead status or notes
function doPut(e) {
  try {
    SHEET_ID = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    var ss = getOrCreateSheet();
    var sheet = ss.getSheetByName('Leads');

    var params = e.parameter;
    var rowIndex = parseInt(params.row) + 2; // +2 for 0-index + header
    var col = params.col === 'status' ? 6 : 7; // F=status, G=notes
    var val = params.value || '';

    sheet.getRange(rowIndex, col).setValue(val);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
