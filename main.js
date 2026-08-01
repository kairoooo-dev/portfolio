/* ═══════════════════════════════════════════════════════
   Crowz Portfolio — Effects
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

/* ── Particles ────────────────────────────────────── */
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
  const N = Math.min(35, Math.floor(W * H / 38000));
  const dots = Array.from({ length: N }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
    r: Math.random() * 1.4 + .5
  }));
  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  let frame = 0;
  function tick() {
    frame++;
    requestAnimationFrame(tick);
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(248,113,113,.4)'; ctx.fill();
    }
    if (frame % 2 === 0) {
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(220,38,38,${.1 * (1 - dist / 120)})`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
        const dxm = dots[i].x - mx, dym = dots[i].y - my;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 150) {
          ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(mx, my);
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
    '18+ Free Verified Plugins'
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
