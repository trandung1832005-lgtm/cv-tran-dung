/* ═══════════════════════════════════
   AGI ASTRA — script.js
   Neural Network · Glitch · 3D Tilt
   Cursor · Reveal · Typewriter
   ═══════════════════════════════════ */

'use strict';

// ─────────────────────────────────────
//  PRELOADER
// ─────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
  }, 1800);
});

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────
  //  NEURAL NETWORK CANVAS
  // ─────────────────────────────────────
  const canvas = document.getElementById('neural-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  // Particles
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST   = 160;
  const MOUSE_DIST     = 120;

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.8 + 0.5;
      const colors = ['#00f5ff', '#7b2fff', '#ff006e', '#00ff88'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.8;
        this.vx += (dx / dist) * force * 0.4;
        this.vy += (dy / dist) * force * 0.4;
      }
      // Damping
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.vx = Math.max(-1.5, Math.min(1.5, this.vx));
      this.vy = Math.max(-1.5, Math.min(1.5, this.vy));
      this.x += this.vx;
      this.y += this.vy;
      // Wrap
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a  = particles[i];
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.35;
          const grad  = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.color);
          grad.addColorStop(1, b.color);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = alpha;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function drawMouseConnections() {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_DIST * 1.5) {
        const alpha = (1 - d / (MOUSE_DIST * 1.5)) * 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = '#00f5ff';
        ctx.globalAlpha = alpha;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
  }

  function raf() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    drawMouseConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(raf);
  }
  raf();

  // ─────────────────────────────────────
  //  CUSTOM CURSOR
  // ─────────────────────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring) {
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
    });

    // Ring lags behind (smooth)
    (function animRing() {
      rx += (mouse.x - rx) * 0.12;
      ry += (mouse.y - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    // Hover effect
    document.querySelectorAll('a, button, .proj-card, .skill-bar-card, .stat-chip')
      .forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
  }

  // ─────────────────────────────────────
  //  NAVBAR
  // ─────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const btt    = document.getElementById('btt');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 60
      ? 'rgba(2,0,16,0.97)' : 'rgba(2,0,16,0.85)';
    btt && (window.scrollY > 400 ? btt.classList.add('show') : btt.classList.remove('show'));
    highlightNav();
  });

  btt && btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  toggle && toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', toggle.classList.contains('open'));
  });
  links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  }));

  function highlightNav() {
    const secs = document.querySelectorAll('section[id]');
    let cur = '';
    secs.forEach(s => {
      const t = s.getBoundingClientRect().top;
      if (t <= 80) cur = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${cur}`);
    });
  }

  // ─────────────────────────────────────
  //  TYPEWRITER
  // ─────────────────────────────────────
  const typed = document.getElementById('typed-text');
  if (typed) {
    const phrases = [
      'AI Enthusiast 🤖',
      'Software Developer 💻',
      'IT Student 🎓',
      'Problem Solver 🧩',
      'Future Engineer ✨'
    ];
    let pi = 0, ci = 0, del = false;

    function typeLoop() {
      const cur = phrases[pi];
      if (!del) {
        typed.textContent = cur.slice(0, ci + 1);
        ci++;
        if (ci === cur.length) { del = true; setTimeout(typeLoop, 1800); return; }
      } else {
        typed.textContent = cur.slice(0, ci - 1);
        ci--;
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(typeLoop, del ? 55 : 90);
    }
    typeLoop();
  }

  // ─────────────────────────────────────
  //  COUNTER ANIMATION
  // ─────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count);
      const sfx = el.dataset.suffix || '';
      let n = 0;
      const step = Math.ceil(end / 45);
      const t = setInterval(() => {
        n = Math.min(n + step, end);
        el.textContent = n + sfx;
        if (n >= end) clearInterval(t);
      }, 30);
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));

  // ─────────────────────────────────────
  //  SCROLL REVEAL
  // ─────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const rObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      const delay = (e.target.dataset.d || 0);
      setTimeout(() => e.target.classList.add('visible'), delay * 1);
      rObs.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  reveals.forEach((el, i) => {
    el.dataset.d = i % 6 * 80;
    rObs.observe(el);
  });

  // ─────────────────────────────────────
  //  SKILL BAR REVEAL
  // ─────────────────────────────────────
  const bars = document.querySelectorAll('.bar-fill');
  const bObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill = e.target;
      setTimeout(() => { fill.style.width = fill.dataset.w; }, 200);
      bObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => bObs.observe(b));

  // ─────────────────────────────────────
  //  3D TILT ON PROJECT CARDS
  // ─────────────────────────────────────
  document.querySelectorAll('.proj-card').forEach(card => {
    const glow = card.querySelector('.proj-glow');

    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = e.clientX - r.left;
      const y   = e.clientY - r.top;
      const cx  = r.width  / 2;
      const cy  = r.height / 2;
      const rx  = ((y - cy) / cy) * -12;
      const ry  = ((x - cx) / cx) *  12;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      if (glow) {
        glow.style.left = x + 'px';
        glow.style.top  = y + 'px';
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─────────────────────────────────────
  //  MAGNETIC BUTTONS
  // ─────────────────────────────────────
  document.querySelectorAll('.btn-astra').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ─────────────────────────────────────
  //  GLITCH TRIGGER (random intervals)
  // ─────────────────────────────────────
  const glitchLine = document.querySelector('.glitch-name .g-line.glitch');
  if (glitchLine) {
    function triggerGlitch() {
      glitchLine.classList.remove('glitch');
      void glitchLine.offsetWidth; // reflow
      glitchLine.classList.add('glitch');
      setTimeout(triggerGlitch, 3000 + Math.random() * 5000);
    }
    setTimeout(triggerGlitch, 2000);
  }

  // ─────────────────────────────────────
  //  CONTACT FORM
  // ─────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-astra');
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ ĐÃ GỬI';
      btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4aa)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  // ─────────────────────────────────────
  //  AURORA TITLE gradient animation
  //  (cycle hue on section headings)
  // ─────────────────────────────────────
  let hue = 0;
  function animHue() {
    hue = (hue + 0.3) % 360;
    document.documentElement.style.setProperty('--hue-shift', hue);
    requestAnimationFrame(animHue);
  }
  animHue();

});
