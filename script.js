// =============================================
//  CV Script - Trần Thị Thùy Dung
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.style.background = 'rgba(15, 15, 26, 0.96)';
    } else {
      navbar.style.background = 'rgba(15, 15, 26, 0.82)';
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    updateActiveNav();
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ---- Active nav link on scroll ----
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(sec => {
      const top    = sec.getBoundingClientRect().top;
      const height = sec.offsetHeight;
      if (top <= 100 && top + height > 100) {
        current = sec.id;
      }
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  // ---- Scroll-reveal animation ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // staggered delay for children
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0) * 1);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el, i) => {
    el.dataset.delay = i * 60;
    revealObserver.observe(el);
  });

  // ---- Skill progress bars ----
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill   = entry.target.querySelector('.progress-fill');
        const target = fill?.dataset.width;
        if (fill && target) {
          setTimeout(() => { fill.style.width = target; }, 200);
        }
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => {
    progressObserver.observe(card);
  });

  // ---- Typewriter for hero subtitle ----
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const words = ['AI Enthusiast', 'Software Developer', 'IT Student', 'Problem Solver'];
    let wordIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = words[wordIdx];
      if (!deleting) {
        typeTarget.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        typeTarget.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          wordIdx  = (wordIdx + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 95);
    }
    type();
  }

  // ---- Counter animation ----
  const counters = document.querySelectorAll('.count-up');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 35);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ---- Contact form ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = contactForm.querySelector('.btn-primary');
      const orig = btn.textContent;
      btn.textContent = '✅ Đã gửi!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        contactForm.reset();
      }, 2800);
    });
  }

});

