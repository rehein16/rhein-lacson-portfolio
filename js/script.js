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
  backToTop.addEventListener('click', function () {
    var start = window.scrollY || document.documentElement.scrollTop;
    var startTime = null;
    var duration = 700;

    function easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start * (1 - easeInOutQuart(progress)));
      if (elapsed < duration) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
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
/* ══════════════════════════════════════════════
   STACKED CARD DECK — Cycle projects
══════════════════════════════════════════════ */
(function() {
  const deck = document.getElementById('stackedDeck');
  const btn = document.getElementById('stackNextBtn');
  const dotsEl = document.getElementById('stackDots');
  const progressFill = document.getElementById('stackProgress');
  const infoContent = document.getElementById('stackInfoContent');
  if (!deck || !btn) return;

  const cards = Array.from(deck.querySelectorAll('.stack-card'));
  const dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.stack-dot')) : [];
  const total = cards.length;
  let current = 0;
  let isAnimating = false;

  // Project data — order matches HTML card order (index 0 = bottom card, last = top card)
  const projects = [
    {
      category: 'Food & Beverage · Restaurant Website',
      title: 'WINGS 2 GO',
      desc: 'A vibrant, fully responsive restaurant website featuring an interactive menu, online ordering flow, and bold visual identity for a local wing spot.',
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      live: 'https://rehein16.github.io/Wings-2-Go/',
      github: 'https://github.com/rehein16/Wings-2-Go'
    },
    {
      category: 'E-Commerce · Luxury Perfume · Group Project',
      title: 'VELOUR',
      desc: 'A sophisticated e-commerce platform crafted for fragrance enthusiasts. Dark gold aesthetic with dynamic cart, PHP pricing integration, and admin portal.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
      live: 'http://velourperfumes.onlinewebshop.net/login.php',
      github: 'https://github.com/Jz100505/Velour'
    },
    {
      category: 'Disaster Relief · Donation Platform',
      title: 'AID4ODETTE',
      desc: 'A responsive donation portal built to support communities devastated by Typhoon Rai. Designed for high-impact calls to action with accessible information architecture.',
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      live: 'https://rehein16.github.io/Aid4Odette---Phillipines/',
      github: 'https://github.com/rehein16/Aid4Odette---Phillipines'
    }
  ];

  function updateInfoPanel(idx) {
    if (!infoContent) return;
    const p = projects[idx];

    // Fade out
    infoContent.classList.add('fade-out');

    setTimeout(() => {
      infoContent.querySelector('.stack-info-category').textContent = p.category;
      infoContent.querySelector('.stack-info-title').textContent = p.title;
      infoContent.querySelector('.stack-info-desc').textContent = p.desc;

      const stackEl = infoContent.querySelector('.stack-info-stack');
      stackEl.innerHTML = p.stack.map(s => `<span>${s}</span>`).join('');

      const linksEl = infoContent.querySelector('.stack-info-links');
      linksEl.innerHTML = `
        <a href="${p.live}" class="proj-link primary" target="_blank" rel="noopener">Live Demo ↗</a>
        <a href="${p.github}" class="proj-link secondary" target="_blank" rel="noopener">GitHub ↗</a>
      `;

      infoContent.classList.remove('fade-out');
      infoContent.classList.add('fade-in');
      setTimeout(() => infoContent.classList.remove('fade-in'), 350);
    }, 280);
  }

  function updateStack() {
    cards.forEach((card, i) => {
      const layer = ((i - current) + total) % total;
      if (layer === 0) {
        card.style.zIndex = '3';
        card.style.transform = 'translateY(0) rotate(0deg) scale(1)';
        card.style.opacity = '1';
        card.style.boxShadow = '0 24px 80px rgba(79,142,247,0.18), 0 8px 40px rgba(0,0,0,0.55)';
      } else if (layer === 1) {
        card.style.zIndex = '2';
        card.style.transform = 'translateY(-14px) rotate(-3deg) scale(0.96)';
        card.style.opacity = '1';
        card.style.boxShadow = '';
      } else {
        card.style.zIndex = '1';
        card.style.transform = 'translateY(-28px) rotate(-6deg) scale(0.92)';
        card.style.opacity = '1';
        card.style.boxShadow = '';
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    if (progressFill) progressFill.style.width = ((current + 1) / total * 100) + '%';
  }

  function cycleNext() {
    if (isAnimating) return;
    isAnimating = true;

    const topCard = cards[current];
    topCard.style.transition = 'transform 0.45s cubic-bezier(0.4,0,1,1), opacity 0.38s ease';
    topCard.style.transform = 'translateY(-80px) translateX(-60px) rotate(-8deg) scale(0.82)';
    topCard.style.opacity = '0';
    topCard.style.zIndex = '10';

    setTimeout(() => {
      current = (current + 1) % total;

      // Snap card back to bottom silently
      topCard.style.transition = 'none';
      topCard.style.transform = 'translateY(-28px) rotate(-6deg) scale(0.92)';
      topCard.style.opacity = '1';
      topCard.style.zIndex = '1';
      topCard.style.boxShadow = '';
      topCard.getBoundingClientRect(); // force reflow
      topCard.style.transition = '';

      updateStack();
      updateInfoPanel(current);
      isAnimating = false;
    }, 470);
  }

  btn.addEventListener('click', cycleNext);

  deck.addEventListener('click', (e) => {
    const card = e.target.closest('.stack-card');
    if (!card) return;
    const idx = cards.indexOf(card);
    if (idx === current && !e.target.closest('a')) cycleNext();
  });

  // Initialize
  updateStack();
  if (progressFill) progressFill.style.width = '33.33%';
})();



/* ══════════════════════════════════════════════
   FLASHLIGHT CURSOR + MAGNET EFFECT
══════════════════════════════════════════════ */
(function() {
  // Create global flashlight cursor dot
  const cursorDot = document.createElement('div');
  cursorDot.className = 'flashlight-cursor';
  document.body.appendChild(cursorDot);

  // ── Flashlight on stack card images ──────────────────
  function initFlashlightOnEl(el) {
    el.classList.add('photo-flashlight');

    // Create beam element
    const beam = document.createElement('div');
    beam.className = 'flashlight-beam';
    el.appendChild(beam);

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      beam.style.left = x + 'px';
      beam.style.top  = y + 'px';

      // Move global cursor dot too
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top  = e.clientY + 'px';
    });

    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('active');
    });
  }

  // ── Magnet effect ─────────────────────────────────────
  function initMagnetOnEl(el) {
    el.classList.add('magnet-photo');
    const strength = 18; // max px shift

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px) scale(1.03)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }

  // ── Apply to stack card images ────────────────────────
  function applyToStackCards() {
    document.querySelectorAll('.stack-card-img').forEach(imgWrap => {
      initFlashlightOnEl(imgWrap);
      initMagnetOnEl(imgWrap);
    });
  }

  // ── Reverse magnet (repel) effect for projects page ──────────
  function initReverseMagnetOnEl(el) {
    el.classList.add('reverse-magnet-card');
    const strength = 22;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      // REVERSE: move AWAY from cursor
      el.style.transform = `translate(${-dx * strength}px, ${-dy * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }

  // ── Apply to projects page: flashlight on image, reverse magnet on box ──
  function applyToProjectThumbs() {
    document.querySelectorAll('.project-full-visual .proj-browser-screen').forEach(screen => {
      initFlashlightOnEl(screen);
    });
    document.querySelectorAll('.project-full-visual').forEach(box => {
      initReverseMagnetOnEl(box);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyToStackCards();
      applyToProjectThumbs();
    });
  } else {
    applyToStackCards();
    applyToProjectThumbs();
  }
})();
/* ═══════════════════════════════════════════════
   SCROLL REVEAL — fade+slide sections into view
═══════════════════════════════════════════════ */
(function () {
  function initReveal() {
    var targets = document.querySelectorAll(
      '.section-title, .about-grid, .skill-card, .proj-card, .cert-card, .timeline-item, .contact-form'
    );
    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();