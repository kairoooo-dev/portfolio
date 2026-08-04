/* ═══════════════════════════════════════════════════════
   Crowz Portfolio — Effects, Stars & Sound
   ═══════════════════════════════════════════════════════ */

/* ── Mesh gradient background ─────────────────────── */
(function initMesh() {
  const c = document.getElementById('mesh');
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

  const blobs = [
    { x: .2, y: .3, r: 380, vx: .00018, vy: .00014, hue: '220,38,38' },
    { x: .8, y: .65, r: 320, vx: -.00015, vy: -.0001, hue: '127,29,29' },
    { x: .5, y: .85, r: 300, vx: .0001, vy: -.00012, hue: '60,9,9' }
  ];
  let t = 0;
  function tick() {
    requestAnimationFrame(tick);
    t += .002;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';
    for (const b of blobs) {
      b.x += b.vx * Math.sin(t * 3 + b.r);
      b.y += b.vy * Math.cos(t * 2.4 + b.r);
      if (b.x < -.1) b.x = 1.1; if (b.x > 1.1) b.x = -.1;
      if (b.y < -.1) b.y = 1.1; if (b.y > 1.1) b.y = -.1;
      const g = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, b.r);
      g.addColorStop(0, `rgba(${b.hue},.1)`);
      g.addColorStop(1, `rgba(${b.hue},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(b.x * W - b.r, b.y * H - b.r, b.r * 2, b.r * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  tick();
})();

/* ── Starfield particles (the stars stay. always.) ── */
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
    vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12,
    r: Math.random() * 1.6 + .4,
    base: .25 + Math.random() * .4,
    tw: .5 + Math.random() * 2.4,
    ph: Math.random() * Math.PI * 2,
    hot: Math.random() < .18
  }));
  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  let frame = 0;
  function tick() {
    frame++;
    if (!reduced) requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    const time = performance.now() / 1000;
    ctx.globalCompositeOperation = 'lighter';
    for (const s of stars) {
      if (!reduced) { s.x += s.vx; s.y += s.vy; }
      if (s.x < -4) s.x = W + 4; if (s.x > W + 4) s.x = -4;
      if (s.y < -4) s.y = H + 4; if (s.y > H + 4) s.y = -4;
      const a = s.base + Math.sin(time * s.tw + s.ph) * s.base * .5;
      const r = s.r * (1 + Math.sin(time * s.tw + s.ph) * .18);
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = s.hot ? `rgba(252,165,165,${a})` : `rgba(232,232,238,${a})`;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    if (reduced) return;
    if (frame % 2 === 0) {
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath(); ctx.moveTo(stars[i].x, stars[i].y); ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(220,38,38,${.08 * (1 - dist / 110)})`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
        const dxm = stars[i].x - mx, dym = stars[i].y - my;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 150) {
          ctx.beginPath(); ctx.moveTo(stars[i].x, stars[i].y); ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(239,68,68,${.3 * (1 - dm / 150)})`; ctx.lineWidth = .9; ctx.stroke();
        }
      }
    }
  }
  tick();
})();

/* ── Mouse glow ───────────────────────────────────── */
(function initGlow() {
  const glow = document.getElementById('glow');
  if (!glow) return;
  let tx = -999, ty = -999, x = -999, y = -999, raf = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; }, { passive: true });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; }, { passive: true });
  function tick() {
    raf = requestAnimationFrame(tick);
    x += (tx - x) * .12; y += (ty - y) * .12;
    glow.style.transform = `translate(${x - 250}px, ${y - 250}px)`;
  }
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
   Audio — procedural ambient music + sound effects.
   Everything is synthesized with Web Audio: no files
   needed, works fully offline.
   ═══════════════════════════════════════════════════════ */
(function initAudio() {
  const toggle = document.getElementById('musicToggle');
  let ctx = null, master = null, musicBus = null, sfxBus = null;
  let musicOn = false, sfxOn = true;
  let schedulerId = null, nextNoteTime = 0, step = 0;

  const SCALE = [220, 261.63, 293.66, 329.63, 392, 440, 523.25]; // A minor pentatonic + extras
  const PAD_CHORDS = [[220, 329.63, 440], [174.61, 261.63, 349.23], [196, 293.66, 392]]; // Am · F · G

  function unlock() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = .9; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = .5; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = .75; sfxBus.connect(master);

    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
    bindSfx();
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);

  /* ── Sound effects ─────────────────────────────── */
  function blip(freq, dur, gain, type, when) {
    const t = when || ctx.currentTime;
    const o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + .008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxBus);
    o.start(t); o.stop(t + dur + .02);
  }
  function sClick() { if (!ctx || !sfxOn) return; blip(620, .12, .08, 'triangle'); blip(880, .1, .05, 'sine', ctx.currentTime + .01); }
  function sHover() { if (!ctx || !sfxOn) return; blip(980, .06, .03, 'sine'); }
  function sWhoosh() { if (!ctx || !sfxOn) return; blip(340, .18, .04, 'triangle'); }

  function bindSfx() {
    let lastHover = 0;
    document.addEventListener('click', e => {
      if (e.target.closest('a, button')) sClick();
      if (e.target === toggle) return;
    });
    document.addEventListener('mouseover', e => {
      if (!e.target.closest) return;
      if (e.target.closest('a, button, .tilt')) {
        const now = performance.now();
        if (now - lastHover > 90) { sHover(); lastHover = now; }
      }
    });
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => sWhoosh());
    });
  }

  /* ── Ambient music scheduler (lookahead) ────────── */
  const STEP_DUR = .33; // seconds per 8th note at ~91 BPM
  const LOOKAHEAD = .5;

  function playPad(chord) {
    if (!ctx) return;
    for (let i = 0; i < chord.length; i++) {
      const o = ctx.createOscillator(); o.type = 'triangle';
      o.frequency.value = chord[i];
      o.detune.value = (i - 1) * 7;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 520;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, nextNoteTime);
      g.gain.exponentialRampToValueAtTime(.045, nextNoteTime + 1.2);
      g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + PAD_LEN);
      o.connect(f); f.connect(g); g.connect(musicBus);
      o.start(nextNoteTime); o.stop(nextNoteTime + PAD_LEN + .1);
    }
  }
  const PAD_LEN = 8; // 8 seconds per chord

  function playArp(freq) {
    if (!ctx) return;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = freq;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, nextNoteTime);
    g.gain.exponentialRampToValueAtTime(.028, nextNoteTime + .01);
    g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + .22);
    o.connect(f); f.connect(g); g.connect(musicBus);
    o.start(nextNoteTime); o.stop(nextNoteTime + .3);
  }

  function playBass(freq) {
    if (!ctx) return;
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq / 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, nextNoteTime);
    g.gain.exponentialRampToValueAtTime(.06, nextNoteTime + .03);
    g.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + .9);
    o.connect(g); g.connect(musicBus);
    o.start(nextNoteTime); o.stop(nextNoteTime + 1);
  }

  function scheduleStep() {
    if (!musicOn || !ctx) return;
    while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
      const total = step % 48;
      if (total === 0) playPad(PAD_CHORDS[Math.floor(step / 48) % PAD_CHORDS.length]);
      if (total === 0 || total === 24) playBass(SCALE[0]);
      if (step % 3 === 0) playArp(SCALE[(step * 2) % SCALE.length] * (total % 2 ? 1 : 2));
      if (step % 7 === 0) blip(SCALE[(step / 7 | 0) % SCALE.length] * 4, .25, .012, 'sine', nextNoteTime);
      nextNoteTime += STEP_DUR;
      step++;
    }
  }

  function startMusic() {
    if (!ctx || musicOn) return;
    musicOn = true;
    if (ctx.state === 'suspended') ctx.resume();
    nextNoteTime = ctx.currentTime + .1;
    step = 0;
    schedulerId = setInterval(scheduleStep, 100);
    toggle.classList.add('on');
  }
  function stopMusic() {
    if (schedulerId) { clearInterval(schedulerId); schedulerId = null; }
    musicOn = false;
    toggle.classList.remove('on');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      if (!ctx) { unlock(); }
      if (musicOn) stopMusic(); else startMusic();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && musicOn) stopMusic();
    else if (!document.hidden && musicOn && ctx) { nextNoteTime = ctx.currentTime + .1; schedulerId = setInterval(scheduleStep, 100); }
  });
})();