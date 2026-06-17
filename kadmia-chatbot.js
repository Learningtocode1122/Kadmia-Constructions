/* ═══════════════════════════════════════════════
   KADMIA CONSTRUCTIONS — FAQ + LEAD CAPTURE CHATBOT
   ═══════════════════════════════════════════════ */

(function(){
  if (document.getElementById('kadmia-chatbot-root')) return; // Prevent duplicates

  /* ── CHATBOT STATE ── */
  var state = {
    open: false,
    step: 'faq',          // 'faq' | 'lead_name' | 'lead_phone' | 'lead_email' | 'lead_service' | 'lead_done'
    history: [],
    lead: { name: '', phone: '', email: '', service: '' },
    lastUserMessage: ''
  };

  /* ── FAQ DATABASE ── */
  var faq = {
    cost: {
      keywords: ['cost', 'price', 'pricing', 'how much', 'budget', 'estimate', 'rate', 'sqm', 'square metre', 'afford', 'expensive', 'cheap'],
      response: "Great question — pricing depends on the project type and finish level. As a rough guide:\n\n• Knock Down Re-Build: from ~$1,980/sqm\n• Custom Home: from ~$1,890/sqm\n• Granny Flat: from ~$2,750/sqm\n• Duplex: from ~$1,800/sqm\n\nThese are indicative only — every project is different. Would you like a free detailed quote?"
    },
    areas: {
      keywords: ['area', 'location', 'where', 'suburb', 'region', 'Western Sydney', 'cover', 'service area', 'which areas'],
      response: "We're based in Sydney and service across Greater Sydney, including:\n\n• Western Sydney (Penrith, Blacktown, Parramatta)\n• Inner West\n• Eastern Suburbs\n• North Shore\n• Sutherland Shire\n• Hills District\n• South Western Sydney\n• Central Coast\n\nWhere's your project located?"
    },
    services: {
      keywords: ['service', 'offer', 'what do you', 'do you do', 'type of', 'kinds of'],
      response: "We specialise in bespoke residential construction:\n\n1. Knock Down Re-Build\n2. Custom Homes & Granny Flats\n3. Duplexes & Multi-Occupancy\n4. Consultancy & Project Management\n\nEvery project is 100% tailored — we never use templates. What are you looking to build?"
    },
    timeline: {
      keywords: ['timeline', 'how long', 'duration', 'timeframe', 'schedule', 'weeks', 'months', 'completion', 'finish'],
      response: "Typical build timelines:\n\n• Granny Flat: 4–6 months\n• Custom Home: 8–14 months\n• Duplex: 10–16 months\n• Knock Down Re-Build: 10–14 months\n\nTimelines vary based on design complexity, council approvals, and site conditions. Each project gets a detailed program before we start."
    },
    approvals: {
      keywords: ['approval', 'council', 'permit', 'da', 'cdc', 'complying development', 'paperwork', 'red tape', 'consent'],
      response: "Yes — we manage the entire approvals process for you. This includes:\n\n• Development Applications (DA)\n• Complying Development Certificates (CDC)\n• Construction Certificates\n• All council and regulatory requirements\n\nYou don't navigate the red tape alone — we handle it end-to-end."
    },
    projects: {
      keywords: ['project', 'portfolio', 'past', 'previous', 'work', 'photo', 'gallery', 'see', 'example', 'show', 'built'],
      response: "Absolutely! Check out our completed projects:\n\n• Linda Street — Duplex, Sydney ($1.5M+)\n• Smart Street — Duplex, Sydney ($1.5M+)\n• Marlborough Street — Custom Home (in progress)\n\nYou can view photos and details on our Projects page: www.kadmia.com.au/kadmia-projects.html"
    },
    licence: {
      keywords: ['licence', 'license', 'insured', 'insurance', 'qualified', 'registered', 'certified', 'legit', 'legitimate', 'abn'],
      response: "Kadmia Constructions is fully licensed and insured:\n\n• Licensed Builder — NSW Fair Trading\n• Public Liability Insurance\n• Home Warranty Insurance\n• ABN: 31 686 498 519\n\nAll work complies with the National Construction Code and Australian Standards."
    },
    quote: {
      keywords: ['quote', 'quotation', 'get started', 'start', 'build', 'building', 'interested', 'want to', 'looking to', 'how do i', 'next step', 'free consultation', 'consultation', 'site visit', 'meeting', 'discuss'],
      response: "I'd love to arrange a free consultation for you. Let me grab a few details and Kadmia will get back to you within one business day."
    }
  };

  /* ── CREATE DOM ── */
  var root = document.createElement('div');
  root.id = 'kadmia-chatbot-root';
  root.innerHTML = '\
    <div class="kcb-launcher" id="kcb-launcher" aria-label="Chat with Kadmia Constructions">\
      <svg class="kcb-icon kcb-icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>\
      <svg class="kcb-icon kcb-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\
    </div>\
    <div class="kcb-window" id="kcb-window">\
      <div class="kcb-header">\
        <div class="kcb-header-brand">\
          <div class="kcb-header-logo">KADMIA<span>.</span></div>\
          <div class="kcb-header-sub">CONSTRUCTIONS</div>\
        </div>\
        \
      </div>\
      <div class="kcb-body" id="kcb-body">\
        <div class="kcb-msg kcb-msg-bot">\
          Hi! I\'m here to help with any questions about Kadmia Constructions. Ask me about pricing, services, timelines — or request a free quote!\
        </div>\
        <div class="kcb-quick-btns" id="kcb-quick-btns">\
          <button class="kcb-quick-btn" data-q="pricing">Pricing &amp; costs</button>\
          <button class="kcb-quick-btn" data-q="services">What we build</button>\
          <button class="kcb-quick-btn" data-q="how long">Build timeline</button>\
          <button class="kcb-quick-btn" data-q="quote">Get a free quote</button>\
        </div>\
      </div>\
      <div class="kcb-footer">\
        <input class="kcb-input" id="kcb-input" type="text" placeholder="Type your question..." autocomplete="off">\
        <button class="kcb-send" id="kcb-send" aria-label="Send">&#8593;</button>\
      </div>\
    </div>';

  /* ── STYLES ── */
  var style = document.createElement('style');
  style.textContent = '\
    #kadmia-chatbot-root { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: "Barlow", sans-serif; }\
    .kcb-launcher { width: 56px; height: 56px; border-radius: 50%; background: #c8a96e; color: #0a1628; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.25); transition: transform 0.2s, background 0.2s; position: relative; }\
    .kcb-launcher:hover { background: #e0c48a; transform: scale(1.05); }\
    .kcb-icon-close { display: none; }\
    .kcb-open .kcb-icon-chat { display: none; }\
    .kcb-open .kcb-icon-close { display: block; }\
    .kcb-window { position: absolute; bottom: 72px; right: 0; width: 380px; max-height: 560px; background: #0f2040; border: 1px solid rgba(200,169,110,0.2); border-radius: 12px; overflow: hidden; display: none; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }\
    .kcb-open .kcb-window { display: flex; }\
    .kcb-header { background: #0a1628; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(200,169,110,0.15); flex-shrink: 0; }\
    .kcb-header-logo { font-family: "Bebas Neue", sans-serif; font-size: 20px; letter-spacing: 0.1em; color: #f5f2ed; line-height: 1; }\
    .kcb-header-logo span { color: #c8a96e; }\
    .kcb-header-sub { font-family: "Barlow Condensed", sans-serif; font-size: 8px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(200,169,110,0.6); }\
    .kcb-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; max-height: 380px; scroll-behavior: smooth; }\
    .kcb-body::-webkit-scrollbar { width: 4px; }\
    .kcb-body::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.25); border-radius: 2px; }\
    .kcb-msg { font-size: 13px; line-height: 1.55; padding: 10px 14px; border-radius: 10px; max-width: 85%; word-wrap: break-word; white-space: pre-line; }\
    .kcb-msg-bot { background: rgba(200,169,110,0.1); color: #c5cdd8; align-self: flex-start; border-bottom-left-radius: 2px; }\
    .kcb-msg-user { background: rgba(200,169,110,0.2); color: #f5f2ed; align-self: flex-end; border-bottom-right-radius: 2px; text-align: right; }\
    .kcb-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; }\
    .kcb-quick-btn { font-family: "Barlow", sans-serif; font-size: 12px; padding: 8px 14px; border: 1px solid rgba(200,169,110,0.3); background: rgba(200,169,110,0.06); color: #c8a96e; border-radius: 20px; cursor: pointer; transition: background 0.2s, border-color 0.2s; white-space: nowrap; }\
    .kcb-quick-btn:hover { background: rgba(200,169,110,0.18); border-color: #c8a96e; }\
    .kcb-footer { padding: 12px 16px; border-top: 1px solid rgba(200,169,110,0.1); display: flex; gap: 8px; align-items: center; flex-shrink: 0; }\
    .kcb-input { flex: 1; background: #0a1628; border: 1px solid rgba(200,169,110,0.2); border-radius: 20px; padding: 10px 16px; color: #f5f2ed; font-family: "Barlow", sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; }\
    .kcb-input:focus { border-color: #c8a96e; }\
    .kcb-input::placeholder { color: #8a9ab0; }\
    .kcb-send { width: 36px; height: 36px; border-radius: 50%; background: #c8a96e; color: #0a1628; border: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; flex-shrink: 0; }\
    .kcb-send:hover { background: #e0c48a; }\
    .kcb-typing { display: flex; gap: 4px; padding: 10px 14px; }\
    .kcb-typing span { width: 6px; height: 6px; border-radius: 50%; background: #c8a96e; animation: kcb-bounce 1.4s ease-in-out infinite both; }\
    .kcb-typing span:nth-child(2) { animation-delay: 0.2s; }\
    .kcb-typing span:nth-child(3) { animation-delay: 0.4s; }\
    @keyframes kcb-bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }\
    @media (max-width: 440px) { .kcb-window { width: calc(100vw - 40px); right: -4px; max-height: 480px; } }\
  ';
  document.head.appendChild(style);
  document.body.appendChild(root);

  /* ── DOM REFS ── */
  var launcher = document.getElementById('kcb-launcher');
  var windowEl = document.getElementById('kcb-window');
  var bodyEl   = document.getElementById('kcb-body');
  var inputEl  = document.getElementById('kcb-input');
  var sendBtn  = document.getElementById('kcb-send');
  var quickBtns = document.getElementById('kcb-quick-btns');

  /* ── HELPERS ── */
  function scrollDown(){
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function addMsg(text, who){
    var div = document.createElement('div');
    div.className = 'kcb-msg kcb-msg-' + who;
    div.textContent = text;
    bodyEl.appendChild(div);
    state.history.push({ who: who, text: text });
    scrollDown();
  }

  function addTyping(){
    var div = document.createElement('div');
    div.className = 'kcb-msg kcb-msg-bot kcb-typing';
    div.id = 'kcb-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    bodyEl.appendChild(div);
    scrollDown();
  }

  function removeTyping(){
    var t = document.getElementById('kcb-typing');
    if (t) t.remove();
  }

  function showQuickBtns(btns){
    quickBtns.innerHTML = '';
    btns.forEach(function(b){
      var btn = document.createElement('button');
      btn.className = 'kcb-quick-btn';
      btn.textContent = b.label;
      btn.addEventListener('click', function(){ handleUserInput(b.value); });
      quickBtns.appendChild(btn);
    });
    quickBtns.style.display = 'flex';
    scrollDown();
  }

  function hideQuickBtns(){
    quickBtns.style.display = 'none';
  }

  /* ── FAQ MATCHING ── */
  function matchFAQ(msg){
    var lower = msg.toLowerCase();
    for (var key in faq){
      var entry = faq[key];
      for (var i = 0; i < entry.keywords.length; i++){
        if (lower.indexOf(entry.keywords[i].toLowerCase()) !== -1){
          return { key: key, response: entry.response };
        }
      }
    }
    return null;
  }

  /* ── LEAD CAPTURE FLOW ── */
  function startLeadCapture(){
    state.step = 'lead_name';
    hideQuickBtns();
    inputEl.placeholder = 'Your full name...';
    addMsg("What's your name?", 'bot');
  }

  function processLeadInput(text){
    switch(state.step){
      case 'lead_name':
        state.lead.name = text.trim();
        state.step = 'lead_phone';
        inputEl.placeholder = 'Your phone number...';
        addMsg('Thanks ' + state.lead.name.split(' ')[0] + '! What\'s the best phone number to reach you on?', 'bot');
        break;
      case 'lead_phone':
        state.lead.phone = text.trim();
        state.step = 'lead_email';
        inputEl.placeholder = 'Your email address...';
        addMsg('Got it. And your email address?', 'bot');
        break;
      case 'lead_email':
        state.lead.email = text.trim();
        state.step = 'lead_service';
        var serviceBtns = [
          { label: 'Knock Down Re-Build', value: 'Knock Down Re-Build' },
          { label: 'Custom Home', value: 'Custom Home' },
          { label: 'Granny Flat', value: 'Granny Flat' },
          { label: 'Duplex / Multi-Occ', value: 'Duplex' },
          { label: 'Not sure yet', value: 'Not sure' },
          { label: 'Consultancy Only', value: 'Consultancy' }
        ];
        addMsg('What type of project are you looking at?', 'bot');
        showQuickBtns(serviceBtns);
        inputEl.placeholder = 'Or type your project type...';
        break;
      case 'lead_service':
        state.lead.service = text.trim();
        state.step = 'lead_done';
        // Submit the lead
        submitLead();
        var doneMsg = 'Thanks ' + state.lead.name.split(' ')[0] + '! Kadmia will get back to you within one business day.\n\nIn the meantime, feel free to check out our projects at www.kadmia.com.au/kadmia-projects.html';
        addMsg(doneMsg, 'bot');
        inputEl.placeholder = 'Ask another question...';
        hideQuickBtns();
        // Reset to FAQ mode
        setTimeout(function(){
          state.step = 'faq';
          showQuickBtns([
            { label: 'Pricing & costs', value: 'pricing' },
            { label: 'What we build', value: 'services' },
            { label: 'Build timeline', value: 'how long' },
            { label: 'Get a free quote', value: 'quote' }
          ]);
        }, 2000);
        break;
    }
  }

  /* ── SUBMIT LEAD ── */
  function submitLead(){
    var data = new FormData();
    data.append('_subject', 'New Chatbot Lead — ' + state.lead.name + ' | Kadmia Constructions');
    data.append('_captcha', 'false');
    data.append('_template', 'table');
    data.append('firstName', state.lead.name);
    data.append('phone', state.lead.phone);
    data.append('email', state.lead.email);
    data.append('service', state.lead.service);
    data.append('message', 'Lead captured via Kadmia website chatbot. Project type: ' + state.lead.service);
    fetch('https://formsubmit.co/info@kadmia.com.au', { method: 'POST', body: data }).catch(function(){});
  }

  /* ── HANDLE USER INPUT ── */
  function handleUserInput(text){
    state.lastUserMessage = text;
    hideQuickBtns();

    if (state.step !== 'faq' && state.step !== 'lead_done'){
      addMsg(text, 'user');
      processLeadInput(text);
      return;
    }

    addMsg(text, 'user');

    // Show typing indicator
    addTyping();

    setTimeout(function(){
      removeTyping();

      var match = matchFAQ(text);

      if (match){
        addMsg(match.response, 'bot');
        // If cost/quote/service related prompt for lead capture
        if (match.key === 'cost' || match.key === 'quote'){
          setTimeout(function(){
            addMsg("Would you like a free, no-obligation quote? I can take your details and Kadmia will reach out.", 'bot');
            showQuickBtns([
              { label: 'Yes — get a quote', value: 'quote' },
              { label: 'Not right now', value: 'no thanks' }
            ]);
          }, 600);
        } else {
          showQuickBtns([
            { label: 'Pricing & costs', value: 'pricing' },
            { label: 'What we build', value: 'services' },
            { label: 'Build timeline', value: 'how long' },
            { label: 'Get a free quote', value: 'quote' }
          ]);
        }
      } else {
        // Check if they're saying yes to quote
        if (/^(yes|yeah|sure|ok|okay|yep|please|definitely|absolutely)/i.test(text)){
          showQuickBtns([
            { label: 'Get your free quote →', value: 'quote' }
          ]);
          addMsg("Great! Click below and I'll grab your details.", 'bot');
        } else if (/no|not right now|later|just looking|browsing/i.test(text)){
          addMsg("No worries! I'm here whenever you're ready. Feel free to ask anything else.", 'bot');
          showQuickBtns([
            { label: 'Pricing & costs', value: 'pricing' },
            { label: 'What we build', value: 'services' },
            { label: 'Build timeline', value: 'how long' }
          ]);
        } else {
          addMsg("I'm not sure about that one — but I can help with pricing, services, timelines, approvals, or past projects. What would you like to know?", 'bot');
          showQuickBtns([
            { label: 'Pricing & costs', value: 'pricing' },
            { label: 'What we build', value: 'services' },
            { label: 'Build timeline', value: 'how long' },
            { label: 'Get a free quote', value: 'quote' }
          ]);
        }
      }
    }, 600 + Math.random() * 400);
  }

  /* ── EVENT LISTENERS ── */
  launcher.addEventListener('click', function(){
    state.open = !state.open;
    launcher.parentElement.classList.toggle('kcb-open', state.open);
    if (state.open) { inputEl.focus(); scrollDown(); }
  });

  sendBtn.addEventListener('click', function(){
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';

    if (state.step === 'lead_service' && quickBtns.style.display !== 'none'){
      // They typed instead of clicking a quick button
      handleUserInput(text);
      return;
    }

    handleUserInput(text);
  });

  inputEl.addEventListener('keydown', function(e){
    if (e.key === 'Enter') { e.preventDefault(); sendBtn.click(); }
  });

  // Quick buttons
  quickBtns.addEventListener('click', function(e){
    var btn = e.target.closest('.kcb-quick-btn');
    if (!btn) return;
    var val = btn.dataset.q;
    if (val === 'quote'){
      startLeadCapture();
      return;
    }
    // Treat as user input
    inputEl.value = val;
    sendBtn.click();
  });
})();
