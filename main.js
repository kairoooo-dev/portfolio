/* ═══════════════════════════════════════════════════════
   Crowz Portfolio: Loader, Stars & Chill Sound
   ═══════════════════════════════════════════════════════ */

/* ── Loading / enter screen ───────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const enter = document.getElementById('loaderEnter');
  const pctEl = document.getElementById('loaderPct');
  const statusEl = document.getElementById('loaderStatus');
  const bootEl = document.getElementById('loaderBoot');
  const segEl = document.getElementById('loaderSeg');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let loaded = false, entered = false, bootDone = false, starsRaf = 0;

  const BOOT = [
    { pre: 'initializing crowzOS',    ok: 'ok',     ready: false },
    { pre: 'loading portfolio',       ok: 'ok',     ready: false },
    { pre: 'compiling styles',        ok: 'ok',     ready: false },
    { pre: 'linking scripts',         ok: 'ok',     ready: false },
    { pre: 'warming the starfield',   ok: 'ok',     ready: false },
    { pre: 'shipping pixels',         ok: 'ok',     ready: false },
    { pre: 'ready',                   ok: 'ready.', ready: true  }
  ];
  const DOTS = 9;

  /* ── twinkling stars inside the loader ── */
  if (segEl && !segEl.children.length) {
    for (let s = 0; s < 24; s++) segEl.appendChild(document.createElement('i'));
  }
  const starsC = document.getElementById('loaderStars');
  if (starsC && starsC.getContext) {
    const sctx = starsC.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let sw = 0, sh = 0;
    function sresize() {
      sw = loader.clientWidth; sh = loader.clientHeight;
      starsC.width = sw * dpr; starsC.height = sh * dpr;
      starsC.style.width = sw + 'px'; starsC.style.height = sh + 'px';
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sresize();
    const sn = Math.min(80, Math.floor(sw * sh / 16000));
    const sstars = Array.from({ length: sn }, () => ({
      x: Math.random() * sw, y: Math.random() * sh,
      r: Math.random() * 1.4 + .4,
      base: .2 + Math.random() * .4,
      tw: .4 + Math.random() * 2,
      ph: Math.random() * Math.PI * 2,
      hot: Math.random() < .2
    }));
    function sTick() {
      starsRaf = requestAnimationFrame(sTick);
      sctx.clearRect(0, 0, sw, sh);
      const t = performance.now() / 1000;
      sctx.globalCompositeOperation = 'lighter';
      for (const s of sstars) {
        const a = s.base + Math.sin(t * s.tw + s.ph) * s.base * .5;
        sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sctx.fillStyle = s.hot ? `rgba(252,165,165,${a})` : `rgba(234,234,242,${a})`;
        sctx.fill();
      }
      sctx.globalCompositeOperation = 'source-over';
    }
    sTick();
  }

  /* ── boot log sequence ── */
  const TYPE_MS = reduced ? 1 : 13;
  const DOT_MS = reduced ? 1 : 24;
  let completed = 0;
  const total = BOOT.length;

  function setProgress(p) {
    p = Math.max(0, Math.min(1, p));
    if (pctEl) pctEl.textContent = Math.round(p * 100) + '%';
    if (segEl) {
      const segs = segEl.children;
      const fill = Math.round(p * segs.length);
      for (let i = 0; i < segs.length; i++) segs[i].classList.toggle('on', i < fill);
    }
  }

  function makeRow(line) {
    const row = document.createElement('div');
    row.className = 'boot-row';
    const pre = document.createElement('span');
    pre.className = 'boot-pre';
    const pad = document.createElement('span');
    pad.className = 'boot-pad';
    const ok = document.createElement('span');
    ok.className = 'boot-ok' + (line.ready ? ' ready-line' : '');
    row.append(pre, pad, ok);
    return { row, pre, pad, ok };
  }

  function typeLine(line, next) {
    const { row, pre, pad, ok } = makeRow(line);
    bootEl.appendChild(row);
    requestAnimationFrame(() => row.classList.add('in'));
    if (statusEl) statusEl.textContent = line.pre + '\u2026';

    let ci = 0;
    const typeIv = setInterval(() => {
      ci++;
      pre.textContent = '> ' + line.pre.slice(0, ci);
      if (ci >= line.pre.length) {
        clearInterval(typeIv);
        let di = 0;
        const dotIv = setInterval(() => {
          di++;
          pad.textContent = '.'.repeat(Math.min(di, DOTS));
          setProgress((completed + di / DOTS) / total);
          if (di >= DOTS) {
            clearInterval(dotIv);
            ok.textContent = line.ok;
            completed++;
            setProgress(completed / total);
            setTimeout(next, reduced ? 40 : 240);
          }
        }, DOT_MS);
      }
    }, TYPE_MS);
    return { stop() { clearInterval(typeIv); } };
  }

  function runBoot() {
    if (!bootEl) { bootDone = true; return; }
    let i = 0;
    function next() {
      if (!loader.isConnected || i >= total) { finishBoot(); return; }
      typeLine(BOOT[i], next);
      i++;
    }
    function finishBoot() {
      bootDone = true;
      if (statusEl) statusEl.textContent = 'ready. waiting on you';
      const lastRow = bootEl.lastElementChild;
      if (lastRow) {
        const ok = lastRow.querySelector('.boot-ok');
        if (ok && ok.textContent !== 'ready.') ok.textContent = 'ready.';
      }
      enable();
    }
    next();
  }

  function enable() {
    if (loaded) return;
    loaded = true;
    setProgress(1);
    if (enter) { enter.classList.add('ready'); enter.focus(); }
  }

  const minWait = new Promise(r => setTimeout(r, 2600));
  const pageLoad = new Promise(r => {
    if (document.readyState === 'complete') r();
    else window.addEventListener('load', r, { once: true });
  });
  runBoot();
  Promise.all([minWait, pageLoad, new Promise(r => { const iv = setInterval(() => { if (bootDone) { clearInterval(iv); r(); } }, 100); })])
    .then(enable);

  function enterSite() {
    if (!loaded || entered) return;
    entered = true;
    if (starsRaf) cancelAnimationFrame(starsRaf);
    if (window.CrowzAudio) window.CrowzAudio.start();
    loader.classList.add('loader-hide');
    document.documentElement.classList.remove('locked');
    setTimeout(() => loader.remove(), 600);
  }

  if (enter) enter.addEventListener('click', enterSite);
  loader.addEventListener('click', enterSite);
  window.addEventListener('keydown', e => {
    if (loaded && (e.key === 'Enter' || e.key === ' ')) enterSite();
  });
  document.documentElement.classList.add('locked');
})();

/* ── Starfield particles + mouse connection lines ── */
(function initParticles() {
  const c = document.getElementById('particles');
  if (!c || !c.getContext) return;
  const ctx = c.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  let W, H;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize(); window.addEventListener('resize', resize);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = Math.min(90, Math.floor(W * H / 16000));
  const stars = Array.from({ length: N }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.6 + .4,
    base: .25 + Math.random() * .4,
    tw: .5 + Math.random() * 2.4,
    ph: Math.random() * Math.PI * 2,
    hot: Math.random() < .18
  }));

  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { mx = -9999; my = -9999; }, { passive: true });

  const LINK_R = 180;
  let frame = 0;

  function tick() {
    frame++;
    if (!reduced) requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    const time = performance.now() / 1000;

    /* Connection lines first (under the stars) */
    ctx.lineWidth = 1;
    for (let i = 0; i < N; i++) {
      const dx = stars[i].x - mx, dy = stars[i].y - my;
      const dm = Math.sqrt(dx * dx + dy * dy);
      if (dm < LINK_R && mx > -9000) {
        const t = 1 - dm / LINK_R;
        ctx.strokeStyle = `rgba(239,68,68,${.55 * t})`;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(mx, my);
        ctx.stroke();
        if (t > .75) drawRing(stars[i].x, stars[i].y, time);
      }
      if (frame % 2 === 0) {
        for (let j = i + 1; j < N; j++) {
          const sdx = stars[i].x - stars[j].x, sdy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(sdx * sdx + sdy * sdy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(248,113,113,${.09 * (1 - dist / 100)})`;
            ctx.beginPath(); ctx.moveTo(stars[i].x, stars[i].y); ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
    }

    /* The stars themselves (twinkling) */
    ctx.globalCompositeOperation = 'lighter';
    for (const s of stars) {
      const a = s.base + Math.sin(time * s.tw + s.ph) * s.base * .5;
      const r = s.r * (1 + Math.sin(time * s.tw + s.ph) * .18);
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = s.hot ? `rgba(252,165,165,${a})` : `rgba(232,232,238,${a})`;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawRing(x, y, time) {
    const rr = 10 + Math.sin(time * 6) * 3;
    ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(252,165,165,.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (reduced) { tick(); return; }
  tick();
})();

/* ── Skills atom ──────────────────────────────────── */
(function initAtom() {
  const canvas = document.getElementById('atomCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrap = canvas.parentElement;

  const ORBITALS = [
    { tilt: 0,            speed: 1.0 },
    { tilt: Math.PI / 3,  speed: .75 },
    { tilt: 2 * Math.PI / 3, speed: .55 }
  ];
  const CENTER = { name: 'Java', img: 'images/skills/java.svg', color: '#f89820' };
  const TIPS = [
    { name: 'Python',     img: 'images/skills/python.svg',     color: '#4b8bbe', orb: 0, side: 0 },
    { name: 'Node.js',    img: 'images/skills/nodejs.svg',     color: '#68a063', orb: 0, side: 1 },
    { name: 'JavaScript', img: 'images/skills/javascript.svg', color: '#f7df1e', orb: 1, side: 0 },
    { name: 'C++',        img: 'images/skills/cplusplus.svg',  color: '#5c8dc7', orb: 1, side: 1 },
    { name: 'HTML',       img: 'images/skills/html5.svg',      color: '#e44d26', orb: 2, side: 0 },
    { name: 'C#',         img: 'images/skills/csharp.svg',     color: '#a45cc9', orb: 2, side: 1 }
  ];
  const DOTS = [
    { orb: 0, phase: 0 }, { orb: 0, phase: Math.PI },
    { orb: 1, phase: Math.PI / 3 }, { orb: 1, phase: 4 * Math.PI / 3 },
    { orb: 2, phase: 2 * Math.PI / 3 }, { orb: 2, phase: 5 * Math.PI / 3 }
  ];
  const HOVER_CENTER = TIPS.length;

  CENTER.imgEl = new Image();
  CENTER.imgEl.onload = () => { CENTER.ready = true; };
  CENTER.imgEl.src = CENTER.img;
  TIPS.forEach(s => {
    s.imgEl = new Image();
    s.imgEl.onload = () => { s.ready = true; };
    s.imgEl.src = s.img;
  });

  let W = 0, H = 0, cx = 0, cy = 0, unit = 0;
  let rot = 0, vel = 0, dragging = false, lastX = 0, hover = -1, lastSrot = 0;
  let clickFlash = -1, clickT = -1e9, lastHoverSfx = 0, tLast = 0;
  let downX = 0, downY = 0, downT = 0;
  const pointers = new Set();
  const keys = { l: false, r: false };
  let visible = true;
  const SPIN = .12;
  const t0 = performance.now();
  const trails = DOTS.map(() => []);

  const dust = [];
  if (!reduced) {
    for (let i = 0; i < 16; i++) {
      dust.push({
        ang: Math.random() * Math.PI * 2,
        r: .3 + Math.random() * .28,
        speed: (.3 + Math.random() * .7) * (Math.random() < .5 ? -1 : 1),
        size: 1 + Math.random() * 1.8,
        tint: Math.random() < .3
      });
    }
  }
  const rings = [];
  let ringTimer = 0;

  function resize() {
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2; cy = H / 2;
    unit = Math.min(W, H) / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: .2 }).observe(canvas);
  }
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.l = true;
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.r = true;
    else return;
    if (visible && !dragging) e.preventDefault();
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.l = false;
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.r = false;
  });

  function wob(t, i) { return Math.sin(t * .4 + i * 2.1) * .05; }

  function tipPos(s, srot) {
    const ang = ORBITALS[s.orb].tilt + (s.side ? Math.PI : 0) + srot;
    return { x: cx + Math.cos(ang) * .58 * unit, y: cy + Math.sin(ang) * .58 * unit };
  }

  function dotPos(o, phase, t, srot) {
    const a = .58 * unit, b = .25 * unit;
    const th = phase + o.speed * t + srot;
    const ex = a * Math.cos(th);
    const ey = b * Math.sin(th);
    const tilt = o.tilt + srot + wob(t, ORBITALS.indexOf(o));
    return {
      x: cx + ex * Math.cos(tilt) - ey * Math.sin(tilt),
      y: cy + ex * Math.sin(tilt) + ey * Math.cos(tilt),
      th
    };
  }

  function drawDot(i, d, t, srot, front) {
    const p = dotPos(d, d.phase, t, srot);
    if (!reduced) {
      trails[i].push({ x: p.x, y: p.y });
      if (trails[i].length > 12) trails[i].shift();
      const tr = trails[i];
      for (let k = 0; k < tr.length; k++) {
        const f = (k + 1) / tr.length;
        ctx.beginPath();
        ctx.arc(tr[k].x, tr[k].y, .5 + 2 * f, 0, Math.PI * 2);
        ctx.fillStyle = '#fca5a5';
        ctx.globalAlpha = .3 * f * (front ? 1 : .4);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    const dr = Math.max(3, .032 * unit) * (front ? 1 : .72);
    ctx.beginPath();
    ctx.arc(p.x, p.y, dr, 0, Math.PI * 2);
    ctx.fillStyle = front ? '#fca5a5' : 'rgba(252,165,165,.55)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, dr * .4, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a10';
    ctx.fill();
  }

  function drawLogo(s, p, er, hot, t) {
    const tt = t - clickT;
    const flash = clickFlash >= 0 && s.name === (clickFlash === HOVER_CENTER ? CENTER.name : TIPS[clickFlash].name);
    const flashFade = flash ? Math.max(0, 1 - tt / .9) : 0;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, er, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#0f0f16';
    ctx.fillRect(p.x - er, p.y - er, er * 2, er * 2);
    if (s.ready) {
      const s2 = er * 1.8;
      ctx.drawImage(s.imgEl, p.x - s2 / 2, p.y - s2 / 2, s2, s2);
    } else {
      ctx.fillStyle = s.color;
      ctx.fillRect(p.x - er * .5, p.y - er * .5, er, er);
    }
    ctx.restore();
    ctx.beginPath();
    ctx.arc(p.x, p.y, er, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = hot ? '#fff' : s.color;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x - er * .35, p.y - er * .35, er * .22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.fill();
    if (hot) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, er + 5 + Math.sin(t * 6) * 2.5, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.45)';
      ctx.stroke();
    }
    if (flashFade > 0) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, er + 6 + flashFade * er * 1.8, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = flashFade * .8;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, er + 4 + flashFade * er * 3, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.6)';
      ctx.globalAlpha = flashFade * .7;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.font = Math.round(Math.max(8, unit * .075)) + "px 'JetBrains Mono', monospace";
    ctx.fillStyle = hot || flashFade > 0 ? '#fff' : '#eaeaf2';
    ctx.fillText(unit < 190 ? s.name.replace(/^(Node\.js|JavaScript)$/, m => m === 'Node.js' ? 'Node' : 'JS') : s.name, p.x, p.y + er + Math.max(8, unit * .075));
  }

  function draw(t, srot, dt) {
    ctx.clearRect(0, 0, W, H);

    if (!reduced) {
      ringTimer += dt;
      if (ringTimer > 2.2) {
        ringTimer = 0;
        rings.push({ r: 0, a: .3 });
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += unit * .5 * dt;
        rg.a -= .012;
        if (rg.a <= 0 || rg.r > unit * .62) { rings.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(cx, cy, rg.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(220,38,38,' + rg.a + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      for (const d of dust) {
        const a = d.ang + d.speed * t;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * d.r * unit, cy + Math.sin(a) * d.r * unit, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.tint ? '#fca5a5' : '#eaeaf2';
        ctx.globalAlpha = .28;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < ORBITALS.length; i++) {
      const tilt = ORBITALS[i].tilt + srot + wob(t, i);
      ctx.beginPath();
      ctx.ellipse(cx, cy, .58 * unit, .25 * unit, tilt, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.08)';
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, .58 * unit, .25 * unit, tilt + .04, 0, Math.PI * 2);
      ctx.lineWidth = .5;
      ctx.strokeStyle = 'rgba(255,255,255,.04)';
      ctx.stroke();
      ctx.beginPath();
      ctx.setLineDash([5, 9]);
      ctx.ellipse(cx, cy, .58 * unit, .25 * unit, tilt, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(252,165,165,.12)';
      ctx.lineDashOffset = -t * 26 - srot * 40;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (let i = 0; i < DOTS.length; i++) {
      if (Math.sin(DOTS[i].phase + ORBITALS[DOTS[i].orb].speed * t + srot) < 0) {
        drawDot(i, DOTS[i], t, srot, false);
      }
    }

    for (let i = 0; i < TIPS.length; i++) {
      const s = TIPS[i];
      const p = tipPos(s, srot);
      const hot = i === hover;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = hot ? .6 : .14;
      ctx.lineWidth = hot ? 1.5 : 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    const hotCenter = hover === HOVER_CENTER;
    const cer = .155 * unit * (hotCenter ? 1.12 : 1);
    ctx.strokeStyle = 'rgba(220,38,38,.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, cer + 8 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
    ctx.stroke();
    if (!reduced) {
      const npr = cer * 1.9;
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4 + t * .9 + srot;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * npr, cy + Math.sin(a) * npr, Math.max(1.2, .012 * unit), 0, Math.PI * 2);
        ctx.fillStyle = i % 2 ? '#dc2626' : '#fca5a5';
        ctx.globalAlpha = .55;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    drawLogo(CENTER, { x: cx, y: cy }, cer, hotCenter, t);

    for (let i = 0; i < TIPS.length; i++) {
      const s = TIPS[i];
      const p = tipPos(s, srot);
      const hot = i === hover;
      const er = .105 * unit * (hot ? 1.25 : 1) * (1 + Math.sin(t * 1.6 + i) * .04);
      drawLogo(s, p, er, hot, t);
    }

    for (let i = 0; i < DOTS.length; i++) {
      if (Math.sin(DOTS[i].phase + ORBITALS[DOTS[i].orb].speed * t + srot) >= 0) {
        drawDot(i, DOTS[i], t, srot, true);
      }
    }
  }

  function loop(now) {
    requestAnimationFrame(loop);
    const dt = reduced ? 0 : Math.min((now - t0) / 1000 - tLast, .05);
    const t = reduced ? 0 : (now - t0) / 1000;
    tLast = t;
    const srot = rot + t * SPIN;
    lastSrot = srot;
    if (!dragging) {
      if (visible && keys.l) rot -= .004;
      if (visible && keys.r) rot += .004;
      rot += vel;
      vel *= .96;
      if (Math.abs(vel) < .0004) vel = 0;
    }
    draw(t, srot, dt);
  }
  requestAnimationFrame(loop);

  canvas.addEventListener('pointerdown', e => {
    pointers.add(e.pointerId);
    downX = e.clientX; downY = e.clientY; downT = performance.now();
    if (pointers.size >= 2) return;
    dragging = true;
    vel = 0;
    lastX = e.clientX;
    canvas.classList.add('grabbing');
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (dragging) {
      const dx = e.clientX - lastX;
      rot += dx * .006;
      vel = dx * .006;
      lastX = e.clientX;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best = -1, bestD = Infinity;
    const spots = [
      ...TIPS.map((s, i) => ({ i, p: tipPos(s, lastSrot), r: Math.max(7, .105 * unit) + 10 })),
      { i: HOVER_CENTER, p: { x: cx, y: cy }, r: Math.max(9, .155 * unit) + 10 }
    ];
    for (const spot of spots) {
      const d = Math.hypot(spot.p.x - mx, spot.p.y - my);
      if (d < spot.r && d < bestD) { bestD = d; best = spot.i; }
    }
    if (best !== hover) {
      hover = best;
      const now = performance.now();
      if (best >= 0 && window.CrowzAudio && now - lastHoverSfx > 130) {
        lastHoverSfx = now;
        window.CrowzAudio.hover();
      }
    }
    canvas.style.cursor = best >= 0 ? 'pointer' : 'grab';
  });
  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      dragging = false;
      canvas.classList.remove('grabbing');
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist < 8 && performance.now() - downT < 500) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let best = -1, bestD = Infinity;
        const spots = [
          ...TIPS.map((s, i) => ({ i, p: tipPos(s, lastSrot), r: Math.max(7, .105 * unit) + 10 })),
          { i: HOVER_CENTER, p: { x: cx, y: cy }, r: Math.max(9, .155 * unit) + 10 }
        ];
        for (const spot of spots) {
          const d = Math.hypot(spot.p.x - mx, spot.p.y - my);
          if (d < spot.r && d < bestD) { bestD = d; best = spot.i; }
        }
        if (best >= 0) {
          clickFlash = best;
          clickT = (performance.now() - t0) / 1000;
          if (window.CrowzAudio) window.CrowzAudio.click();
        }
      } else if (Math.abs(vel) > .006 && window.CrowzAudio) {
        window.CrowzAudio.whoosh();
      }
    }
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('pointerleave', () => {
    if (!dragging) hover = -1;
  });
  canvas.addEventListener('dblclick', () => {
    rot = 0;
    vel = 0;
  });
})();

/* ── Scroll progress bar ──────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    });
  }, { passive: true });
})();

/* ── Nav scroll style ─────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('topnav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── Typewriter ───────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Minecraft Plugin Developer',
    'Owner of Enclave SMP',
    'Security & Performance',
    '18+ Free Verified Plugins',
    'i do sh*t RIGHT'
  ];
  let pi = 0, ci = 0, deleting = false;
  function loop() {
    const phrase = phrases[pi];
    el.textContent = phrase.slice(0, ci);
    let delay = deleting ? 45 : 80;
    if (!deleting && ci === phrase.length) { delay = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
    else ci += deleting ? -1 : 1;
    setTimeout(loop, delay);
  }
  loop();
})();

/* ── Stat counters ────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target, target = +el.dataset.count, dur = 1200, start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: .5 });
  nums.forEach(n => io.observe(n));
})();

/* ── 3D card tilt (rAF throttled, event delegation) ─ */
(function initTilt() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  let raf = 0, current = null;
  document.addEventListener('mousemove', e => {
    if (!e.target || !e.target.closest) return;
    const card = e.target.closest('.tilt');
    if (card !== current) {
      if (current) current.style.transform = '';
      current = card;
    }
    if (!card || raf) return;
    raf = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
      raf = 0;
    });
  });
  document.addEventListener('mouseleave', () => {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (current) { current.style.transform = ''; current = null; }
  });
})();

/* ── Render plugins ───────────────────────────────── */
(function renderPlugins() {
  const grid = document.getElementById('pluginGrid');
  if (!grid || typeof PLUGINS === 'undefined') return;

  function cardHTML(p) {
    const color = CATEGORY_COLORS[p.category] || '#94a3b8';
    const icon = CATEGORY_ICONS[p.category] || '';
    const feats = (p.features || []).map(f => `<span class="plugin-feature">${esc(f)}</span>`).join('');
    return `
      <div class="plugin-card glass tilt" data-type="${esc(p.type)}" data-name="${esc(p.name.toLowerCase())}">
        <div class="plugin-top">
          <span class="plugin-type-badge">${esc(p.type)} &middot; v${esc(p.version)}</span>
        </div>
        <div class="plugin-meta">
          <span class="plugin-icon" style="color:${color}">${icon}</span>
          <h3 class="plugin-name">${esc(p.name)}</h3>
          <span class="plugin-cat" style="background:${color}20;color:${color}">${esc(p.category)}</span>
        </div>
        <p class="plugin-desc">${esc(p.desc)}</p>
        <div class="plugin-features">${feats}</div>
      </div>`;
  }

  grid.innerHTML = PLUGINS.map(cardHTML).join('');

  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      grid.querySelectorAll('.plugin-card').forEach(card => {
        const show = f === 'all' || card.dataset.type === f;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* ── Reveal on scroll ─────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  els.forEach(el => io.observe(el));
})();

/* ── Smooth scroll ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Hero parallax on scroll ──────────────────────── */
(function initParallax() {
  const banner = document.getElementById('bannerImg');
  if (!banner) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < 900) banner.style.transform = `translateY(${y * .22}px) scale(1.08)`;
      ticking = false;
    });
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════
   Audio: chill procedural ambiance + soft SFX.
   Synthesized with Web Audio: no files, works offline.
   ═══════════════════════════════════════════════════════ */
(function initAudio() {
  const toggle = document.getElementById('musicToggle');
  let ctx = null, master = null, musicBus = null, sfxBus = null;
  let musicOn = false, sfxOn = true;
  let schedulerId = null, nextNoteTime = 0, step = 0;
  let playing = false;

  /* Chill progression: Cmaj7 · Am7 · Fmaj7 · G as [root, chord] voice freqs */
  const CHORDS = [
    [130.81, 164.81, 196.00, 246.94], /* Cmaj7 */
    [110.00, 164.81, 196.00, 246.94], /* Am7  */
    [ 87.31, 130.81, 164.81, 220.00], /* Fmaj7 */
    [ 98.00, 146.83, 196.00, 246.94]  /* G6   */
  ];
  const PENTA = [220, 261.63, 293.66, 329.63, 392, 440, 523.25]; /* A minor pentatonic */

  function unlock() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = .8; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = .6; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = .6; sfxBus.connect(master);

    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
    bindSfx();
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);

  /* ── Soft SFX ───────────────────────────────────── */
  function tone(freq, dur, gain, type, when, glideTo) {
    const t = when || ctx.currentTime;
    const o = ctx.createOscillator(); o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + .01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxBus);
    o.start(t); o.stop(t + dur + .05);
  }
  function sClick() { if (!ctx || !sfxOn) return; tone(560, .14, .05, 'triangle'); }
  function sHover() { if (!ctx || !sfxOn) return; tone(760, .07, .016, 'sine'); }
  function sWhoosh() { if (!ctx || !sfxOn) return; tone(420, .22, .025, 'sine', ctx.currentTime, 220); }

  function bindSfx() {
    let lastHover = 0;
    document.addEventListener('click', e => {
      if (e.target.closest('a, button')) sClick();
    });
    document.addEventListener('mouseover', e => {
      if (!e.target.closest) return;
      if (e.target.closest('a, button, .tilt')) {
        const now = performance.now();
        if (now - lastHover > 100) { sHover(); lastHover = now; }
      }
    });
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => sWhoosh()));
  }

  /* ── Chill music scheduler ──────────────────────── */
  const STEP = .42;        /* slow 8th-note feel   */
  const BAR = 8;           /* steps per bar        */
  const LOOKAHEAD = .6;

  function pad(chordKeys, dur) {
    if (!ctx) return;
    for (let i = 0; i < chordKeys.length; i++) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = chordKeys[i];
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 480;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, nextNoteTime);
      g.gain.exponentialRampToValueAtTime(.035, nextNoteTime + 2.2);
      g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + dur);
      o.connect(lp); lp.connect(g); g.connect(musicBus);
      o.start(nextNoteTime); o.stop(nextNoteTime + dur + .2);
    }
  }

  function bass(freq) {
    if (!ctx) return;
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq / 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, nextNoteTime);
    g.gain.exponentialRampToValueAtTime(.05, nextNoteTime + .04);
    g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + 1.6);
    o.connect(g); g.connect(musicBus);
    o.start(nextNoteTime); o.stop(nextNoteTime + 1.8);
  }

  function pluck(freq) {
    if (!ctx) return;
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, nextNoteTime);
    g.gain.exponentialRampToValueAtTime(.05, nextNoteTime + .012);
    g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + .7);
    o.connect(g); g.connect(musicBus);
    o.start(nextNoteTime); o.stop(nextNoteTime + .8);
  }

  function shimmer(freq) {
    if (!ctx) return;
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, nextNoteTime);
    g.gain.exponentialRampToValueAtTime(.014, nextNoteTime + .05);
    g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + 1.4);
    o.connect(g); g.connect(musicBus);
    o.start(nextNoteTime); o.stop(nextNoteTime + 1.5);
  }

  function scheduleStep() {
    if (!musicOn || !ctx) return;
    while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
      const pos = step % (BAR * 8);      /* 8-bar loop */
      const bar = Math.floor(step / BAR) % 4;

      if (step % BAR === 0) pad(CHORDS[bar], BAR * 3 * STEP);   /* chord per bar, 3-bar tail */
      if (step % BAR === 0) bass(CHORDS[bar][0]);

      if (pos % 2 === 0 && pos > 2) {
        if (Math.random() < .55) pluck(PENTA[Math.floor(Math.random() * 5)] * (Math.random() < .3 ? 2 : 1));
      }
      if (pos === BAR * 3 + 4 || pos === BAR * 7 + 4) shimmer([440, 880][Math.floor(Math.random() * 2)]);

      nextNoteTime += STEP;
      step++;
    }
  }

  function startMusic() {
    if (!ctx || musicOn) return;
    musicOn = true; playing = true;
    if (ctx.state === 'suspended') ctx.resume();
    nextNoteTime = ctx.currentTime + .15;
    step = 0;
    schedulerId = setInterval(scheduleStep, 100);
    toggle.classList.add('on');
  }
  function stopMusic() {
    if (schedulerId) { clearInterval(schedulerId); schedulerId = null; }
    musicOn = false; playing = false;
    toggle.classList.remove('on');
  }

  window.CrowzAudio = {
    start() { unlock(); startMusic(); },
    stop() { stopMusic(); },
    toggle() { if (musicOn) stopMusic(); else { unlock(); startMusic(); } },
    hover() { sHover(); },
    click() { sClick(); },
    whoosh() { sWhoosh(); }
  };

  if (toggle) {
    toggle.addEventListener('click', () => window.CrowzAudio.toggle());
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && musicOn) stopMusic();
    else if (!document.hidden && playing && ctx) {
      nextNoteTime = ctx.currentTime + .15;
      schedulerId = setInterval(scheduleStep, 100);
    }
  });
})();