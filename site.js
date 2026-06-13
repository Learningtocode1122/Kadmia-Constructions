/* ═══════════════════════════════════════════════
   KADMIA CONSTRUCTIONS — SHARED SCRIPTS
   Single source of truth for all global JS.
   ═══════════════════════════════════════════════ */

(function(){
  'use strict';

  /* ── PREFETCH NAV LINKS ── */
  document.querySelectorAll('.nav-links a, a.nav-logo, a.nav-cta').forEach(function(a){
    var h = a.getAttribute('href');
    if (h && !h.startsWith('#') && !h.startsWith('http')) {
      var l = document.createElement('link');
      l.rel = 'prefetch'; l.href = h; l.as = 'document';
      document.head.appendChild(l);
    }
  });

  /* ── NAV SCROLL ── */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── MOBILE MENU ── */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function(){
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileMenu.classList.toggle('open', !open);
    });
    mobileMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
      });
    });
  }

})();
