/* ─── INIT: reset any stale inline opacity ──────────────── */
document.body.style.opacity = '1';
document.body.style.transition = '';

/* ─── RESET BODY OPACITY (page transition fix) ──────────── */
document.body.style.opacity = '1';
document.body.style.transition = '';

/* ============================================================
   RHEINEL FRED M. LACSON — Portfolio v3.0 JavaScript
   No custom cursor — 100% native.
   ============================================================ */

/* ─── NAV SCROLL ─────────────────────────────────────────── */
var nav = document.getElementById('nav');
window.addEventListener('scroll', function () {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── HAMBURGER / MOBILE MENU ────────────────────────────── */
(function () {
  var hamburger   = document.getElementById('hamburger');
  var navLinks    = document.getElementById('nav-links');
  var closeBtn    = document.getElementById('menuCloseBtn');

  /* Create overlay element */
  var overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  overlay.id = 'menuOverlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    overlay.classList.add('visible');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    /* Escape key closes */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
}());

/* ─── THEME / ACTIVE NAV ─────────────────────────────────── */
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html'))
      link.classList.add('active');
    else
      link.classList.remove('active');
  });
}());

/* ─── NAV PILL INDICATOR ─────────────────────────────────── */
(function () {
  var pill  = document.querySelector('.nav-pill');
  var links = document.querySelectorAll('.nav-links .nav-link');
  if (!pill || !links.length) return;

  var activeLink = document.querySelector('.nav-links .nav-link.active');

  function move(el) {
    var pRect = el.closest('.nav-links').getBoundingClientRect();
    var r     = el.getBoundingClientRect();
    pill.style.width   = r.width + 'px';
    pill.style.left    = (r.left - pRect.left) + 'px';
    pill.style.opacity = '1';
  }

  if (activeLink) requestAnimationFrame(function () { move(activeLink); });

  links.forEach(function (link) {
    link.addEventListener('mouseenter', function () { move(link); });
    link.addEventListener('mouseleave', function () {
      if (activeLink) move(activeLink);
      else pill.style.opacity = '0';
    });
  });
}());

/* ─── THEME TOGGLE ───────────────────────────────────────── */
var themeToggle = document.getElementById('themeToggle');
var themeIcon   = document.getElementById('themeIcon');
var htmlEl      = document.documentElement;
(function () {
  var saved = localStorage.getItem('theme') || 'dark';
  htmlEl.setAttribute('data-theme', saved);
  if (themeIcon) themeIcon.textContent = saved === 'dark' ? '☀' : '☾';
}());
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    var isDark = htmlEl.getAttribute('data-theme') === 'dark';
    var next   = isDark ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (themeIcon) themeIcon.textContent = next === 'dark' ? '☀' : '☾';
  });
}

/* ─── TYPEWRITER ─────────────────────────────────────────── */
var taglineEl = document.getElementById('heroTagline');
if (taglineEl) {
  var phrases   = ['Front-End Developer.', 'UI/UX Designer.', 'Problem Solver.', 'Always Building.', 'Junior Web Dev.'];
  var phraseIdx = 0, charIdx = 0, deleting = false;
  function typewriter() {
    var phrase = phrases[phraseIdx];
    if (!deleting) {
      taglineEl.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) { deleting = true; setTimeout(typewriter, 1800); return; }
      setTimeout(typewriter, 75);
    } else {
      taglineEl.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typewriter, 350);
        return;
      }
      setTimeout(typewriter, 40);
    }
  }
  setTimeout(typewriter, 800);
}

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry, i) {
    if (entry.isIntersecting) {
      setTimeout(function () { entry.target.classList.add('visible'); }, i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });
/* Trigger elements already in viewport on load */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(function () { el.classList.add('visible'); }, i * 60);
    }
  });
});

/* ─── SKILL BARS ─────────────────────────────────────────── */
var skillSection = document.getElementById('skillsSection');
if (skillSection) {
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
          bar.style.width = bar.getAttribute('data-w') + '%';
        });
      }
    });
  }, { threshold: 0.2 }).observe(skillSection);
}

/* ─── BLOG EXPAND ────────────────────────────────────────── */
document.querySelectorAll('.blog-read-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var post   = btn.closest('.blog-post');
    var body   = post.querySelector('.blog-post-body');
    var open   = body.style.display === 'block';
    body.style.display = open ? 'none' : 'block';
    btn.textContent = open ? 'Read More ↓' : 'Collapse ↑';
  });
});

/* ─── CONTACT FORM handled inline in contact.html ──────── */


/* ─── BACK TO TOP ────────────────────────────────────────── */
var backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* ─── PAGE TRANSITION ────────────────────────────────────── */
document.querySelectorAll('a[href]').forEach(function (link) {
  var href = link.getAttribute('href') || '';
  if (!href || href.charAt(0) === '#') return;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return;
  if (link.hasAttribute('download') || /\.pdf$/i.test(href)) return;
  if (link.target === '_blank') return;

  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.style.transition = 'opacity 0.18s';
    document.body.style.opacity    = '0';
    setTimeout(function () { window.location.href = href; }, 200);
  });
});
/* ─── CUSTOM CURSOR ─────────────────────────────────────── */
(function(){
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var mx=-100, my=-100, rx=-100, ry=-100;
  document.addEventListener('mousemove', function(e){
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
  });
  (function loop(){
    rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  var sel='a,button,[role="button"],input,textarea,.tool-pill,.proj-card,.cert-tease-card,.nav-link,.contact-quick-item';
  document.querySelectorAll(sel).forEach(function(el){
    el.addEventListener('mouseenter',function(){document.body.classList.add('cur-hover');});
    el.addEventListener('mouseleave',function(){document.body.classList.remove('cur-hover');});
  });
  document.addEventListener('mousedown',function(){document.body.classList.add('cur-click');});
  document.addEventListener('mouseup',  function(){document.body.classList.remove('cur-click');});
}());