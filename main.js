/* ═══════════════════════════════════════════════════════
   Crowz Portfolio — Stars & Chill Sound
   ═══════════════════════════════════════════════════════ */

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
    'i get sh*t DONE'
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
          <div class="plugin-icon" style="color:${color}">${icon}</div>
          <span class="plugin-type-badge">${esc(p.type)} &middot; v${esc(p.version)}</span>
        </div>
        <div class="plugin-meta">
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
   Audio — chill procedural ambiance + soft SFX.
   Synthesized with Web Audio: no files, works offline.
   ═══════════════════════════════════════════════════════ */
(function initAudio() {
  const toggle = document.getElementById('musicToggle');
  let ctx = null, master = null, musicBus = null, sfxBus = null;
  let musicOn = false, sfxOn = true;
  let schedulerId = null, nextNoteTime = 0, step = 0;
  let playing = false;

  /* Chill progression — Cmaj7 · Am7 · Fmaj7 · G — as [root, chord] voice freqs */
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

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (!ctx) unlock();
      if (musicOn) stopMusic(); else startMusic();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && musicOn) stopMusic();
    else if (!document.hidden && playing && ctx) {
      nextNoteTime = ctx.currentTime + .15;
      schedulerId = setInterval(scheduleStep, 100);
    }
  });
})();