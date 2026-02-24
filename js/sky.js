(function () {
  'use strict';

  var c = document.getElementById('starsCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, frame = 0;
  var scrollY = 0;
  var mouseX = 0, mouseY = 0;
  var heroOpacity = 1;
  var pageHeight  = 1;

  c.style.position      = 'fixed';
  c.style.top           = '0';
  c.style.left          = '0';
  c.style.width         = '100%';
  c.style.height        = '100%';
  c.style.pointerEvents = 'none';
  c.style.zIndex        = '0';

  /* ══ PAGE DETECTION ══════════════════════════════════════ */
  var path = window.location.pathname.toLowerCase();
  var PAGE = 'index';
  if      (path.includes('about'))   PAGE = 'about';
  else if (path.includes('project')) PAGE = 'projects';
  else if (path.includes('certif'))  PAGE = 'certifications';
  else if (path.includes('resume'))  PAGE = 'resume';
  else if (path.includes('contact')) PAGE = 'contact';
  else if (path.includes('blog'))    PAGE = 'blog';

  var PAGE_CFG = {
    index:          { planet:'saturn',  star:'sirius'     },
    about:          { planet:'jupiter', star:'betelgeuse' },
    projects:       { planet:'mars',    star:'antares'    },
    certifications: { planet:'venus',   star:'vega'       },
    resume:         { planet:'mercury', star:'polaris'    },
    contact:        { planet:'neptune', star:'rigel'      },
    blog:           { planet:'uranus',  star:'aldebaran'  }
  };
  var cfg = PAGE_CFG[PAGE] || PAGE_CFG.index;

  /* ══ SCROLL ══════════════════════════════════════════════ */
  function updateScroll() {
    scrollY    = window.scrollY;
    pageHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    var hero     = document.getElementById('hero') || document.querySelector('.page-hero');
    var heroH    = hero ? hero.offsetHeight : window.innerHeight;
    var fadeZone = heroH * 0.28;
    heroOpacity  = Math.max(0, Math.min(1, 1 - scrollY / fadeZone));
  }
  window.addEventListener('scroll', updateScroll, { passive: true });

  /* ══ MOUSE ═══════════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════════
     DARK MODE
     ══════════════════════════════════════════════ */
  var stars = [], shootingStars = [];
  var MOON = {}, PLANET = {}, FEATURED_STAR = {};
  var NEBULAS = [], PARTICLES = [];

  function initStars() {
    stars = [];
    for (var i = 0; i < 260; i++) {
      stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.4+0.15,
        a: Math.random()*0.85+0.15,
        phase: Math.random()*Math.PI*2,
        speed: Math.random()*0.008+0.003
      });
    }
    shootingStars = [];
    MOON.bx = W*0.12; MOON.by = H*0.10; MOON.r = Math.min(W,H)*0.038;
    PLANET.bx = W*0.82; PLANET.by = H*0.13; PLANET.r = Math.min(W,H)*0.022;
    FEATURED_STAR.bx = W*0.58; FEATURED_STAR.by = H*0.07; FEATURED_STAR.r = 2.8;

    NEBULAS = [
      { px:0.25, pageY:0.25, rx:0.28, ry:0.10, col:'80,120,220',  a:0.030 },
      { px:0.75, pageY:0.38, rx:0.22, ry:0.08, col:'140,60,200',  a:0.025 },
      { px:0.15, pageY:0.55, rx:0.30, ry:0.09, col:'40,160,180',  a:0.022 },
      { px:0.65, pageY:0.65, rx:0.20, ry:0.07, col:'180,80,140',  a:0.020 },
      { px:0.40, pageY:0.78, rx:0.25, ry:0.08, col:'60,140,220',  a:0.025 },
      { px:0.85, pageY:0.88, rx:0.18, ry:0.06, col:'100,200,160', a:0.018 }
    ];

    PARTICLES = [];
    for (var p = 0; p < 80; p++) {
      PARTICLES.push({
        px: Math.random(), pageY: Math.random(),
        r: Math.random()*1.2+0.3,
        a: Math.random()*0.22+0.06,
        vx: (Math.random()-0.5)*0.12,
        phase: Math.random()*Math.PI*2,
        speed: Math.random()*0.006+0.002
      });
    }
  }

  /* ── Moon ──────────────────────────────────────────────── */
  function drawMoon() {
    var pos=getPos(MOON,0.8); var x=pos.x,y=pos.y,r=MOON.r;
    var glow=ctx.createRadialGradient(x,y,r*0.8,x,y,r*3.2);
    glow.addColorStop(0,'rgba(200,215,255,0.07)'); glow.addColorStop(0.5,'rgba(180,200,255,0.03)'); glow.addColorStop(1,'rgba(160,185,255,0)');
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*3.2,0,Math.PI*2); ctx.fill();
    var body=ctx.createRadialGradient(x-r*0.25,y-r*0.2,r*0.05,x,y,r);
    body.addColorStop(0,'rgba(235,240,255,0.92)'); body.addColorStop(0.5,'rgba(210,220,248,0.85)'); body.addColorStop(1,'rgba(170,185,225,0.78)');
    ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    var shad=ctx.createRadialGradient(x+r*0.52,y,r*0.1,x+r*0.45,y,r*1.1);
    shad.addColorStop(0,'rgba(5,9,24,0.95)'); shad.addColorStop(0.55,'rgba(5,9,24,0.88)'); shad.addColorStop(1,'rgba(5,9,24,0)');
    ctx.fillStyle=shad; ctx.fillRect(x,y-r,r*1.5,r*2); ctx.restore();
    var crats=[{ox:-0.28,oy:0.15,cr:0.14},{ox:0.05,oy:-0.30,cr:0.09},{ox:-0.10,oy:0.35,cr:0.07}];
    ctx.save(); ctx.globalAlpha=0.09;
    for(var ci=0;ci<crats.length;ci++){var cr=crats[ci]; ctx.beginPath(); ctx.arc(x+cr.ox*r,y+cr.oy*r,cr.cr*r,0,Math.PI*2); ctx.strokeStyle='rgba(130,150,200,1)'; ctx.lineWidth=0.8; ctx.stroke();}
    ctx.restore();
  }

  /* ── Planets ───────────────────────────────────────────── */
  function drawSaturn(x,y,r){
    var t=0.28;
    var glow=ctx.createRadialGradient(x,y,r,x,y,r*4); glow.addColorStop(0,'rgba(180,140,255,0.06)'); glow.addColorStop(1,'rgba(120,80,220,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*4,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x,y); ctx.rotate(t); ctx.scale(1,0.32); ctx.beginPath(); ctx.arc(0,0,r*2.3,Math.PI,Math.PI*2); ctx.strokeStyle='rgba(180,150,255,0.22)'; ctx.lineWidth=r*2.8; ctx.stroke(); ctx.restore();
    var body=ctx.createRadialGradient(x-r*0.3,y-r*0.25,r*0.05,x,y,r); body.addColorStop(0,'rgba(200,170,255,0.90)'); body.addColorStop(0.4,'rgba(160,110,240,0.85)'); body.addColorStop(0.8,'rgba(90,50,180,0.80)'); body.addColorStop(1,'rgba(50,20,120,0.75)'); ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.globalAlpha=0.22; var hl=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6); hl.addColorStop(0,'rgba(255,255,255,0.8)'); hl.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(x,y); ctx.rotate(t); ctx.scale(1,0.32); ctx.beginPath(); ctx.arc(0,0,r*2.3,0,Math.PI); ctx.strokeStyle='rgba(200,170,255,0.28)'; ctx.lineWidth=r*2.8; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.18; ctx.font='9px monospace'; ctx.fillStyle='rgba(200,170,255,0.9)'; ctx.fillText('Saturn',x+r*2.8,y+r*0.4); ctx.restore();
  }
  function drawJupiter(x,y,r){
    var glow=ctx.createRadialGradient(x,y,r,x,y,r*3.5); glow.addColorStop(0,'rgba(255,200,120,0.10)'); glow.addColorStop(1,'rgba(255,160,60,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*3.5,0,Math.PI*2); ctx.fill();
    var body=ctx.createRadialGradient(x-r*0.2,y-r*0.2,r*0.05,x,y,r); body.addColorStop(0,'rgba(255,230,180,0.95)'); body.addColorStop(0.3,'rgba(240,190,120,0.90)'); body.addColorStop(0.7,'rgba(200,130,70,0.85)'); body.addColorStop(1,'rgba(160,90,40,0.80)'); ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    var bands=[-0.35,-0.12,0.15,0.38]; for(var b=0;b<bands.length;b++){ctx.fillStyle=b%2===0?'rgba(180,100,50,0.18)':'rgba(255,210,160,0.12)'; ctx.fillRect(x-r,y+bands[b]*r*2-r*0.09,r*2,r*0.18);}
    ctx.save(); ctx.globalAlpha=0.55; var grs=ctx.createRadialGradient(x+r*0.28,y+r*0.18,0,x+r*0.28,y+r*0.18,r*0.22); grs.addColorStop(0,'rgba(200,80,40,0.9)'); grs.addColorStop(1,'rgba(200,80,40,0)'); ctx.fillStyle=grs; ctx.beginPath(); ctx.ellipse(x+r*0.28,y+r*0.18,r*0.22,r*0.13,0,0,Math.PI*2); ctx.fill(); ctx.restore(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.25; var hl=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6); hl.addColorStop(0,'rgba(255,255,255,0.8)'); hl.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.18; ctx.font='9px monospace'; ctx.fillStyle='rgba(255,200,120,0.9)'; ctx.fillText('Jupiter',x+r*1.2,y+r*1.4); ctx.restore();
  }
  function drawMars(x,y,r){
    var glow=ctx.createRadialGradient(x,y,r,x,y,r*3.5); glow.addColorStop(0,'rgba(220,80,40,0.10)'); glow.addColorStop(1,'rgba(180,40,0,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*3.5,0,Math.PI*2); ctx.fill();
    var body=ctx.createRadialGradient(x-r*0.25,y-r*0.2,r*0.05,x,y,r); body.addColorStop(0,'rgba(240,130,80,0.95)'); body.addColorStop(0.4,'rgba(210,80,40,0.90)'); body.addColorStop(0.8,'rgba(160,40,15,0.85)'); body.addColorStop(1,'rgba(110,20,5,0.80)'); ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip(); ctx.globalAlpha=0.35; var cap=ctx.createRadialGradient(x,y-r*0.7,0,x,y-r*0.7,r*0.38); cap.addColorStop(0,'rgba(255,255,255,0.9)'); cap.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=cap; ctx.fillRect(x-r,y-r,r*2,r*0.5); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.22; var hl=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6); hl.addColorStop(0,'rgba(255,255,255,0.8)'); hl.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.18; ctx.font='9px monospace'; ctx.fillStyle='rgba(240,130,80,0.9)'; ctx.fillText('Mars',x+r*1.2,y+r*1.4); ctx.restore();
  }
  function drawVenus(x,y,r){
    var glow=ctx.createRadialGradient(x,y,r,x,y,r*4); glow.addColorStop(0,'rgba(255,240,160,0.18)'); glow.addColorStop(0.5,'rgba(255,220,80,0.08)'); glow.addColorStop(1,'rgba(255,200,40,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*4,0,Math.PI*2); ctx.fill();
    var body=ctx.createRadialGradient(x-r*0.2,y-r*0.2,r*0.05,x,y,r); body.addColorStop(0,'rgba(255,252,220,0.98)'); body.addColorStop(0.35,'rgba(255,240,160,0.93)'); body.addColorStop(0.7,'rgba(240,200,80,0.88)'); body.addColorStop(1,'rgba(200,150,40,0.82)'); ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip(); ctx.globalAlpha=0.15;
    for(var vl=0;vl<4;vl++){ctx.beginPath(); ctx.ellipse(x+(vl-1.5)*r*0.4,y+(vl%2===0?-1:1)*r*0.2,r*0.5,r*0.12,vl*0.3,0,Math.PI*2); ctx.fillStyle='rgba(255,255,200,0.6)'; ctx.fill();} ctx.restore();
    ctx.save(); ctx.globalAlpha=0.38; var hl=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.65); hl.addColorStop(0,'rgba(255,255,255,0.95)'); hl.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.18; ctx.font='9px monospace'; ctx.fillStyle='rgba(255,240,140,0.9)'; ctx.fillText('Venus',x+r*1.2,y+r*1.4); ctx.restore();
  }
  function drawMercury(x,y,r){
    var glow=ctx.createRadialGradient(x,y,r,x,y,r*2.5); glow.addColorStop(0,'rgba(180,180,180,0.06)'); glow.addColorStop(1,'rgba(120,120,120,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*2.5,0,Math.PI*2); ctx.fill();
    var body=ctx.createRadialGradient(x-r*0.25,y-r*0.2,r*0.05,x,y,r); body.addColorStop(0,'rgba(210,210,215,0.95)'); body.addColorStop(0.4,'rgba(160,160,168,0.90)'); body.addColorStop(0.8,'rgba(100,100,108,0.85)'); body.addColorStop(1,'rgba(60,60,68,0.80)'); ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    var mc=[{ox:-0.30,oy:0.20,cr:0.18},{ox:0.20,oy:-0.25,cr:0.14},{ox:-0.05,oy:0.38,cr:0.10},{ox:0.32,oy:0.20,cr:0.12},{ox:-0.20,oy:-0.18,cr:0.08}];
    ctx.save(); ctx.globalAlpha=0.18; for(var mi2=0;mi2<mc.length;mi2++){ctx.beginPath(); ctx.arc(x+mc[mi2].ox*r,y+mc[mi2].oy*r,mc[mi2].cr*r,0,Math.PI*2); ctx.strokeStyle='rgba(60,60,80,1)'; ctx.lineWidth=0.9; ctx.stroke();} ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip(); var ms=ctx.createRadialGradient(x+r*0.5,y,r*0.1,x+r*0.42,y,r*1.1); ms.addColorStop(0,'rgba(5,9,24,0.92)'); ms.addColorStop(0.6,'rgba(5,9,24,0.75)'); ms.addColorStop(1,'rgba(5,9,24,0)'); ctx.fillStyle=ms; ctx.fillRect(x,y-r,r*1.5,r*2); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.22; var mh=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.55); mh.addColorStop(0,'rgba(255,255,255,0.8)'); mh.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=mh; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.18; ctx.font='9px monospace'; ctx.fillStyle='rgba(190,190,200,0.9)'; ctx.fillText('Mercury',x+r*1.2,y+r*1.4); ctx.restore();
  }
  function drawNeptune(x,y,r){
    var glow=ctx.createRadialGradient(x,y,r,x,y,r*4); glow.addColorStop(0,'rgba(40,100,220,0.12)'); glow.addColorStop(0.5,'rgba(20,60,180,0.06)'); glow.addColorStop(1,'rgba(0,30,120,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*4,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x,y); ctx.scale(1,0.25); ctx.beginPath(); ctx.arc(0,0,r*2.0,0,Math.PI*2); ctx.strokeStyle='rgba(60,120,255,0.10)'; ctx.lineWidth=r*1.2; ctx.stroke(); ctx.restore();
    var body=ctx.createRadialGradient(x-r*0.25,y-r*0.2,r*0.05,x,y,r); body.addColorStop(0,'rgba(100,170,255,0.95)'); body.addColorStop(0.35,'rgba(40,100,220,0.90)'); body.addColorStop(0.7,'rgba(15,55,170,0.85)'); body.addColorStop(1,'rgba(5,20,100,0.80)'); ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip(); ctx.globalAlpha=0.18; ctx.fillStyle='rgba(60,140,255,0.5)'; ctx.fillRect(x-r,y-r*0.15,r*2,r*0.30); ctx.globalAlpha=0.40; var gds=ctx.createRadialGradient(x-r*0.25,y+r*0.1,0,x-r*0.25,y+r*0.1,r*0.20); gds.addColorStop(0,'rgba(5,15,80,0.9)'); gds.addColorStop(1,'rgba(5,15,80,0)'); ctx.fillStyle=gds; ctx.beginPath(); ctx.ellipse(x-r*0.25,y+r*0.1,r*0.20,r*0.12,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.28; var nh=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6); nh.addColorStop(0,'rgba(180,220,255,0.9)'); nh.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=nh; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.18; ctx.font='9px monospace'; ctx.fillStyle='rgba(100,170,255,0.9)'; ctx.fillText('Neptune',x+r*1.2,y+r*1.4); ctx.restore();
  }
  function drawUranus(x,y,r){
    y+=Math.sin(frame*0.6+2.0)*3;
    var glow=ctx.createRadialGradient(x,y,r,x,y,r*3.8); glow.addColorStop(0,'rgba(100,220,210,0.10)'); glow.addColorStop(1,'rgba(40,160,160,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(x,y,r*3.8,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x,y); ctx.rotate(1.48); ctx.scale(0.28,1); ctx.beginPath(); ctx.arc(0,0,r*2.2,0,Math.PI*2); ctx.strokeStyle='rgba(120,230,220,0.14)'; ctx.lineWidth=r*1.8; ctx.stroke(); ctx.restore();
    var body=ctx.createRadialGradient(x-r*0.2,y-r*0.2,r*0.05,x,y,r); body.addColorStop(0,'rgba(160,240,235,0.95)'); body.addColorStop(0.35,'rgba(80,200,200,0.90)'); body.addColorStop(0.7,'rgba(30,140,160,0.85)'); body.addColorStop(1,'rgba(10,80,110,0.80)'); ctx.fillStyle=body; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x,y); ctx.rotate(1.48); ctx.scale(0.28,1); ctx.beginPath(); ctx.arc(0,0,r*2.2,Math.PI*1.5,Math.PI*0.5); ctx.strokeStyle='rgba(160,245,240,0.20)'; ctx.lineWidth=r*1.8; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.28; var uh=ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x-r*0.2,y-r*0.2,r*0.6); uh.addColorStop(0,'rgba(220,255,255,0.9)'); uh.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=uh; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=0.18; ctx.font='9px monospace'; ctx.fillStyle='rgba(140,235,230,0.9)'; ctx.fillText('Uranus',x+r*1.2,y+r*1.4); ctx.restore();
  }

  function drawPlanet(){
    var pos=getPos(PLANET,1.4); var x=pos.x,y=pos.y,r=PLANET.r;
    if(cfg.planet!=='mercury') y+=Math.sin(frame*0.7+1.0)*3;
    switch(cfg.planet){case 'saturn':drawSaturn(x,y,r);break;case 'jupiter':drawJupiter(x,y,r);break;case 'mars':drawMars(x,y,r);break;case 'venus':drawVenus(x,y,r);break;case 'mercury':drawMercury(x,y,r);break;case 'neptune':drawNeptune(x,y,r);break;case 'uranus':drawUranus(x,y,r);break;default:drawSaturn(x,y,r);}
  }

  /* ── Featured Star ─────────────────────────────────────── */
  function drawFeaturedStar(name){
    var pos=getPos(FEATURED_STAR,0.6); var x=pos.x,y=pos.y,r=FEATURED_STAR.r;
    var sd={sirius:{halo:'rgba(180,220,255,',core:'rgba(220,235,255,',spike:'rgba(210,230,255,',label:'Sirius',freq:3.1,freq2:2.4,haloR:9,spikeL:14},betelgeuse:{halo:'rgba(255,140,60,',core:'rgba(255,180,80,',spike:'rgba(255,160,70,',label:'Betelgeuse',freq:1.4,freq2:1.1,haloR:11,spikeL:18},antares:{halo:'rgba(255,80,40,',core:'rgba(255,120,60,',spike:'rgba(255,100,50,',label:'Antares',freq:2.0,freq2:1.6,haloR:10,spikeL:16},vega:{halo:'rgba(220,200,255,',core:'rgba(240,235,255,',spike:'rgba(230,220,255,',label:'Vega',freq:3.8,freq2:3.0,haloR:8,spikeL:13},polaris:{halo:'rgba(200,230,255,',core:'rgba(220,240,255,',spike:'rgba(210,235,255,',label:'Polaris',freq:0.8,freq2:0.6,haloR:7,spikeL:11},rigel:{halo:'rgba(140,180,255,',core:'rgba(180,210,255,',spike:'rgba(160,200,255,',label:'Rigel',freq:2.8,freq2:2.1,haloR:9,spikeL:14},aldebaran:{halo:'rgba(255,170,60,',core:'rgba(255,200,100,',spike:'rgba(255,185,80,',label:'Aldebaran',freq:1.6,freq2:1.2,haloR:10,spikeL:15}}[name]||{halo:'rgba(180,220,255,',core:'rgba(220,235,255,',spike:'rgba(210,230,255,',label:'Sirius',freq:3.1,freq2:2.4,haloR:9,spikeL:14};
    var tw=0.75+0.25*Math.sin(frame*sd.freq+1.2),tw2=0.75+0.25*Math.sin(frame*sd.freq2+0.5);
    var halo=ctx.createRadialGradient(x,y,0,x,y,r*sd.haloR); halo.addColorStop(0,sd.halo+(0.18*tw)+')'); halo.addColorStop(0.3,sd.halo+(0.07*tw)+')'); halo.addColorStop(1,sd.halo+'0)'); ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(x,y,r*sd.haloR,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.globalAlpha=0.18*tw2; var spk=[[1,0],[0,1],[-1,0],[0,-1]];
    for(var si=0;si<spk.length;si++){var sg=ctx.createLinearGradient(x,y,x+spk[si][0]*r*sd.spikeL,y+spk[si][1]*r*sd.spikeL); sg.addColorStop(0,sd.spike+'0.9)'); sg.addColorStop(0.4,sd.spike+'0.3)'); sg.addColorStop(1,sd.spike+'0)'); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+spk[si][0]*r*sd.spikeL,y+spk[si][1]*r*sd.spikeL); ctx.strokeStyle=sg; ctx.lineWidth=1.2; ctx.stroke();} ctx.restore();
    ctx.beginPath(); ctx.arc(x,y,r*tw,0,Math.PI*2); ctx.fillStyle=sd.core+(0.92*tw)+')'; ctx.fill();
    ctx.save(); ctx.globalAlpha=0.22*tw; ctx.font='9px monospace'; ctx.fillStyle=sd.core+'1)'; ctx.fillText(sd.label,x+r*2.5,y+r*1.5); ctx.restore();
  }

  /* ── Aurora ────────────────────────────────────────────── */
  function drawAurora(){
    if(heroOpacity<=0) return;
    var t=frame*0.4; ctx.save(); ctx.globalAlpha=0.028*heroOpacity;
    for(var i=0;i<3;i++){var yb=H*(0.25+i*0.08)+Math.sin(t+i*1.2)*H*0.04; var gr=ctx.createLinearGradient(0,yb-60,0,yb+60); gr.addColorStop(0,'rgba(80,200,160,0)'); gr.addColorStop(0.4,'rgba(60,180,200,'+(0.6-i*0.15)+')'); gr.addColorStop(0.6,'rgba(120,80,220,'+(0.5-i*0.1)+')'); gr.addColorStop(1,'rgba(80,120,255,0)'); ctx.fillStyle=gr; ctx.beginPath(); ctx.moveTo(0,yb); for(var xx=0;xx<=W;xx+=20){ctx.lineTo(xx,yb+Math.sin(xx*0.006+t+i)*35+Math.sin(xx*0.003-t*0.7+i)*20);} ctx.lineTo(W,yb+80); ctx.lineTo(0,yb+80); ctx.closePath(); ctx.fill();} ctx.restore();
  }

  /* ── Dark Body Decorations ─────────────────────────────── */
  function drawDarkBody(){
    var sf = pageHeight > 0 ? scrollY/pageHeight : 0;

    /* Nebula glows */
    for(var n=0;n<NEBULAS.length;n++){
      var nb=NEBULAS[n]; var dist=Math.abs(sf-nb.pageY); var vis=Math.max(0,1-dist*6); if(vis<=0) continue;
      var nx=nb.px*W; var ny=H*0.5+(nb.pageY-sf)*pageHeight;
      var ef=Math.max(0,Math.min(1,Math.min(ny/H,(H-ny)/H)*5)); var fa=nb.a*vis*ef; if(fa<=0) continue;
      ctx.save(); ctx.globalAlpha=fa;
      var ng=ctx.createRadialGradient(nx,ny,0,nx,ny,nb.rx*W); ng.addColorStop(0,'rgba('+nb.col+',0.55)'); ng.addColorStop(0.5,'rgba('+nb.col+',0.18)'); ng.addColorStop(1,'rgba('+nb.col+',0)');
      ctx.fillStyle=ng; ctx.save(); ctx.scale(1,nb.ry/nb.rx); ctx.beginPath(); ctx.arc(nx,ny/(nb.ry/nb.rx),nb.rx*W,0,Math.PI*2); ctx.fill(); ctx.restore(); ctx.restore();
    }

    /* Drifting particles */
    for(var p=0;p<PARTICLES.length;p++){
      var pt=PARTICLES[p]; var sy2=(pt.pageY-sf)*pageHeight+H*0.5; if(sy2<-20||sy2>H+20) continue;
      pt.px+=pt.vx/W; if(pt.px<0)pt.px=1; if(pt.px>1)pt.px=0;
      var pulse=0.5+0.5*Math.sin(frame*pt.speed*40+pt.phase);
      ctx.beginPath(); ctx.arc(pt.px*W,sy2,pt.r,0,Math.PI*2); ctx.fillStyle='rgba(180,210,255,'+(pt.a*(0.4+0.6*pulse))+')'; ctx.fill();
    }

    /* Hex grid overlay */
    var gv=Math.max(0,Math.min(1,(sf-0.08)*5))*Math.max(0,Math.min(1,(0.92-sf)*5));
    if(gv>0.01){
      ctx.save(); ctx.globalAlpha=0.016*gv; ctx.strokeStyle='rgba(79,142,247,1)'; ctx.lineWidth=0.5;
      var gs=60; var gy0=(scrollY*0.08)%gs;
      for(var gx2=-gs;gx2<W+gs;gx2+=gs){for(var gy2=-gs+gy0;gy2<H+gs;gy2+=gs){ctx.beginPath(); for(var hv=0;hv<6;hv++){var hx=gx2+gs*0.5*Math.cos(hv*Math.PI/3),hy=gy2+gs*0.5*Math.sin(hv*Math.PI/3); hv===0?ctx.moveTo(hx,hy):ctx.lineTo(hx,hy);} ctx.closePath(); ctx.stroke();}}
      ctx.restore();
    }

    /* Diagonal light streaks */
    var sv=Math.max(0,Math.min(1,(sf-0.25)*5))*Math.max(0,Math.min(1,(0.88-sf)*5));
    if(sv>0.01){
      ctx.save(); ctx.globalAlpha=0.010*sv;
      var strks=[0.20,0.45,0.68,0.88];
      for(var sr=0;sr<strks.length;sr++){var sx2=strks[sr]*W; var sg2=ctx.createLinearGradient(sx2-80,0,sx2+80,H); sg2.addColorStop(0,'rgba(79,142,247,0)'); sg2.addColorStop(0.4,'rgba(79,142,247,0.7)'); sg2.addColorStop(0.6,'rgba(147,197,253,0.5)'); sg2.addColorStop(1,'rgba(79,142,247,0)'); ctx.fillStyle=sg2; ctx.beginPath(); ctx.moveTo(sx2-60,0); ctx.lineTo(sx2+60,0); ctx.lineTo(sx2+100,H); ctx.lineTo(sx2-20,H); ctx.closePath(); ctx.fill();}
      ctx.restore();
    }
  }

  /* ── Full Dark Draw ────────────────────────────────────── */
  function drawDark(){
    ctx.clearRect(0,0,W,H);
    drawAurora();
    drawDarkBody();
    if(heroOpacity>0){ctx.save(); ctx.globalAlpha=heroOpacity; drawMoon(); drawPlanet(); drawFeaturedStar(cfg.star); ctx.restore();}
    for(var i=0;i<stars.length;i++){var s=stars[i]; var a=s.a*(0.45+0.55*(0.5+0.5*Math.sin(frame*s.speed*6+s.phase))); ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='rgba(200,220,255,'+a+')'; ctx.fill();}
    if(shootingStars.length<2&&Math.random()<0.002){shootingStars.push({x:Math.random()*W,y:Math.random()*H*0.4,len:80+Math.random()*100,speed:6+Math.random()*5,angle:Math.PI/5,life:1.0});}
    for(var j=shootingStars.length-1;j>=0;j--){var ss=shootingStars[j]; ss.x+=Math.cos(ss.angle)*ss.speed; ss.y+=Math.sin(ss.angle)*ss.speed; ss.life-=0.025; if(ss.life<=0){shootingStars.splice(j,1);continue;} var g=ctx.createLinearGradient(ss.x,ss.y,ss.x-Math.cos(ss.angle)*ss.len,ss.y-Math.sin(ss.angle)*ss.len); g.addColorStop(0,'rgba(255,255,255,'+ss.life+')'); g.addColorStop(0.3,'rgba(180,210,255,'+(ss.life*0.4)+')'); g.addColorStop(1,'rgba(180,210,255,0)'); ctx.beginPath(); ctx.moveTo(ss.x,ss.y); ctx.lineTo(ss.x-Math.cos(ss.angle)*ss.len,ss.y-Math.sin(ss.angle)*ss.len); ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();}
  }

  /* ══════════════════════════════════════════════
     LIGHT MODE
     ══════════════════════════════════════════════ */
  var SUN = {};
  var CLOUDS = [], MOTES = [], LIGHT_ORBS = [];

  function initLight(){
    SUN.bx=W*0.88; SUN.by=H*0.08; SUN.R=Math.min(W,H)*0.055;
    MOTES=[];
    for(var i=0;i<40;i++){MOTES.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+0.2,vx:(Math.random()-0.5)*0.12,vy:-(Math.random()*0.06+0.01),a:Math.random()*0.14+0.04,phase:Math.random()*Math.PI*2});}

    /* Cirrus: thin wispy high-altitude ice streaks — very flat */
    /* Cumulus: small fair-weather puffs with flat base         */
    CLOUDS=[
      {type:'cirrus', nx:0.08, ny:0.06, w:0.18, sy:0.07, a:0.38, sp:0.0008, drift:0.0},
      {type:'cirrus', nx:0.30, ny:0.04, w:0.22, sy:0.06, a:0.32, sp:0.0006, drift:1.5},
      {type:'cirrus', nx:0.55, ny:0.08, w:0.16, sy:0.08, a:0.35, sp:0.0009, drift:3.0},
      {type:'cirrus', nx:0.75, ny:0.05, w:0.20, sy:0.07, a:0.30, sp:0.0007, drift:0.8},
      {type:'cirrus', nx:0.18, ny:0.14, w:0.14, sy:0.06, a:0.28, sp:0.0005, drift:2.2},
      {type:'cirrus', nx:0.65, ny:0.16, w:0.18, sy:0.07, a:0.25, sp:0.0008, drift:4.1},
      {type:'cirrus', nx:0.42, ny:0.20, w:0.12, sy:0.06, a:0.22, sp:0.0006, drift:1.0},
      {type:'cirrus', nx:0.88, ny:0.12, w:0.10, sy:0.06, a:0.20, sp:0.0005, drift:2.8},
      {type:'cumulus', nx:0.12, ny:0.22, r:0.016, a:0.60, sp:0.0010, drift:0.5},
      {type:'cumulus', nx:0.38, ny:0.18, r:0.013, a:0.55, sp:0.0008, drift:2.0},
      {type:'cumulus', nx:0.62, ny:0.24, r:0.015, a:0.58, sp:0.0011, drift:3.5},
      {type:'cumulus', nx:0.82, ny:0.20, r:0.012, a:0.50, sp:0.0007, drift:1.2}
    ];

    LIGHT_ORBS=[
      {px:0.15,pageY:0.22,rx:0.20,ry:0.08,col:'255,200,80', a:0.025},
      {px:0.80,pageY:0.35,rx:0.18,ry:0.07,col:'255,160,60', a:0.022},
      {px:0.35,pageY:0.50,rx:0.22,ry:0.09,col:'255,220,120',a:0.020},
      {px:0.70,pageY:0.62,rx:0.16,ry:0.06,col:'255,180,80', a:0.018},
      {px:0.20,pageY:0.75,rx:0.20,ry:0.07,col:'255,200,100',a:0.022},
      {px:0.85,pageY:0.85,rx:0.15,ry:0.06,col:'255,160,40', a:0.016}
    ];
  }

  /* ── Photorealistic Cirrus ─────────────────────────────── */
  /* Thin ice-crystal streaks: multiple feathered layers, very flat,
     warm-white core fading to blue-grey transparent wisps.         */
  function drawCirrus(cx,cy,w,scaleY,alpha){
    var rw=w*W*0.5, rh=rw*scaleY;
    ctx.save(); ctx.globalAlpha=alpha;
    /* Multiple offset layers for wispy depth */
    var layers=[
      {dy:0,     rw:rw,      rh:rh,      a:1.00},
      {dy:-rh*0.7,rw:rw*0.72,rh:rh*0.65,a:0.52},
      {dy: rh*0.6,rw:rw*0.78,rh:rh*0.60,a:0.44},
      {dy:-rh*1.3,rw:rw*0.48,rh:rh*0.48,a:0.28},
      {dy: rh*1.1,rw:rw*0.52,rh:rh*0.44,a:0.24},
      {dy:-rh*0.3,rw:rw*0.60,rh:rh*0.38,a:0.18}
    ];
    for(var l=0;l<layers.length;l++){
      var lyr=layers[l], ly=cy+lyr.dy;
      var grd=ctx.createRadialGradient(cx,ly,0,cx,ly,lyr.rw);
      grd.addColorStop(0,   'rgba(255,255,255,0.90)');
      grd.addColorStop(0.22,'rgba(252,254,255,0.75)');
      grd.addColorStop(0.52,'rgba(238,248,255,0.38)');
      grd.addColorStop(0.78,'rgba(220,238,255,0.12)');
      grd.addColorStop(1,   'rgba(210,232,255,0)');
      ctx.save(); ctx.translate(cx,ly); ctx.scale(1,lyr.rh/lyr.rw);
      ctx.beginPath(); ctx.arc(0,0,lyr.rw,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill(); ctx.restore();
    }
    /* Blue-grey underside — real cirrus tint from ice crystals */
    ctx.save(); ctx.globalAlpha=0.07;
    var ug=ctx.createLinearGradient(cx,cy,cx,cy+rh*1.8);
    ug.addColorStop(0,'rgba(175,205,235,0)'); ug.addColorStop(1,'rgba(155,190,225,0.65)');
    ctx.translate(cx,cy+rh*0.4); ctx.scale(1,rh*0.7/rw);
    ctx.beginPath(); ctx.arc(0,0,rw*0.82,0,Math.PI*2); ctx.fillStyle=ug; ctx.fill(); ctx.restore();
    ctx.restore();
  }

  /* ── Photorealistic Small Cumulus ──────────────────────── */
  /* Flat-based, softly rounded top, blue-grey underside shadow */
  function drawCumulus(cx,cy,br){
    var r=br*Math.min(W,H);
    ctx.save();
    /* Clip to flat-bottom shape */
    ctx.beginPath(); ctx.rect(cx-r*2.2,cy-r*1.5,r*4.4,r*2.8); ctx.clip();
    /* Main dome */
    var dome=ctx.createRadialGradient(cx-r*0.15,cy-r*0.3,r*0.04,cx,cy,r*1.1);
    dome.addColorStop(0,   'rgba(255,255,255,0.94)');
    dome.addColorStop(0.28,'rgba(252,254,255,0.86)');
    dome.addColorStop(0.58,'rgba(230,244,255,0.65)');
    dome.addColorStop(0.84,'rgba(208,230,250,0.30)');
    dome.addColorStop(1,   'rgba(195,220,245,0)');
    ctx.fillStyle=dome; ctx.beginPath(); ctx.arc(cx,cy,r*1.1,0,Math.PI*2); ctx.fill();
    /* Side puffs */
    var puffs=[{ox:-0.62,oy:0.18,rs:0.65},{ox:0.62,oy:0.15,rs:0.62},{ox:-0.26,oy:-0.22,rs:0.50},{ox:0.28,oy:-0.20,rs:0.48}];
    for(var sp=0;sp<puffs.length;sp++){var pf=puffs[sp]; var px=cx+pf.ox*r,py=cy+pf.oy*r,pr=pf.rs*r; var pg=ctx.createRadialGradient(px-pr*0.18,py-pr*0.18,pr*0.03,px,py,pr); pg.addColorStop(0,'rgba(255,255,255,0.88)'); pg.addColorStop(0.5,'rgba(238,250,255,0.60)'); pg.addColorStop(1,'rgba(218,238,255,0)'); ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.fill();}
    /* Flat bottom shadow — the most important realism cue */
    ctx.save(); ctx.globalAlpha=0.24;
    var bg=ctx.createLinearGradient(cx,cy+r*0.08,cx,cy+r*0.72);
    bg.addColorStop(0,'rgba(155,188,225,0)'); bg.addColorStop(1,'rgba(125,162,210,0.88)');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.ellipse(cx,cy+r*0.30,r*1.42,r*0.30,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.restore();
  }

  /* ── Light Body Decorations ────────────────────────────── */
  function drawLightBody(){
    var sf=pageHeight>0?scrollY/pageHeight:0;

    /* Warm sunlight orbs */
    for(var o=0;o<LIGHT_ORBS.length;o++){
      var orb=LIGHT_ORBS[o]; var dist=Math.abs(sf-orb.pageY); var vis=Math.max(0,1-dist*6); if(vis<=0) continue;
      var ox=orb.px*W; var oy=H*0.5+(orb.pageY-sf)*pageHeight;
      var ef=Math.max(0,Math.min(1,Math.min(oy/H,(H-oy)/H)*5)); var fa=orb.a*vis*ef; if(fa<=0) continue;
      ctx.save(); ctx.globalAlpha=fa; var og=ctx.createRadialGradient(ox,oy,0,ox,oy,orb.rx*W); og.addColorStop(0,'rgba('+orb.col+',0.50)'); og.addColorStop(0.5,'rgba('+orb.col+',0.18)'); og.addColorStop(1,'rgba('+orb.col+',0)');
      ctx.fillStyle=og; ctx.save(); ctx.scale(1,orb.ry/orb.rx); ctx.beginPath(); ctx.arc(ox,oy/(orb.ry/orb.rx),orb.rx*W,0,Math.PI*2); ctx.fill(); ctx.restore(); ctx.restore();
    }

    /* Warm diagonal light shafts */
    var sv=Math.max(0,Math.min(1,(sf-0.08)*5))*Math.max(0,Math.min(1,(0.92-sf)*5));
    if(sv>0.01){
      ctx.save(); ctx.globalAlpha=0.012*sv;
      var shafts=[0.18,0.42,0.70,0.90];
      for(var sh=0;sh<shafts.length;sh++){var shx=shafts[sh]*W; var shg=ctx.createLinearGradient(shx-50,0,shx+70,H); shg.addColorStop(0,'rgba(255,220,80,0)'); shg.addColorStop(0.35,'rgba(255,220,80,0.65)'); shg.addColorStop(0.65,'rgba(255,200,60,0.45)'); shg.addColorStop(1,'rgba(255,180,40,0)'); ctx.fillStyle=shg; ctx.beginPath(); ctx.moveTo(shx-40,0); ctx.lineTo(shx+40,0); ctx.lineTo(shx+90,H); ctx.lineTo(shx+10,H); ctx.closePath(); ctx.fill();}
      ctx.restore();
    }

    /* Floating motes */
    for(var mi=0;mi<MOTES.length;mi++){
      var m=MOTES[mi]; m.x+=m.vx; m.y+=m.vy; m.phase+=0.02;
      if(m.y<-10){m.y=H+10;m.x=Math.random()*W;} if(m.x<-10)m.x=W+10; if(m.x>W+10)m.x=-10;
      var ma=m.a*(0.4+0.6*(0.5+0.5*Math.sin(m.phase)));
      ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,Math.PI*2); ctx.fillStyle='rgba(255,210,80,'+ma+')'; ctx.fill();
    }
  }

  /* ── Sun ───────────────────────────────────────────────── */
  function drawSun(){
    var sx=SUN.bx+mouseX*12,sy=SUN.by+mouseY*6,R=SUN.R;
    ctx.save(); ctx.globalAlpha=heroOpacity;
    var atmo=ctx.createRadialGradient(sx,sy,R,sx,sy,R*9); atmo.addColorStop(0,'rgba(255,235,140,0.13)'); atmo.addColorStop(0.25,'rgba(255,200,80,0.07)'); atmo.addColorStop(0.6,'rgba(255,170,40,0.03)'); atmo.addColorStop(1,'rgba(255,140,0,0)'); ctx.fillStyle=atmo; ctx.beginPath(); ctx.arc(sx,sy,R*9,0,Math.PI*2); ctx.fill();
    var corona=ctx.createRadialGradient(sx,sy,R*0.9,sx,sy,R*2.8); corona.addColorStop(0,'rgba(255,250,200,0.18)'); corona.addColorStop(0.4,'rgba(255,220,100,0.08)'); corona.addColorStop(1,'rgba(255,180,40,0)'); ctx.fillStyle=corona; ctx.beginPath(); ctx.arc(sx,sy,R*2.8,0,Math.PI*2); ctx.fill();
    var rr=frame*0.06,nr=20; ctx.save(); ctx.translate(sx,sy); ctx.rotate(rr);
    for(var ri=0;ri<nr;ri++){var ang=(ri/nr)*Math.PI*2,ip=(ri%2===0),rl=R*(ip?4.5:2.8),ra=(ip?0.10:0.05)*(0.8+0.2*Math.sin(frame*0.8+ri)); var rg=ctx.createLinearGradient(Math.cos(ang)*R,Math.sin(ang)*R,Math.cos(ang)*rl,Math.sin(ang)*rl); rg.addColorStop(0,'rgba(255,230,100,'+ra+')'); rg.addColorStop(0.5,'rgba(255,200,60,'+(ra*0.4)+')'); rg.addColorStop(1,'rgba(255,180,0,0)'); var tw2=R*(ip?0.07:0.04); ctx.beginPath(); ctx.moveTo(Math.cos(ang)*R-Math.sin(ang)*tw2,Math.sin(ang)*R+Math.cos(ang)*tw2); ctx.lineTo(Math.cos(ang)*rl,Math.sin(ang)*rl); ctx.lineTo(Math.cos(ang)*R+Math.sin(ang)*tw2,Math.sin(ang)*R-Math.cos(ang)*tw2); ctx.fillStyle=rg; ctx.fill();} ctx.restore();
    var inner=ctx.createRadialGradient(sx-R*0.2,sy-R*0.2,R*0.02,sx,sy,R); inner.addColorStop(0,'rgba(255,255,240,1)'); inner.addColorStop(0.3,'rgba(255,248,180,1)'); inner.addColorStop(0.7,'rgba(255,225,80,0.98)'); inner.addColorStop(1,'rgba(255,195,30,0.92)');
    ctx.shadowColor='rgba(255,210,50,0.55)'; ctx.shadowBlur=R*2.5; ctx.fillStyle=inner; ctx.beginPath(); ctx.arc(sx,sy,R,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    ctx.save(); ctx.globalAlpha=0.28; var hl=ctx.createRadialGradient(sx-R*0.3,sy-R*0.3,0,sx-R*0.3,sy-R*0.3,R*0.55); hl.addColorStop(0,'rgba(255,255,255,0.9)'); hl.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(sx,sy,R,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.restore();
  }

  /* ── Full Light Draw ───────────────────────────────────── */
  function drawLight(){
    ctx.clearRect(0,0,W,H);
    if(heroOpacity>0) drawSun();
    if(heroOpacity>0){
      ctx.save(); ctx.globalAlpha=heroOpacity;
      for(var ci=0;ci<CLOUDS.length;ci++){
        var cl=CLOUDS[ci]; cl.drift+=cl.sp;
        var cx2=cl.nx*W+Math.sin(cl.drift)*7, cy2=cl.ny*H+Math.cos(cl.drift*0.5)*2.5;
        if(cl.type==='cirrus') drawCirrus(cx2,cy2,cl.w,cl.sy,cl.a);
        else drawCumulus(cx2,cy2,cl.r);
      }
      ctx.restore();
    }
    drawLightBody();
  }

  /* ══ RESIZE / INIT / LOOP ════════════════════════════════ */
  function resize(){ W=c.width=window.innerWidth; H=c.height=window.innerHeight; }
  function init()  { resize(); initStars(); initLight(); updateScroll(); }
  function draw()  { frame+=0.012; document.documentElement.getAttribute('data-theme')==='light'?drawLight():drawDark(); requestAnimationFrame(draw); }

  window.addEventListener('resize',function(){resize();initStars();initLight();});
  init(); draw();
}());