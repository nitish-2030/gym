/* ═══════════════════════════════
   WORKOUT ZONE — script.js
═══════════════════════════════ */
(function () {
  'use strict';

  var WA_NUMBER = '916232886847';
  var MAP_COORDS = '24.543153,81.2720895';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ── Loader ── */
  var loader = $('#loader');
  function hideLoader() {
    if (!loader || loader.dataset.hidden) return;
    loader.dataset.hidden = 'true';
    loader.classList.add('hide');
    setTimeout(function () { if (loader.parentNode) loader.remove(); }, 700);
  }
  setTimeout(hideLoader, 1600);

  /* ── Theme Toggle ── */
  var themeBtn = $('#themeBtn');
  function readTheme() {
    try { return localStorage.getItem('wz-theme') === 'dark' ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }
  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }
  applyTheme(readTheme());
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('wz-theme', next); } catch (e) { /* storage unavailable — theme just won't persist */ }
    });
  }

  /* ── Navbar scroll effect + bottom-nav active state (one throttled handler) ── */
  var navbar = $('#navbar');
  var botNavItems = $$('.bot-nav-item');
  var navSections = botNavItems.map(function (i) { return i.dataset.sec; });

  function onScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    var active = navSections[0];
    navSections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) active = id;
    });
    botNavItems.forEach(function (item) {
      var isActive = item.dataset.sec === active;
      item.classList.toggle('active', isActive);
      if (isActive) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    });
  }
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () { onScroll(); scrollTicking = false; });
  }, { passive: true });
  onScroll();

  /* ── Animated Counters (HTML already contains the final values for no-JS / reduced motion) ── */
  function animateCounter(el, target, duration) {
    var suffix = target >= 100 ? '+' : '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var t0 = performance.now();
    (function frame(now) {
      var p = Math.min((now - t0) / duration, 1);
      el.textContent = Math.floor(target * p) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }
  var statsSection = $('#stats');
  if (statsSection && hasIO) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        $$('[data-target]', entry.target).forEach(function (el) {
          var target = parseInt(el.dataset.target, 10);
          if (!isNaN(target)) animateCounter(el, target, 1600);
        });
        counterObs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    counterObs.observe(statsSection);
  }

  /* ── Scroll Reveal ── */
  var revealEls = $$('.reveal');
  if (hasIO && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        setTimeout(function () { entry.target.classList.add('visible'); }, 80);
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Testimonials Slider ── */
  var track = $('#testiTrack');
  var dots = $$('.testi-dot');
  if (track && dots.length) {
    var cards = track.children;
    var autoTimer = null;
    var userPaused = false;
    var sliderInView = true;

    var currentIndex = function () {
      return track.offsetWidth ? Math.round(track.scrollLeft / track.offsetWidth) : 0;
    };
    var setActiveDot = function (i) {
      dots.forEach(function (d, j) {
        var on = j === i;
        d.classList.toggle('active', on);
        if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    };
    var goToSlide = function (i) {
      var n = (i + cards.length) % cards.length;
      track.scrollTo({ left: n * track.offsetWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    var stopAuto = function () { clearInterval(autoTimer); autoTimer = null; };
    var startAuto = function () {
      stopAuto();
      if (reduceMotion || userPaused || !sliderInView || document.hidden) return;
      autoTimer = setInterval(function () { goToSlide(currentIndex() + 1); }, 4500);
    };

    // The dots simply mirror the scroll position, so smooth-scroll animations can't desync them.
    track.addEventListener('scroll', function () { setActiveDot(currentIndex()); }, { passive: true });
    dots.forEach(function (d, j) {
      d.addEventListener('click', function () { goToSlide(j); startAuto(); });
    });

    ['mouseenter', 'focusin', 'touchstart'].forEach(function (evt) {
      track.addEventListener(evt, function () { userPaused = true; stopAuto(); }, { passive: true });
    });
    ['mouseleave', 'focusout', 'touchend'].forEach(function (evt) {
      track.addEventListener(evt, function () { userPaused = false; startAuto(); }, { passive: true });
    });
    document.addEventListener('visibilitychange', startAuto);
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        sliderInView = entries[0].isIntersecting;
        startAuto();
      }, { threshold: 0.2 }).observe(track);
    }
    startAuto();
  }

  /* ── FAQ Accordion ── */
  $$('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      $$('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Gallery Lightbox (images are read from the gallery markup — single source of truth) ── */
  var lightbox = $('#lightbox');
  var lbContent = $('#lbContent');
  var lbClose = $('#lbClose');
  var lastFocus = null;

  function openLightbox(item) {
    var thumb = item.querySelector('img');
    if (!thumb || !lightbox) return;
    var img = document.createElement('img');
    img.className = 'lb-img';
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    lbContent.replaceChildren(img);
    lastFocus = document.activeElement;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    if (!lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lbContent.replaceChildren();
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (lightbox && lbContent && lbClose) {
    $$('.g-item').forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(item); });
    });
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); } // only one focusable element in the dialog
    });
  }

  /* ── Toast ── */
  var toastTimer = null;
  function showToast(msg, duration) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, duration || 3000);
  }

  /* ── Map Loader (lazy, loads once) ── */
  var mapWrapper = $('#mapWrapper');
  var mapBtn = $('#mapPlaceholder');
  var mapLoaded = false;

  function loadMap() {
    if (mapLoaded || !mapWrapper || !mapBtn) return;
    mapLoaded = true;
    mapBtn.disabled = true;
    var title = $('.map-ph-title', mapBtn);
    if (title) title.textContent = 'Loading map…';

    var failTimer = setTimeout(function () {
      if (title && mapBtn.isConnected) title.textContent = 'Map could not load — use the link below';
    }, 8000);

    var iframe = document.createElement('iframe');
    iframe.src = 'https://maps.google.com/maps?q=' + MAP_COORDS + '&z=17&output=embed';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.title = 'Map showing Workout Zone, Dhekaha, Rewa';
    iframe.addEventListener('load', function () {
      clearTimeout(failTimer);
      if (mapBtn.parentNode) mapBtn.remove();
    });
    mapWrapper.appendChild(iframe);
  }
  if (mapBtn) mapBtn.addEventListener('click', loadMap);
  if (mapWrapper && hasIO) {
    var mapObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { loadMap(); mapObs.disconnect(); }
    }, { threshold: 0.1 });
    mapObs.observe(mapWrapper);
  }

  /* ── Contact Form → WhatsApp ── */
  var form = $('#contactForm');
  if (form) {
    var submitBtn = $('.btn-submit', form);
    var phoneRe = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = String(fd.get('name') || '').trim();
      var phone = String(fd.get('phone') || '').trim();
      var msg = String(fd.get('message') || '').trim();
      var planSel = form.elements.interest;
      var plan = planSel && planSel.value ? planSel.options[planSel.selectedIndex].textContent.trim() : '';

      if (!name) { showToast('Please enter your name'); form.elements.name.focus(); return; }
      if (!phoneRe.test(phone)) { showToast('Please enter a valid 10-digit mobile number'); form.elements.phone.focus(); return; }

      var lines = ['Hi Workout Zone! 👋', '', 'Name: ' + name, 'Phone: ' + phone];
      if (plan) lines.push('Interested in: ' + plan);
      if (msg) lines.push('Message: ' + msg);

      var a = document.createElement('a');
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();

      showToast('Opening WhatsApp…');
      if (submitBtn) {
        submitBtn.disabled = true; // prevent accidental double-sends
        setTimeout(function () { submitBtn.disabled = false; }, 2500);
      }
      form.reset();
    });
  }
})();