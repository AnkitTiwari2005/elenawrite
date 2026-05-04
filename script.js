/* E. TRENCHBURG WRITES — script.js */
(function () {
  'use strict';

  /* ── 1. CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, .svc-card-new, .member-card, .stat-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
  });

  /* ── 2. SCROLL PROGRESS ── */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });

  /* ── 3. NAV SCROLL + ACTIVE LINKS ── */
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id'); });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }, { passive: true });

  /* ── 4. HAMBURGER ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── 5. NOISE CANVAS ── */
  const canvas = document.getElementById('noiseCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    let lastNoise = 0;
    function drawNoise() {
      const img = ctx.createImageData(canvas.width, canvas.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255 | 0;
        d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    (function noiseLoop(ts) {
      if (ts - lastNoise > 80) { drawNoise(); lastNoise = ts; }
      requestAnimationFrame(noiseLoop);
    })(0);
  }

  /* ── 6. HERO PARALLAX ── */
  const heroBg = document.querySelector('.hero-bg-text');
  const heroInner = document.querySelector('.hero-inner');
  const heroSection = document.getElementById('hero');
  if (heroSection && heroBg) {
    heroSection.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      heroBg.style.transform = `translate(calc(-50% + ${dx * 20}px), calc(-50% + ${dy * 14}px))`;
      if (heroInner) heroInner.style.transform = `translate(${dx * -5}px, ${dy * -3}px)`;
    });
  }

  /* ── 7. FADE-UP OBSERVER ── */
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.counter').forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  /* ── 8. COUNTER ── */
  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = +el.dataset.target;
    const start = performance.now();
    const duration = 2000;
    (function step(ts) {
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ── 9. MAGNETIC EFFECT ── */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.35;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ── 10. CARD TILT ── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── 11. ADV BLOCK STAGGER ── */
  const advObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = +(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay * 130);
        advObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.adv-block').forEach(b => advObserver.observe(b));

  /* ── 12. SPLIT HEADING CHAR REVEAL ── */
  document.querySelectorAll('.split-heading').forEach(heading => {
    const html = heading.innerHTML;
    const parts = html.split(/(<br\s*\/?>)/gi);
    let result = '', delay = 0;
    parts.forEach(part => {
      if (/^<br/i.test(part)) { result += part; }
      else {
        Array.from(part).forEach(char => {
          if (char === ' ') { result += ' '; }
          else {
            result += `<span class="char" style="display:inline-block;opacity:0;transform:translateY(18px);transition:opacity .5s ${delay.toFixed(2)}s,transform .5s ${delay.toFixed(2)}s">${char}</span>`;
            delay += 0.022;
          }
        });
      }
    });
    heading.innerHTML = result;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.char').forEach(ch => { ch.style.opacity = '1'; ch.style.transform = 'translateY(0)'; });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(heading);
  });

  /* ── 13. STAT CARD SHIMMER ── */
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(200,169,110,0.07), #141414 60%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  /* ── 14. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── 15. GHOST NUMBER PARALLAX ── */
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.ghost-number').forEach(g => {
      const rect = g.parentElement.getBoundingClientRect();
      const ratio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      g.style.transform = `translateY(${ratio * -70}px)`;
    });
  }, { passive: true });

  /* ── 16. PROCESS STEP HIGHLIGHT ── */
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.process-step').forEach(step => {
      const rect = step.getBoundingClientRect();
      const dot = step.querySelector('.process-dot');
      if (dot && rect.top < window.innerHeight * 0.72) {
        dot.style.boxShadow = '0 0 0 5px rgba(200,169,110,0.2)';
        dot.style.background = 'var(--gold-light)';
      } else if (dot) {
        dot.style.boxShadow = '';
        dot.style.background = '';
      }
    });
  }, { passive: true });

  /* ── 17. TESTIMONIAL CARD TILT ── */
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── 18. INITIAL ABOVE-FOLD TRIGGER ── */
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    });
  }, 200);

  /* ── 19. RESIZE ── */
  window.addEventListener('resize', () => {}, { passive: true });

})();
