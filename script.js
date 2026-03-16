/* ═══════════════════════════════
   WORKOUT ZONE — script.js
═══════════════════════════════ */

/* ── Map Loader (lazy, non-blocking) ── */
function loadMap() {
  const wrapper = document.getElementById('mapWrapper');
  const placeholder = document.getElementById('mapPlaceholder');
  if (!placeholder) return;
  placeholder.innerHTML = '<span style="font-size:0.82rem;color:var(--text-sub)">Loading map…</span>';
  const iframe = document.createElement('iframe');
  iframe.src = 'https://maps.google.com/maps?q=24.543153,81.2720895&z=17&output=embed';
  iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.title = 'Workout Zone Location';
  iframe.onload = () => { if (placeholder.parentNode) placeholder.remove(); };
  wrapper.appendChild(iframe);
}

const mapObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { loadMap(); mapObs.disconnect(); }
}, { threshold: 0.1 });

/* ── Loader ── */
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.dataset.hidden) return;
  loader.dataset.hidden = 'true';
  loader.classList.add('hide');
  setTimeout(() => { if (loader.parentNode) loader.remove(); }, 700);
}
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoader, 1600);
  const mw = document.getElementById('mapWrapper');
  if (mw) mapObs.observe(mw);
});
setTimeout(hideLoader, 3000);

/* ── Theme Toggle ── */
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('wz-theme') || 'light';
document.body.dataset.theme = savedTheme;
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const isDark = document.body.dataset.theme === 'dark';
  document.body.dataset.theme = isDark ? 'light' : 'dark';
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('wz-theme', document.body.dataset.theme);
});

/* ── Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Bottom Nav Active State ── */
const botNavItems = document.querySelectorAll('.bot-nav-item');
const sections = ['home', 'timetable', 'membership', 'contact'];

function updateBotNav() {
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  botNavItems.forEach(item => {
    item.classList.toggle('active', item.dataset.sec === current);
  });
}
window.addEventListener('scroll', updateBotNav, { passive: true });

botNavItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = document.getElementById(item.dataset.sec);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Animated Counters ── */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (target >= 100 ? '+' : '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (target >= 100 ? '+' : '');
    }
  }, 16);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) counterObs.observe(statsSection);

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Testimonials Slider ── */
const track = document.getElementById('testiTrack');
const dots  = document.querySelectorAll('.testi-dot');
let current = 0, autoTimer;
const cards = track.children;

function goToSlide(i) {
  current = (i + cards.length) % cards.length;
  track.scrollTo({ left: current * track.offsetWidth, behavior: 'smooth' });
  dots.forEach((d, j) => d.classList.toggle('active', j === current));
}

dots.forEach(d => d.addEventListener('click', () => { goToSlide(+d.dataset.i); resetAuto(); }));

track.addEventListener('scroll', () => {
  const i = Math.round(track.scrollLeft / track.offsetWidth);
  if (i !== current) {
    current = i;
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
  }
}, { passive: true });

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goToSlide(current + 1), 4500);
}
resetAuto();

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Gallery Lightbox ── */
const lightbox  = document.getElementById('lightbox');
const lbContent = document.getElementById('lbContent');
const lbClose   = document.getElementById('lbClose');

const galleryImgs   = ['img1.jpg','img2.jpg','img3.jpg','img4.jpg','img5.jpg','img6.jpg'];
const galleryLabels = ['Barbell Training','Strength Zone','Dumbbell Rack','Powerlifting','Pull-up Bar','Ladies Zone'];

document.querySelectorAll('.g-item').forEach((item, i) => {
  item.addEventListener('click', () => {
    lbContent.innerHTML = `<img src="${galleryImgs[i]}" alt="${galleryLabels[i]}" style="width:100%;border-radius:16px;display:block;max-height:80vh;object-fit:contain;" />`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

lbClose.addEventListener('click', closeLb);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
function closeLb() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }

/* ── Toast ── */
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Contact Form → WhatsApp ── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const fd    = new FormData(e.target);
  const name  = fd.get('name')     || '';
  const phone = fd.get('phone')    || '';
  const plan  = fd.get('interest') || '';
  const msg   = fd.get('message')  || '';

  const text = encodeURIComponent(
    `Hi Workout Zone! 👋\n\nName: ${name}\nPhone: ${phone}\nInterested in: ${plan}${msg ? '\nMessage: ' + msg : ''}`
  );
  window.open(`https://wa.me/916268238126?text=${text}`, '_blank');
  showToast('✅ Opening WhatsApp…');
  e.target.reset();
});
