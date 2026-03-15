/* ============================================================
   RHEINEL FRED M. LACSON — GSAP ScrollTrigger Animations
   Enhancement-only: content is always visible, GSAP adds motion
   ============================================================ */
   (function () {
    'use strict';
  
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
    gsap.registerPlugin(ScrollTrigger);
  
    /* ── 1. PAGE HERO — cinematic entrance (projects page) ── */
    var heroEyebrow = document.querySelector('.page-hero .eyebrow');
    var heroTitle   = document.querySelector('.page-hero .page-title');
    var heroSub     = document.querySelector('.page-hero .page-subtitle');
  
    if (heroTitle) {
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from(heroEyebrow, { y: 30, opacity: 0, duration: 0.7, delay: 0.2 })
        .from(heroTitle,   { y: 60, opacity: 0, duration: 0.9, skewX: -3 }, '-=0.4')
        .from(heroSub,     { y: 30, opacity: 0, duration: 0.7 }, '-=0.5');
    }
  
    /* ── 2. PROJECT CARDS — alternating slide-in ── */
    var cards = document.querySelectorAll('.project-full-card');
    cards.forEach(function (card, i) {
      var visual = card.querySelector('.project-full-visual');
      var info   = card.querySelector('.project-full-info');
      var isEven = i % 2 !== 0;
  
      if (visual) {
        gsap.from(visual, {
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
          x: isEven ? 60 : -60, opacity: 0, duration: 1.0, ease: 'power3.out'
        });
      }
      if (info) {
        gsap.from(info, {
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
          x: isEven ? -40 : 40, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out'
        });
      }
  
      var numLabel = card.querySelector('.project-num-label');
      if (numLabel) {
        gsap.from(numLabel, {
          scrollTrigger: { trigger: card, start: 'top 83%', toggleActions: 'play none none none' },
          scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(1.7)'
        });
      }
  
      var title = card.querySelector('.project-full-title');
      if (title) {
        gsap.from(title, {
          scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none none' },
          y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out'
        });
      }
  
      var features = card.querySelectorAll('.project-full-features li');
      if (features.length) {
        gsap.from(features, {
          scrollTrigger: { trigger: card, start: 'top 75%', toggleActions: 'play none none none' },
          x: -20, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power2.out'
        });
      }
  
      var badges = card.querySelectorAll('.proj-stack span');
      if (badges.length) {
        gsap.from(badges, {
          scrollTrigger: { trigger: card, start: 'top 72%', toggleActions: 'play none none none' },
          scale: 0.7, opacity: 0, duration: 0.35, stagger: 0.06, delay: 0.35, ease: 'back.out(2)'
        });
      }
    });
  
    /* ── 3. CARD HOVER — subtle lift ── */
    cards.forEach(function (card) {
      var visual = card.querySelector('.project-full-visual');
      if (!visual) return;
      card.addEventListener('mouseenter', function () {
        gsap.to(visual, { y: -6, scale: 1.015, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(visual, { y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' });
      });
    });
  
    /* ── 4. FOOTER CTA ── */
    var footerHeading = document.querySelector('.footer-cta-heading');
    if (footerHeading) {
      gsap.from(footerHeading, {
        scrollTrigger: { trigger: footerHeading, start: 'top 90%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
    }
  
    /* ── 5. HERO GLOW PARALLAX ── */
    var heroGlow = document.querySelector('.page-hero .hero-glow');
    if (heroGlow) {
      gsap.to(heroGlow, {
        scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
        y: -60, opacity: 0.3, ease: 'none'
      });
    }
  
  }());