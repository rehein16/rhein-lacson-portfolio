(function () {
  'use strict';

  var c = document.getElementById('starsCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, frame = 0;
  var scrollY = 0, heroH = 0;
  var mouseX = 0, mouseY = 0;
  var celestialOpacity = 1;

  c.style.position = 'fixed';
  c.style.top      = '0';
  c.style.left     = '0';
  c.style.width    = '100%';
  c.style.height   = '100%';
  c.style.pointerEvents = 'none';
  c.style.zIndex   = '0';

  /* ══ PAGE DETECTION ════════════════════════════════ */
  var path = window.location.pathname.toLowerCase();
  var PAGE = 'index';
  if      (path.includes('about'))          PAGE = 'about';
  else if (path.includes('project'))        PAGE = 'projects';
  else if (path.includes('certif'))         PAGE = 'certifications';
  else if (path.includes('resume'))         PAGE = 'resume';
  else if (path.includes('contact'))        PAGE = 'contact';
  else if (path.includes('blog'))           PAGE = 'blog';

  /* ══ PAGE CONFIG — planet + star per page ══════════ */
  /*
    index         : Saturn   + Sirius      (classic, iconic)
    about         : Jupiter  + Betelgeuse  (largest, bold red giant)
    projects      : Mars     + Antares     (red, fiery, creative energy)
    certifications: Venus    + Vega        (brightest achiever, shining)
    resume        : Mercury  + Polaris     (guiding north star)
    contact       : Neptune  + Rigel       (deep blue, distant, elegant)
    blog          : Uranus   + Aldebaran   (icy tilt, warm golden)
  */
  var PAGE_CFG = {
    index: {
      planet: 'saturn',
      star:   'sirius'
    },
    about: {
      planet: 'jupiter',
      star:   'betelgeuse'
    },
    projects: {
      planet: 'mars',
      star:   'antares'
    },
    certifications: {
      planet: 'venus',
      star:   'vega'
    },
    resume: {
      planet: 'mercury',
      star:   'polaris'
    },
    contact: {
      planet: 'neptune',
      star:   'rigel'
    },
    blog: {
      planet: 'uranus',
      star:   'aldebaran'
    }
  };

  var cfg = PAGE_CFG[PAGE] || PAGE_CFG.index;

  /* ══ SCROLL FADE ════════════════════════════════════ */
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY;
    var hero = document.getElementById('hero') || document.querySelector('.page-hero');
    heroH = hero ? hero.offsetHeight : window.innerHeight;
    var fadeZone = heroH * 0.3;
    celestialOpacity = Math.max(0, Math.min(1, 1 - scrollY / fadeZone));
  }, { passive: true });

  /* ══ MOUSE PARALLAX ════════════════════════════════ */
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX / W - 0.5;
    mouseY = e.clientY / H - 0.5;
  }, { passive: true });

  function getPos(base, strength) {
    return {
      x: base.bx + mouseX * 18 * (strength || 1),
      y: base.by + mouseY * 10 * (strength || 1)
    };
  }

  /* ══ STARS ══════════════════════════════════════════ */
  var stars = [], shootingStars = [];
  var MOON = {}, PLANET = {}, FEATURED_STAR = {};

  function initStars() {
    stars = [];
    for (var i = 0; i < 260; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.15,
        a: Math.random() * 0.85 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.003
      });
    }
    shootingStars = [];

    MOON.bx = W * 0.12;
    MOON.by = H * 0.10;
    MOON.r  = Math.min(W, H) * 0.038;

    PLANET.bx = W * 0.82;
    PLANET.by = H * 0.13;
    PLANET.r  = Math.min(W, H) * 0.022;

    FEATURED_STAR.bx = W * 0.58;
    FEATURED_STAR.by = H * 0.07;
    FEATURED_STAR.r  = 2.8;
  }

  /* ══ MOON (same on all pages) ══════════════════════ */
  function drawMoon() {
    var pos = getPos(MOON, 0.8);
    var x = pos.x, y = pos.y, r = MOON.r;

    var glow = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 3.2);
    glow.addColorStop(0,   'rgba(200,215,255,0.07)');
    glow.addColorStop(0.5, 'rgba(180,200,255,0.03)');
    glow.addColorStop(1,   'rgba(160,185,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();

    var body = ctx.createRadialGradient(x - r*0.25, y - r*0.2, r*0.05, x, y, r);
    body.addColorStop(0,   'rgba(235,240,255,0.92)');
    body.addColorStop(0.5, 'rgba(210,220,248,0.85)');
    body.addColorStop(1,   'rgba(170,185,225,0.78)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    var shadow = ctx.createRadialGradient(x + r*0.52, y, r*0.1, x + r*0.45, y, r*1.1);
    shadow.addColorStop(0,   'rgba(5,9,24,0.95)');
    shadow.addColorStop(0.55,'rgba(5,9,24,0.88)');
    shadow.addColorStop(1,   'rgba(5,9,24,0)');
    ctx.fillStyle = shadow;
    ctx.fillRect(x, y - r, r * 1.5, r * 2);
    ctx.restore();

    var craters = [{ox:-0.28,oy:0.15,cr:0.14},{ox:0.05,oy:-0.30,cr:0.09},{ox:-0.10,oy:0.35,cr:0.07}];
    ctx.save(); ctx.globalAlpha = 0.09;
    for (var ci = 0; ci < craters.length; ci++) {
      var cr = craters[ci];
      ctx.beginPath(); ctx.arc(x + cr.ox*r, y + cr.oy*r, cr.cr*r, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(130,150,200,1)'; ctx.lineWidth = 0.8; ctx.stroke();
    }
    ctx.restore();
  }

  /* ══ PLANETS ════════════════════════════════════════ */

  function drawSaturn(x, y, r) {
    var tilt = 0.28;
    var glow = ctx.createRadialGradient(x, y, r, x, y, r * 4);
    glow.addColorStop(0, 'rgba(180,140,255,0.06)');
    glow.addColorStop(1, 'rgba(120,80,220,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x, y, r*4, 0, Math.PI*2); ctx.fill();

    ctx.save(); ctx.translate(x,y); ctx.rotate(tilt); ctx.scale(1, 0.32);
    ctx.beginPath(); ctx.arc(0, 0, r*2.3, Math.PI, Math.PI*2);
    ctx.strokeStyle = 'rgba(180,150,255,0.22)'; ctx.lineWidth = r*2.8; ctx.stroke();
    ctx.restore();

    var body = ctx.createRadialGradient(x-r*0.3,y-r*0.25,r*0.05,x,y,r);
    body.addColorStop(0,   'rgba(200,170,255,0.90)');
    body.addColorStop(0.4, 'rgba(160,110,240,0.85)');
    body.addColorStop(0.8, 'rgba(90,50,180,0.80)');
    body.addColorStop(1,   'rgba(50,20,120,0.75)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();

    ctx.save(); ctx.globalAlpha = 0.22;
    var hl = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6);
    hl.addColorStop(0,'rgba(255,255,255,0.8)'); hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.translate(x,y); ctx.rotate(tilt); ctx.scale(1, 0.32);
    ctx.beginPath(); ctx.arc(0, 0, r*2.3, 0, Math.PI);
    ctx.strokeStyle = 'rgba(200,170,255,0.28)'; ctx.lineWidth = r*2.8; ctx.stroke();
    ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.18; ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(200,170,255,0.9)'; ctx.fillText('Saturn', x + r*2.8, y + r*0.4); ctx.restore();
  }

  function drawJupiter(x, y, r) {
    /* Jupiter: large, creamy orange-tan with cloud bands */
    var glow = ctx.createRadialGradient(x,y,r,x,y,r*3.5);
    glow.addColorStop(0,'rgba(255,200,120,0.10)');
    glow.addColorStop(1,'rgba(255,160,60,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x,y,r*3.5,0,Math.PI*2); ctx.fill();

    var body = ctx.createRadialGradient(x-r*0.2,y-r*0.2,r*0.05,x,y,r);
    body.addColorStop(0,   'rgba(255,230,180,0.95)');
    body.addColorStop(0.3, 'rgba(240,190,120,0.90)');
    body.addColorStop(0.7, 'rgba(200,130,70,0.85)');
    body.addColorStop(1,   'rgba(160,90,40,0.80)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();

    /* Cloud bands */
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    var bands = [-0.35,-0.12,0.15,0.38];
    for (var b = 0; b < bands.length; b++) {
      ctx.fillStyle = b % 2 === 0 ? 'rgba(180,100,50,0.18)' : 'rgba(255,210,160,0.12)';
      ctx.fillRect(x-r, y+bands[b]*r*2-r*0.09, r*2, r*0.18);
    }
    /* Great Red Spot */
    ctx.save(); ctx.globalAlpha = 0.55;
    var grs = ctx.createRadialGradient(x+r*0.28,y+r*0.18,0,x+r*0.28,y+r*0.18,r*0.22);
    grs.addColorStop(0,'rgba(200,80,40,0.9)');
    grs.addColorStop(1,'rgba(200,80,40,0)');
    ctx.fillStyle = grs;
    ctx.beginPath(); ctx.ellipse(x+r*0.28,y+r*0.18,r*0.22,r*0.13,0,0,Math.PI*2); ctx.fill();
    ctx.restore(); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.25;
    var hl = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6);
    hl.addColorStop(0,'rgba(255,255,255,0.8)'); hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.18; ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255,200,120,0.9)'; ctx.fillText('Jupiter', x+r*1.2, y+r*1.4); ctx.restore();
  }

  function drawMars(x, y, r) {
    /* Mars: rusty red-orange */
    var glow = ctx.createRadialGradient(x,y,r,x,y,r*3.5);
    glow.addColorStop(0,'rgba(220,80,40,0.10)');
    glow.addColorStop(1,'rgba(180,40,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x,y,r*3.5,0,Math.PI*2); ctx.fill();

    var body = ctx.createRadialGradient(x-r*0.25,y-r*0.2,r*0.05,x,y,r);
    body.addColorStop(0,   'rgba(240,130,80,0.95)');
    body.addColorStop(0.4, 'rgba(210,80,40,0.90)');
    body.addColorStop(0.8, 'rgba(160,40,15,0.85)');
    body.addColorStop(1,   'rgba(110,20,5,0.80)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();

    /* Polar ice cap */
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    ctx.globalAlpha = 0.35;
    var cap = ctx.createRadialGradient(x,y-r*0.7,0,x,y-r*0.7,r*0.38);
    cap.addColorStop(0,'rgba(255,255,255,0.9)'); cap.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = cap; ctx.fillRect(x-r,y-r,r*2,r*0.5); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.22;
    var hl = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6);
    hl.addColorStop(0,'rgba(255,255,255,0.8)'); hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.18; ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(240,130,80,0.9)'; ctx.fillText('Mars', x+r*1.2, y+r*1.4); ctx.restore();
  }

  function drawVenus(x, y, r) {
    /* Venus: bright white-yellow, thick cloud cover */
    var glow = ctx.createRadialGradient(x,y,r,x,y,r*4);
    glow.addColorStop(0,'rgba(255,240,160,0.18)');
    glow.addColorStop(0.5,'rgba(255,220,80,0.08)');
    glow.addColorStop(1,'rgba(255,200,40,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x,y,r*4,0,Math.PI*2); ctx.fill();

    var body = ctx.createRadialGradient(x-r*0.2,y-r*0.2,r*0.05,x,y,r);
    body.addColorStop(0,   'rgba(255,252,220,0.98)');
    body.addColorStop(0.35,'rgba(255,240,160,0.93)');
    body.addColorStop(0.7, 'rgba(240,200,80,0.88)');
    body.addColorStop(1,   'rgba(200,150,40,0.82)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();

    /* Swirling clouds */
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    ctx.globalAlpha = 0.15;
    for (var cl = 0; cl < 4; cl++) {
      ctx.beginPath();
      ctx.ellipse(x + (cl-1.5)*r*0.4, y + (cl%2===0?-1:1)*r*0.2, r*0.5, r*0.12, cl*0.3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,200,0.6)'; ctx.fill();
    }
    ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.38;
    var hl = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.65);
    hl.addColorStop(0,'rgba(255,255,255,0.95)'); hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.18; ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255,240,140,0.9)'; ctx.fillText('Venus', x+r*1.2, y+r*1.4); ctx.restore();
  }

  function drawMercury(x, y, r) {
    /* Mercury: grey, cratered, no atmosphere */
    var glow = ctx.createRadialGradient(x,y,r,x,y,r*2.5);
    glow.addColorStop(0,'rgba(180,180,180,0.06)');
    glow.addColorStop(1,'rgba(120,120,120,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x,y,r*2.5,0,Math.PI*2); ctx.fill();

    var body = ctx.createRadialGradient(x-r*0.25,y-r*0.2,r*0.05,x,y,r);
    body.addColorStop(0,   'rgba(210,210,215,0.95)');
    body.addColorStop(0.4, 'rgba(160,160,168,0.90)');
    body.addColorStop(0.8, 'rgba(100,100,108,0.85)');
    body.addColorStop(1,   'rgba(60,60,68,0.80)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();

    /* Craters — more prominent than the moon */
    var craters = [
      {ox:-0.30,oy:0.20,cr:0.18},{ox:0.20,oy:-0.25,cr:0.14},
      {ox:-0.05,oy:0.38,cr:0.10},{ox:0.32,oy:0.20,cr:0.12},
      {ox:-0.20,oy:-0.18,cr:0.08}
    ];
    ctx.save(); ctx.globalAlpha = 0.18;
    for (var ci2 = 0; ci2 < craters.length; ci2++) {
      var cr2 = craters[ci2];
      ctx.beginPath(); ctx.arc(x+cr2.ox*r, y+cr2.oy*r, cr2.cr*r, 0, Math.PI*2);
      ctx.strokeStyle='rgba(60,60,80,1)'; ctx.lineWidth=0.9; ctx.stroke();
    }
    ctx.restore();

    /* Terminator shadow */
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    var shadow2 = ctx.createRadialGradient(x+r*0.5,y,r*0.1,x+r*0.42,y,r*1.1);
    shadow2.addColorStop(0,'rgba(5,9,24,0.92)'); shadow2.addColorStop(0.6,'rgba(5,9,24,0.75)');
    shadow2.addColorStop(1,'rgba(5,9,24,0)');
    ctx.fillStyle=shadow2; ctx.fillRect(x,y-r,r*1.5,r*2); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.22;
    var hl2 = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.55);
    hl2.addColorStop(0,'rgba(255,255,255,0.8)'); hl2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl2; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.18; ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(190,190,200,0.9)'; ctx.fillText('Mercury', x+r*1.2, y+r*1.4); ctx.restore();
  }

  function drawNeptune(x, y, r) {
    /* Neptune: deep blue, subtle bands, faint rings */
    var glow = ctx.createRadialGradient(x,y,r,x,y,r*4);
    glow.addColorStop(0,'rgba(40,100,220,0.12)');
    glow.addColorStop(0.5,'rgba(20,60,180,0.06)');
    glow.addColorStop(1,'rgba(0,30,120,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x,y,r*4,0,Math.PI*2); ctx.fill();

    /* Faint rings */
    ctx.save(); ctx.translate(x,y); ctx.scale(1,0.25);
    ctx.beginPath(); ctx.arc(0,0,r*2.0,0,Math.PI*2);
    ctx.strokeStyle='rgba(60,120,255,0.10)'; ctx.lineWidth=r*1.2; ctx.stroke();
    ctx.restore();

    var body = ctx.createRadialGradient(x-r*0.25,y-r*0.2,r*0.05,x,y,r);
    body.addColorStop(0,   'rgba(100,170,255,0.95)');
    body.addColorStop(0.35,'rgba(40,100,220,0.90)');
    body.addColorStop(0.7, 'rgba(15,55,170,0.85)');
    body.addColorStop(1,   'rgba(5,20,100,0.80)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();

    /* Storm bands */
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = 'rgba(60,140,255,0.5)';
    ctx.fillRect(x-r, y-r*0.15, r*2, r*0.30);
    /* Great Dark Spot */
    ctx.globalAlpha = 0.40;
    var gds = ctx.createRadialGradient(x-r*0.25,y+r*0.1,0,x-r*0.25,y+r*0.1,r*0.20);
    gds.addColorStop(0,'rgba(5,15,80,0.9)'); gds.addColorStop(1,'rgba(5,15,80,0)');
    ctx.fillStyle=gds; ctx.beginPath(); ctx.ellipse(x-r*0.25,y+r*0.1,r*0.20,r*0.12,0,0,Math.PI*2); ctx.fill();
    ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.28;
    var hl3 = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6);
    hl3.addColorStop(0,'rgba(180,220,255,0.9)'); hl3.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl3; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.18; ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(100,170,255,0.9)'; ctx.fillText('Neptune', x+r*1.2, y+r*1.4); ctx.restore();
  }

  function drawUranus(x, y, r) {
    /* Uranus: icy cyan-blue-green, rings are nearly vertical */
    /* Floating bob */
    y += Math.sin(frame * 0.6 + 2.0) * 3;

    var glow = ctx.createRadialGradient(x,y,r,x,y,r*3.8);
    glow.addColorStop(0,'rgba(100,220,210,0.10)');
    glow.addColorStop(1,'rgba(40,160,160,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x,y,r*3.8,0,Math.PI*2); ctx.fill();

    /* Tilted rings — Uranus is famously tilted ~98° so rings appear nearly vertical */
    ctx.save(); ctx.translate(x,y); ctx.rotate(1.48); ctx.scale(0.28,1);
    ctx.beginPath(); ctx.arc(0,0,r*2.2,0,Math.PI*2);
    ctx.strokeStyle='rgba(120,230,220,0.14)'; ctx.lineWidth=r*1.8; ctx.stroke();
    ctx.restore();

    var body = ctx.createRadialGradient(x-r*0.2,y-r*0.2,r*0.05,x,y,r);
    body.addColorStop(0,   'rgba(160,240,235,0.95)');
    body.addColorStop(0.35,'rgba(80,200,200,0.90)');
    body.addColorStop(0.7, 'rgba(30,140,160,0.85)');
    body.addColorStop(1,   'rgba(10,80,110,0.80)');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();

    /* Front rings */
    ctx.save(); ctx.translate(x,y); ctx.rotate(1.48); ctx.scale(0.28,1);
    ctx.beginPath(); ctx.arc(0,0,r*2.2,Math.PI*1.5,Math.PI*0.5);
    ctx.strokeStyle='rgba(160,245,240,0.20)'; ctx.lineWidth=r*1.8; ctx.stroke();
    ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.28;
    var hl4 = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6);
    hl4.addColorStop(0,'rgba(220,255,255,0.9)'); hl4.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl4; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = 0.18; ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(140,235,230,0.9)'; ctx.fillText('Uranus', x+r*1.2, y+r*1.4); ctx.restore();
  }

  /* ══ FEATURED STARS ════════════════════════════════ */

  function drawFeaturedStar(name) {
    var pos = getPos(FEATURED_STAR, 0.6);
    var x = pos.x, y = pos.y, r = FEATURED_STAR.r;

    var starDefs = {
      sirius:     { halo:'rgba(180,220,255,', core:'rgba(220,235,255,', spike:'rgba(210,230,255,', label:'Sirius',     freq:3.1, freq2:2.4, haloR:9,  spikeL:14 },
      betelgeuse: { halo:'rgba(255,140,60,',  core:'rgba(255,180,80,',  spike:'rgba(255,160,70,',  label:'Betelgeuse', freq:1.4, freq2:1.1, haloR:11, spikeL:18 },
      antares:    { halo:'rgba(255,80,40,',   core:'rgba(255,120,60,',  spike:'rgba(255,100,50,',  label:'Antares',    freq:2.0, freq2:1.6, haloR:10, spikeL:16 },
      vega:       { halo:'rgba(220,200,255,', core:'rgba(240,235,255,', spike:'rgba(230,220,255,', label:'Vega',       freq:3.8, freq2:3.0, haloR:8,  spikeL:13 },
      polaris:    { halo:'rgba(200,230,255,', core:'rgba(220,240,255,', spike:'rgba(210,235,255,', label:'Polaris',    freq:0.8, freq2:0.6, haloR:7,  spikeL:11 },
      rigel:      { halo:'rgba(140,180,255,', core:'rgba(180,210,255,', spike:'rgba(160,200,255,', label:'Rigel',      freq:2.8, freq2:2.1, haloR:9,  spikeL:14 },
      aldebaran:  { halo:'rgba(255,170,60,',  core:'rgba(255,200,100,', spike:'rgba(255,185,80,',  label:'Aldebaran',  freq:1.6, freq2:1.2, haloR:10, spikeL:15 }
    };

    var sd = starDefs[name] || starDefs.sirius;
    var twinkle  = 0.75 + 0.25 * Math.sin(frame * sd.freq  + 1.2);
    var twinkle2 = 0.75 + 0.25 * Math.sin(frame * sd.freq2 + 0.5);

    /* Halo */
    var halo = ctx.createRadialGradient(x,y,0,x,y,r*sd.haloR);
    halo.addColorStop(0,   sd.halo + (0.18 * twinkle) + ')');
    halo.addColorStop(0.3, sd.halo + (0.07 * twinkle) + ')');
    halo.addColorStop(1,   sd.halo + '0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(x,y,r*sd.haloR,0,Math.PI*2); ctx.fill();

    /* 4-point diffraction spikes */
    ctx.save(); ctx.globalAlpha = 0.18 * twinkle2;
    var spikes = [[1,0],[0,1],[-1,0],[0,-1]];
    for (var si = 0; si < spikes.length; si++) {
      var sg = ctx.createLinearGradient(x,y,x+spikes[si][0]*r*sd.spikeL,y+spikes[si][1]*r*sd.spikeL);
      sg.addColorStop(0,   sd.spike + '0.9)');
      sg.addColorStop(0.4, sd.spike + '0.3)');
      sg.addColorStop(1,   sd.spike + '0)');
      ctx.beginPath(); ctx.moveTo(x,y);
      ctx.lineTo(x+spikes[si][0]*r*sd.spikeL, y+spikes[si][1]*r*sd.spikeL);
      ctx.strokeStyle=sg; ctx.lineWidth=1.2; ctx.stroke();
    }
    ctx.restore();

    /* Core */
    ctx.beginPath(); ctx.arc(x,y,r*twinkle,0,Math.PI*2);
    ctx.fillStyle = sd.core + (0.92 * twinkle) + ')'; ctx.fill();

    /* Label */
    ctx.save(); ctx.globalAlpha = 0.22 * twinkle; ctx.font = '9px monospace';
    ctx.fillStyle = sd.core + '1)';
    ctx.fillText(sd.label, x + r*2.5, y + r*1.5); ctx.restore();
  }

  /* ══ PLANET DISPATCHER ═════════════════════════════ */
  function drawPlanet() {
    var pos = getPos(PLANET, 1.4);
    var x = pos.x, y = pos.y, r = PLANET.r;
    /* Float animation for most planets */
    if (cfg.planet !== 'mercury') y += Math.sin(frame * 0.7 + 1.0) * 3;

    switch (cfg.planet) {
      case 'saturn':  drawSaturn(x, y, r);  break;
      case 'jupiter': drawJupiter(x, y, r); break;
      case 'mars':    drawMars(x, y, r);    break;
      case 'venus':   drawVenus(x, y, r);   break;
      case 'mercury': drawMercury(x, y, r); break;
      case 'neptune': drawNeptune(x, y, r); break;
      case 'uranus':  drawUranus(x, y, r);  break;
      default:        drawSaturn(x, y, r);
    }
  }

  /* ══ AURORA (dark mode) ════════════════════════════ */
  function drawAurora() {
    if (celestialOpacity <= 0) return;
    var t = frame * 0.4;
    ctx.save(); ctx.globalAlpha = 0.028 * celestialOpacity;
    for (var i = 0; i < 3; i++) {
      var yBase = H * (0.25 + i * 0.08) + Math.sin(t + i * 1.2) * H * 0.04;
      var grad = ctx.createLinearGradient(0, yBase-60, 0, yBase+60);
      grad.addColorStop(0,   'rgba(80,200,160,0)');
      grad.addColorStop(0.4, 'rgba(60,180,200,' + (0.6-i*0.15) + ')');
      grad.addColorStop(0.6, 'rgba(120,80,220,' + (0.5-i*0.1)  + ')');
      grad.addColorStop(1,   'rgba(80,120,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.moveTo(0, yBase);
      for (var xx = 0; xx <= W; xx += 20) {
        var yOff = Math.sin(xx*0.006+t+i)*35 + Math.sin(xx*0.003-t*0.7+i)*20;
        ctx.lineTo(xx, yBase+yOff);
      }
      ctx.lineTo(W,yBase+80); ctx.lineTo(0,yBase+80); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  /* ══ DARK SCENE ════════════════════════════════════ */
  function drawDark() {
    ctx.clearRect(0, 0, W, H);
    drawAurora();

    if (celestialOpacity > 0) {
      ctx.save(); ctx.globalAlpha = celestialOpacity;
      drawMoon();
      drawPlanet();
      drawFeaturedStar(cfg.star);
      ctx.restore();
    }

    /* Shooting stars */
    if (shootingStars.length < 2 && Math.random() < 0.002) {
      shootingStars.push({
        x: Math.random()*W, y: Math.random()*H*0.4,
        len: 80+Math.random()*100, speed: 6+Math.random()*5,
        angle: Math.PI/5, life: 1.0
      });
    }
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = s.a*(0.45+0.55*(0.5+0.5*Math.sin(frame*s.speed*6+s.phase)));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle='rgba(200,220,255,'+a+')'; ctx.fill();
    }
    for (var j = shootingStars.length-1; j >= 0; j--) {
      var ss = shootingStars[j];
      ss.x += Math.cos(ss.angle)*ss.speed; ss.y += Math.sin(ss.angle)*ss.speed;
      ss.life -= 0.025;
      if (ss.life <= 0) { shootingStars.splice(j,1); continue; }
      var g = ctx.createLinearGradient(ss.x,ss.y,
        ss.x-Math.cos(ss.angle)*ss.len, ss.y-Math.sin(ss.angle)*ss.len);
      g.addColorStop(0,'rgba(255,255,255,'+ss.life+')');
      g.addColorStop(0.3,'rgba(180,210,255,'+(ss.life*0.4)+')');
      g.addColorStop(1,'rgba(180,210,255,0)');
      ctx.beginPath(); ctx.moveTo(ss.x,ss.y);
      ctx.lineTo(ss.x-Math.cos(ss.angle)*ss.len, ss.y-Math.sin(ss.angle)*ss.len);
      ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();
    }
  }

  /* ══ SUN / LIGHT SCENE ═════════════════════════════ */
  var SUN = {}, CLOUDS = [], MOTES = [];

  function initLight() {
    SUN.bx = W*0.88; SUN.by = H*0.08; SUN.R = Math.min(W,H)*0.055;
    MOTES = [];
    for (var i = 0; i < 55; i++) {
      MOTES.push({
        x:Math.random()*W, y:Math.random()*H,
        r:Math.random()*1.5+0.3,
        vx:(Math.random()-0.5)*0.15, vy:-(Math.random()*0.08+0.02),
        a:Math.random()*0.25+0.05, phase:Math.random()*Math.PI*2
      });
    }
    CLOUDS = [
      {nx:0.06,ny:0.10,sw:0.22,sh:0.028,a:0.42,sp:0.006,drift:0},
      {nx:0.28,ny:0.07,sw:0.18,sh:0.022,a:0.30,sp:0.004,drift:1.1},
      {nx:0.50,ny:0.13,sw:0.25,sh:0.032,a:0.35,sp:0.007,drift:2.3},
      {nx:0.10,ny:0.22,sw:0.14,sh:0.018,a:0.22,sp:0.003,drift:0.7},
      {nx:0.68,ny:0.19,sw:0.16,sh:0.020,a:0.25,sp:0.005,drift:1.8}
    ];
  }

  function drawCloudBand(cx, cy, sw, sh, alpha) {
    ctx.save(); ctx.globalAlpha = alpha;
    var scaleY = sh/(sw*0.5);
    var grd = ctx.createRadialGradient(cx,cy/scaleY,0,cx,cy/scaleY,sw*0.5);
    grd.addColorStop(0,   'rgba(255,255,255,0.95)');
    grd.addColorStop(0.35,'rgba(250,248,245,0.80)');
    grd.addColorStop(0.7, 'rgba(245,240,235,0.35)');
    grd.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.scale(1,scaleY); ctx.beginPath(); ctx.arc(cx,cy/scaleY,sw*0.5,0,Math.PI*2);
    ctx.fillStyle=grd; ctx.fill(); ctx.restore();
  }

  function drawLight() {
    ctx.clearRect(0, 0, W, H);
    var sx = SUN.bx + mouseX*12, sy = SUN.by + mouseY*6;
    var sunOpacity = celestialOpacity;

    if (sunOpacity > 0) {
      ctx.save(); ctx.globalAlpha = sunOpacity;
      var R = SUN.R;

      var atmo = ctx.createRadialGradient(sx,sy,R,sx,sy,R*9);
      atmo.addColorStop(0,'rgba(255,235,140,0.13)'); atmo.addColorStop(0.25,'rgba(255,200,80,0.07)');
      atmo.addColorStop(0.6,'rgba(255,170,40,0.03)'); atmo.addColorStop(1,'rgba(255,140,0,0)');
      ctx.fillStyle=atmo; ctx.beginPath(); ctx.arc(sx,sy,R*9,0,Math.PI*2); ctx.fill();

      var corona = ctx.createRadialGradient(sx,sy,R*0.9,sx,sy,R*2.8);
      corona.addColorStop(0,'rgba(255,250,200,0.18)'); corona.addColorStop(0.4,'rgba(255,220,100,0.08)');
      corona.addColorStop(1,'rgba(255,180,40,0)');
      ctx.fillStyle=corona; ctx.beginPath(); ctx.arc(sx,sy,R*2.8,0,Math.PI*2); ctx.fill();

      var rayRot=frame*0.06, numRays=20;
      ctx.save(); ctx.translate(sx,sy); ctx.rotate(rayRot);
      for (var r=0;r<numRays;r++) {
        var ang=(r/numRays)*Math.PI*2, isPrimary=(r%2===0);
        var rayLen=R*(isPrimary?4.5:2.8);
        var rayAlpha=(isPrimary?0.10:0.05)*(0.8+0.2*Math.sin(frame*0.8+r));
        var rg=ctx.createLinearGradient(Math.cos(ang)*R,Math.sin(ang)*R,Math.cos(ang)*rayLen,Math.sin(ang)*rayLen);
        rg.addColorStop(0,'rgba(255,230,100,'+rayAlpha+')'); rg.addColorStop(0.5,'rgba(255,200,60,'+(rayAlpha*0.4)+')');
        rg.addColorStop(1,'rgba(255,180,0,0)');
        var tipW=R*(isPrimary?0.07:0.04);
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang)*R-Math.sin(ang)*tipW,Math.sin(ang)*R+Math.cos(ang)*tipW);
        ctx.lineTo(Math.cos(ang)*rayLen,Math.sin(ang)*rayLen);
        ctx.lineTo(Math.cos(ang)*R+Math.sin(ang)*tipW,Math.sin(ang)*R-Math.cos(ang)*tipW);
        ctx.fillStyle=rg; ctx.fill();
      }
      ctx.restore();

      var inner=ctx.createRadialGradient(sx-R*0.2,sy-R*0.2,R*0.02,sx,sy,R);
      inner.addColorStop(0,'rgba(255,255,240,1)'); inner.addColorStop(0.3,'rgba(255,248,180,1)');
      inner.addColorStop(0.7,'rgba(255,225,80,0.98)'); inner.addColorStop(1,'rgba(255,195,30,0.92)');
      ctx.shadowColor='rgba(255,210,50,0.55)'; ctx.shadowBlur=R*2.5;
      ctx.fillStyle=inner; ctx.beginPath(); ctx.arc(sx,sy,R,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;

      ctx.save(); ctx.globalAlpha=0.28;
      var hl=ctx.createRadialGradient(sx-R*0.3,sy-R*0.3,0,sx-R*0.3,sy-R*0.3,R*0.55);
      hl.addColorStop(0,'rgba(255,255,255,0.9)'); hl.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(sx,sy,R,0,Math.PI*2); ctx.fill(); ctx.restore();
      ctx.restore();
    }

    for (var ci=0;ci<CLOUDS.length;ci++) {
      var cl=CLOUDS[ci]; cl.drift+=cl.sp*0.5;
      drawCloudBand(cl.nx*W+Math.sin(cl.drift)*12,cl.ny*H,cl.sw*W,cl.sh*H,cl.a);
    }
    for (var mi=0;mi<MOTES.length;mi++) {
      var m=MOTES[mi]; m.x+=m.vx; m.y+=m.vy; m.phase+=0.02;
      if(m.y<-10){m.y=H+10;m.x=Math.random()*W;}
      var ma=m.a*(0.4+0.6*(0.5+0.5*Math.sin(m.phase)));
      ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,220,100,'+ma+')'; ctx.fill();
    }
  }

  /* ══ RESIZE ════════════════════════════════════════ */
  function resize() { W=c.width=window.innerWidth; H=c.height=window.innerHeight; }
  function init()   { resize(); initStars(); initLight(); }

  /* ══ LOOP ══════════════════════════════════════════ */
  function draw() {
    frame += 0.012;
    document.documentElement.getAttribute('data-theme')==='light' ? drawLight() : drawDark();
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize',function(){resize();initStars();initLight();});
  init(); draw();
}());