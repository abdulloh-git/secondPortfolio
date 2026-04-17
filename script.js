/* ════════════════════════════════════════════════
   script.js — Portfolio Interactivity
   Modules:
     1. CursorModule       — custom cursor + magnetic
     2. NavModule          — sticky nav, burger, active link
     3. RevealModule       — IntersectionObserver scroll reveals
     4. TypewriterModule   — hero role typewriter
     5. SkillBarsModule    — animated skill bars on scroll
     6. ProjectsModule     — filter + sort project cards
     7. ContactFormModule  — Vanilla JS form validation
     8. ParallaxModule     — subtle hero parallax
     9. Init               — bootstrap all modules
════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════
   1. CURSOR MODULE
═══════════════════════════════════════════════ */
const CursorModule = (() => {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('follower') || document.getElementById('cursor-follower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId = null;

  function init() {
    if (!cursor || !follower) return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });

    // Hover effect on interactive elements
    const hoverEls = document.querySelectorAll('a, button, [data-magnetic], input, textarea');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    animateFollower();
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }

  function animateFollower() {
    // Smooth follower with lerp
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   2. NAV MODULE
═══════════════════════════════════════════════ */
const NavModule = (() => {
  const nav       = document.getElementById('nav');
  const burger    = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');
  const navLinks  = document.querySelectorAll('[data-nav-link]');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');
  const sections  = document.querySelectorAll('section[id]');

  function init() {
    // Sticky nav
    window.addEventListener('scroll', onScroll, { passive: true });

    // Burger toggle
    if (burger && mobileNav) {
      burger.addEventListener('click', toggleMobile);
      mobileLinks.forEach(link => link.addEventListener('click', closeMobile));
    }

    // Smooth scroll for all nav links
    [...navLinks, ...mobileLinks].forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Active link on scroll
    const io = new IntersectionObserver(onSectionEnter, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    });
    sections.forEach(s => io.observe(s));
  }

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }

  function toggleMobile() {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  }

  function closeMobile() {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
  }

  function onSectionEnter(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   3. REVEAL MODULE (Scroll animations)
═══════════════════════════════════════════════ */
const RevealModule = (() => {
  const items = document.querySelectorAll('.reveal-up');

  function init() {
    const io = new IntersectionObserver(onReveal, {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    });
    items.forEach(el => io.observe(el));
  }

  function onReveal(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   4. TYPEWRITER MODULE
═══════════════════════════════════════════════ */
const TypewriterModule = (() => {
  const target = document.getElementById('typewriter');
  const roles = [
    'Frontend Developer',
    'React Specialist',
    'UI Engineer',
    'ProWeb Graduate',
    'TypeScript Advocate',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let timeout = null;

  function init() {
    if (!target) return;
    tick();
  }

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      // Typing
      charIdx++;
      target.textContent = current.substring(0, charIdx);
      if (charIdx === current.length) {
        // Pause at end
        timeout = setTimeout(() => { deleting = true; tick(); }, 2200);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      target.textContent = current.substring(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        timeout = setTimeout(tick, 300);
        return;
      }
    }

    const speed = deleting ? 40 : 75;
    timeout = setTimeout(tick, speed);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   5. SKILL BARS MODULE
═══════════════════════════════════════════════ */
const SkillBarsModule = (() => {
  const bars = document.querySelectorAll('.skill-bar');

  function init() {
    const io = new IntersectionObserver(onVisible, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.3,
    });
    bars.forEach(bar => io.observe(bar));
  }

  function onVisible(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.getAttribute('data-level');
        const fill  = bar.querySelector('.skill-bar__fill');
        if (fill && level) {
          // Small delay for stagger
          setTimeout(() => {
            fill.style.width = level + '%';
          }, 100);
        }
      }
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   6. PROJECTS MODULE (Filter + Sort)
═══════════════════════════════════════════════ */
const ProjectsModule = (() => {
  const grid        = document.getElementById('projectGrid');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const sortBtns    = document.querySelectorAll('.sort-btn');
  const emptyState  = document.getElementById('emptyState');

  let currentFilter = 'all';
  let currentSort   = 'newest';

  function init() {
    if (!grid) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        render();
      });
    });

    sortBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sortBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.getAttribute('data-sort');
        render();
      });
    });
  }

  function getCards() {
    return Array.from(grid.querySelectorAll('.project-card'));
  }

  function filterCards(cards) {
    if (currentFilter === 'all') return cards;
    return cards.filter(card => {
      const cats = card.getAttribute('data-category') || '';
      return cats.split(' ').includes(currentFilter);
    });
  }

  function sortCards(cards) {
    return [...cards].sort((a, b) => {
      if (currentSort === 'newest') {
        return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
      }
      if (currentSort === 'oldest') {
        return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
      }
      if (currentSort === 'az') {
        const ta = a.getAttribute('data-title') || '';
        const tb = b.getAttribute('data-title') || '';
        return ta.localeCompare(tb);
      }
      return 0;
    });
  }

  function render() {
    const allCards = getCards();
    const filtered = filterCards(allCards);
    const sorted   = sortCards(filtered);

    // Hide all first
    allCards.forEach(card => {
      card.classList.add('hidden');
      card.style.order = '';
    });

    // Show and order filtered+sorted
    sorted.forEach((card, idx) => {
      card.classList.remove('hidden');
      card.style.order = idx;
      // Animate in
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity .35s ease, transform .35s ease, border-color .25s, transform .25s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, idx * 60);
      });
    });

    // Empty state
    emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   7. CONTACT FORM MODULE (Vanilla JS Validation)
═══════════════════════════════════════════════ */
const ContactFormModule = (() => {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('formSubmitBtn');
  const successMsg = document.getElementById('formSuccess');

  // Validation rules object
  const rules = {
    name: {
      el:    () => document.getElementById('fname'),
      errEl: () => document.getElementById('nameError'),
      validate(val) {
        if (!val.trim()) return 'Name is required.';
        if (val.trim().length < 2) return 'Name must be at least 2 characters.';
        return null;
      },
    },
    email: {
      el:    () => document.getElementById('femail'),
      errEl: () => document.getElementById('emailError'),
      validate(val) {
        if (!val.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email.';
        return null;
      },
    },
    subject: {
      el:    () => document.getElementById('fsubject'),
      errEl: () => document.getElementById('subjectError'),
      validate(val) {
        if (!val.trim()) return 'Subject is required.';
        if (val.trim().length < 3) return 'Subject must be at least 3 characters.';
        return null;
      },
    },
    message: {
      el:    () => document.getElementById('fmessage'),
      errEl: () => document.getElementById('messageError'),
      validate(val) {
        if (!val.trim()) return 'Message is required.';
        if (val.trim().length < 20) return 'Message must be at least 20 characters.';
        return null;
      },
    },
  };

  function init() {
    if (!form) return;

    // Live validation on blur
    Object.values(rules).forEach(rule => {
      const el = rule.el();
      if (el) {
        el.addEventListener('blur', () => validateField(rule));
        el.addEventListener('input', () => {
          if (el.classList.contains('error')) validateField(rule);
        });
      }
    });

    form.addEventListener('submit', onSubmit);
  }

  function validateField(rule) {
    const el  = rule.el();
    const err = rule.errEl();
    if (!el || !err) return null;

    const msg = rule.validate(el.value);
    el.classList.toggle('error', !!msg);
    err.textContent = msg || '';
    return msg;
  }

  function validateAll() {
    const errors = Object.values(rules).map(validateField);
    return errors.every(e => e === null);
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!validateAll()) return;

    // Simulate async send
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    btnText.style.display    = 'none';
    btnSpinner.style.display = 'inline';
    submitBtn.disabled       = true;

    setTimeout(() => {
      btnText.style.display    = 'inline';
      btnSpinner.style.display = 'none';
      submitBtn.disabled       = false;

      form.reset();
      successMsg.style.display = 'block';

      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
    }, 1600);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   8. PARALLAX MODULE (Hero subtle scroll)
═══════════════════════════════════════════════ */
const ParallaxModule = (() => {
  const grid = document.querySelector('.hero__bg-grid');
  const badges = document.querySelectorAll('.hero__badge');

  let ticking = false;

  function init() {
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    const y = window.scrollY;
    if (grid) grid.style.transform = `translateY(${y * 0.2}px)`;
    badges.forEach((b, i) => {
      b.style.transform = `translateY(${y * (0.08 + i * 0.04)}px)`;
    });
    ticking = false;
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   9. MAGNETIC BUTTONS
═══════════════════════════════════════════════ */
const MagneticModule = (() => {
  function init() {
    if (window.matchMedia('(hover: none)').matches) return;
    const magnets = document.querySelectorAll('[data-magnetic]');
    magnets.forEach(el => {
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  function onMove(e) {
    const el   = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.28;
    const dy   = (e.clientY - cy) * 0.28;
    el.style.transition = 'transform 0.15s ease';
    el.style.transform  = `translate(${dx}px, ${dy}px)`;
  }

  function onLeave(e) {
    const el = e.currentTarget;
    el.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
    el.style.transform  = 'translate(0, 0)';
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   10. COUNTER ANIMATION (stats in About)
═══════════════════════════════════════════════ */
const CounterModule = (() => {
  const stats = document.querySelectorAll('.stat__num');

  function init() {
    const io = new IntersectionObserver(onVisible, { threshold: 0.5 });
    stats.forEach(s => io.observe(s));
  }

  function onVisible(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const end = parseInt(el.textContent, 10);
        animateCount(el, 0, end, 1200);
        observer.unobserve(el);
      }
    });
  }

  function animateCount(el, start, end, duration) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════
   INIT — Bootstrap everything on DOM ready
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  CursorModule.init();
  NavModule.init();
  RevealModule.init();
  TypewriterModule.init();
  SkillBarsModule.init();
  ProjectsModule.init();
  ContactFormModule.init();
  ParallaxModule.init();
  MagneticModule.init();
  CounterModule.init();
});
