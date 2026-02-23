(function () {
  'use strict';

  var c = document.getElementById('starsCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, frame = 0;

  /* Canvas always fixed to viewport — never scrolls */
  c.style.position = 'fixed';
  c.style.top      = '0';
  c.style.left     = '0';
  c.style.width    = '100%';
  c.style.height   = '100%';
  c.style.pointerEvents = 'none';
  c.style.zIndex   = '0';

  /* ══ STARS ══════════════════════════════════════════ */
  var stars = [], shootingStars = [];

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
  }

  function drawDark() {
    ctx.clearRect(0, 0, W, H);

    /* occasional shooting star */
    if (shootingStars.length < 2 && Math.random() < 0.002) {
      shootingStars.push({
        x: Math.random() * W, y: Math.random() * H * 0.4,
        len: 80 + Math.random() * 100,
        speed: 6 + Math.random() * 5,
        angle: Math.PI / 5, life: 1.0
      });
    }

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = s.a * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame * s.speed * 6 + s.phase)));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,220,255,' + a + ')';
      ctx.fill();
    }

    for (var j = shootingStars.length - 1; j >= 0; j--) {
      var ss = shootingStars[j];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= 0.025;
      if (ss.life <= 0) { shootingStars.splice(j, 1); continue; }
      var g = ctx.createLinearGradient(ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      g.addColorStop(0, 'rgba(255,255,255,' + ss.life + ')');
      g.addColorStop(0.3, 'rgba(180,210,255,' + (ss.life * 0.4) + ')');
      g.addColorStop(1, 'rgba(180,210,255,0)');
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  /* ══ SUN SCENE ═══════════════════════════════════════ */
  var SUN = {}, CLOUDS = [], MOTES = [];

  function initLight() {
    SUN.cx = W * 0.88;
    SUN.cy = H * 0.08;
    SUN.R  = Math.min(W, H) * 0.055;

    MOTES = [];
    for (var i = 0; i < 55; i++) {
      MOTES.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.08 + 0.02),
        a: Math.random() * 0.25 + 0.05,
        phase: Math.random() * Math.PI * 2
      });
    }

    CLOUDS = [
      { nx:0.06, ny:0.10, sw:0.22, sh:0.028, a:0.42, sp:0.006, drift:0    },
      { nx:0.28, ny:0.07, sw:0.18, sh:0.022, a:0.30, sp:0.004, drift:1.1  },
      { nx:0.50, ny:0.13, sw:0.25, sh:0.032, a:0.35, sp:0.007, drift:2.3  },
      { nx:0.10, ny:0.22, sw:0.14, sh:0.018, a:0.22, sp:0.003, drift:0.7  },
      { nx:0.68, ny:0.19, sw:0.16, sh:0.020, a:0.25, sp:0.005, drift:1.8  }
    ];
  }

  function drawCloudBand(cx, cy, sw, sh, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    var scaleY = sh / (sw * 0.5);
    var grd = ctx.createRadialGradient(cx, cy / scaleY, 0, cx, cy / scaleY, sw * 0.5);
    grd.addColorStop(0,    'rgba(255,255,255,0.95)');
    grd.addColorStop(0.35, 'rgba(250,248,245,0.80)');
    grd.addColorStop(0.7,  'rgba(245,240,235,0.35)');
    grd.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.scale(1, scaleY);
    ctx.beginPath();
    ctx.arc(cx, cy / scaleY, sw * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
  }

  function drawLight() {
    ctx.clearRect(0, 0, W, H);
    var sx = SUN.cx, sy = SUN.cy, R = SUN.R;

    /* 1. Wide atmospheric diffusion */
    var atmo = ctx.createRadialGradient(sx, sy, R, sx, sy, R * 9);
    atmo.addColorStop(0,   'rgba(255,235,140,0.13)');
    atmo.addColorStop(0.25,'rgba(255,200,80,0.07)');
    atmo.addColorStop(0.6, 'rgba(255,170,40,0.03)');
    atmo.addColorStop(1,   'rgba(255,140,0,0)');
    ctx.fillStyle = atmo;
    ctx.beginPath();
    ctx.arc(sx, sy, R * 9, 0, Math.PI * 2);
    ctx.fill();

    /* 2. Soft corona */
    var corona = ctx.createRadialGradient(sx, sy, R * 0.9, sx, sy, R * 2.8);
    corona.addColorStop(0,  'rgba(255,250,200,0.18)');
    corona.addColorStop(0.4,'rgba(255,220,100,0.08)');
    corona.addColorStop(1,  'rgba(255,180,40,0)');
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(sx, sy, R * 2.8, 0, Math.PI * 2);
    ctx.fill();

    /* 3. Elegant thin rays */
    var rayRot = frame * 0.06;
    var numRays = 20;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rayRot);
    for (var r = 0; r < numRays; r++) {
      var ang = (r / numRays) * Math.PI * 2;
      var isPrimary = (r % 2 === 0);
      var rayLen = R * (isPrimary ? 4.5 : 2.8);
      var rayAlpha = (isPrimary ? 0.10 : 0.05) * (0.8 + 0.2 * Math.sin(frame * 0.8 + r));
      var rg = ctx.createLinearGradient(
        Math.cos(ang) * R, Math.sin(ang) * R,
        Math.cos(ang) * rayLen, Math.sin(ang) * rayLen);
      rg.addColorStop(0,   'rgba(255,230,100,' + rayAlpha + ')');
      rg.addColorStop(0.5, 'rgba(255,200,60,'  + (rayAlpha * 0.4) + ')');
      rg.addColorStop(1,   'rgba(255,180,0,0)');
      var tipW = R * (isPrimary ? 0.07 : 0.04);
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * R - Math.sin(ang) * tipW,
                 Math.sin(ang) * R + Math.cos(ang) * tipW);
      ctx.lineTo(Math.cos(ang) * rayLen, Math.sin(ang) * rayLen);
      ctx.lineTo(Math.cos(ang) * R + Math.sin(ang) * tipW,
                 Math.sin(ang) * R - Math.cos(ang) * tipW);
      ctx.fillStyle = rg;
      ctx.fill();
    }
    ctx.restore();

    /* 4. Subtle lens flare streak */
    var flareAlpha = 0.04 + 0.02 * Math.sin(frame * 0.5);
    var flareLen = R * 7;
    var fAngle = Math.PI * 0.72;
    var fg = ctx.createLinearGradient(sx, sy,
      sx + Math.cos(fAngle) * flareLen, sy + Math.sin(fAngle) * flareLen);
    fg.addColorStop(0,   'rgba(255,255,220,' + flareAlpha + ')');
    fg.addColorStop(0.5, 'rgba(255,240,160,' + (flareAlpha * 0.5) + ')');
    fg.addColorStop(1,   'rgba(255,220,100,0)');
    ctx.save();
    ctx.lineWidth = R * 0.6;
    ctx.strokeStyle = fg;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(fAngle) * flareLen, sy + Math.sin(fAngle) * flareLen);
    ctx.stroke();
    ctx.restore();

    /* 5. Sun body with radial gradient */
    var inner = ctx.createRadialGradient(sx - R*0.2, sy - R*0.2, R*0.02, sx, sy, R);
    inner.addColorStop(0,   'rgba(255,255,240,1)');
    inner.addColorStop(0.3, 'rgba(255,248,180,1)');
    inner.addColorStop(0.7, 'rgba(255,225,80,0.98)');
    inner.addColorStop(1,   'rgba(255,195,30,0.92)');
    ctx.shadowColor = 'rgba(255,210,50,0.55)';
    ctx.shadowBlur  = R * 2.5;
    ctx.fillStyle   = inner;
    ctx.beginPath();
    ctx.arc(sx, sy, R, 0, Math.PI * 2);
    ctx.fill();

    /* highlight spot */
    ctx.shadowBlur = 0;
    ctx.save();
    ctx.globalAlpha = 0.28;
    var hl = ctx.createRadialGradient(sx-R*0.3, sy-R*0.3, 0, sx-R*0.3, sy-R*0.3, R*0.55);
    hl.addColorStop(0, 'rgba(255,255,255,0.9)');
    hl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.arc(sx, sy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* 6. Atmospheric cloud bands */
    for (var ci = 0; ci < CLOUDS.length; ci++) {
      var cl = CLOUDS[ci];
      cl.drift += cl.sp * 0.5;
      drawCloudBand(
        cl.nx * W + Math.sin(cl.drift) * 12,
        cl.ny * H,
        cl.sw * W, cl.sh * H, cl.a
      );
    }

    /* 7. Floating motes */
    for (var mi = 0; mi < MOTES.length; mi++) {
      var m = MOTES[mi];
      m.x += m.vx; m.y += m.vy; m.phase += 0.02;
      if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
      var ma = m.a * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(m.phase)));
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,220,100,' + ma + ')';
      ctx.fill();
    }
  }

  /* ══ RESIZE ══════════════════════════════════════════ */
  function resize() {
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
  }

  function init() { resize(); initStars(); initLight(); }

  /* ══ LOOP ════════════════════════════════════════════ */
  function draw() {
    frame += 0.012;
    document.documentElement.getAttribute('data-theme') === 'light'
      ? drawLight() : drawDark();
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () { resize(); initStars(); initLight(); });
  init();
  draw();
}());