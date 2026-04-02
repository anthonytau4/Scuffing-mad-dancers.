'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------------------
     Reduced-motion preference
  ------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     1. EXISTING FUNCTIONALITY — Booking Modal
  ======================================================= */
  const modal        = document.getElementById('booking-modal');
  const modalTitle   = document.getElementById('modal-title');
  const modalPrice   = document.getElementById('modal-price');
  const emailBooking = document.getElementById('email-booking');
  const customerName = document.getElementById('customer-name');
  const customerEmail = document.getElementById('customer-email');

  function updateMailto(pkg, price) {
    const subject = `Scuffing Mad Dancers Booking - ${pkg}`;
    const bodyLines = [
      'Hello,',
      '',
      `I would like to book: ${pkg}`,
      `Price: $${price} NZD`,
      customerName.value ? `Name: ${customerName.value}` : '',
      customerEmail.value ? `Email: ${customerEmail.value}` : '',
      '',
      'I understand payment can be made by bank transfer or on the night.',
      '',
      'Thank you.'
    ].filter(Boolean).join('\n');

    emailBooking.href = `mailto:Anthonytau4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
  }

  document.querySelectorAll('.book-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pkg   = btn.dataset.package;
      const price = btn.dataset.price;
      modalTitle.textContent = `Book ${pkg}`;
      modalPrice.textContent = `$${price} NZD`;
      updateMailto(pkg, price);
      modal.showModal();
    });
  });

  [customerName, customerEmail].forEach((input) => {
    input.addEventListener('input', () => {
      const current   = modalTitle.textContent.replace(/^Book /, '') || 'Class';
      const priceText = (modalPrice.textContent || '$0.00 NZD').replace(/[^0-9.]/g, '') || '0.00';
      updateMailto(current, priceText);
    });
  });

  document.getElementById('close-modal').addEventListener('click', () => modal.close());

  /* =======================================================
     2. EXISTING FUNCTIONALITY — Copy Bank Details
  ======================================================= */
  document.getElementById('copy-bank').addEventListener('click', async () => {
    const details = 'PETER REYNOLDS\n02-0552-0027244-005';
    try {
      await navigator.clipboard.writeText(details);
      document.getElementById('copy-bank').textContent = 'Copied';
      setTimeout(() => {
        document.getElementById('copy-bank').textContent = 'Copy bank details';
      }, 1200);
    } catch {
      alert('Could not copy bank details just now.');
    }
  });

  /* =======================================================
     3. EXISTING FUNCTIONALITY — Year Display
  ======================================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* =======================================================
     4. EXISTING FUNCTIONALITY — Partner Dropdown Toggle
  ======================================================= */
  const partnerToggle   = document.getElementById('partner-toggle');
  const partnerDropdown = document.getElementById('partner-dropdown');

  if (partnerToggle && partnerDropdown) {
    partnerToggle.addEventListener('click', () => {
      const isOpen = !partnerDropdown.hasAttribute('hidden');
      if (isOpen) {
        partnerDropdown.setAttribute('hidden', '');
        partnerToggle.setAttribute('aria-expanded', 'false');
      } else {
        partnerDropdown.removeAttribute('hidden');
        partnerToggle.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.partner-menu')) {
        partnerDropdown.setAttribute('hidden', '');
        partnerToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        partnerDropdown.setAttribute('hidden', '');
        partnerToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =======================================================
     5. SCROLL REVEAL — IntersectionObserver
  ======================================================= */
  const GRID_SELECTORS = '.feature-grid, .testimonial-grid, .pricing-grid, .schedule-grid, .contact-grid';

  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const parentGrid = el.parentElement?.matches(GRID_SELECTORS) ? el.parentElement : null;

      if (parentGrid) {
        return;
      }

      if (el.matches(GRID_SELECTORS)) {
        observeGridChildren(el);
        return;
      }

      revealObserver.observe(el);
    });

    document.querySelectorAll(GRID_SELECTORS).forEach((grid) => {
      const children = grid.querySelectorAll('[data-reveal]');
      if (children.length) {
        observeGridChildren(grid);
      }
    });
  }

  function observeGridChildren(grid) {
    const children = Array.from(grid.children).filter((c) => c.hasAttribute('data-reveal'));
    if (!children.length) return;

    const gridObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = children.indexOf(entry.target);
            const delay = idx * 120;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    children.forEach((child) => gridObserver.observe(child));
  }

  initScrollReveal();

  /* =======================================================
     6. NAV SCROLL EFFECT
  ======================================================= */
  const nav = document.querySelector('.nav');

  /* =======================================================
     7. SCROLL INDICATOR FADE
  ======================================================= */
  const scrollIndicator = document.querySelector('.scroll-indicator');

  /* =======================================================
     8. PARALLAX HERO BACKGROUND
  ======================================================= */
  const heroBg = document.querySelector('.hero-bg');

  /* -------------------------------------------------------
     Unified passive scroll handler (perf-friendly)
  ------------------------------------------------------- */
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      if (nav) {
        if (scrollY > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }

      if (scrollIndicator) {
        const opacity = Math.max(0, 1 - scrollY / 400);
        scrollIndicator.style.opacity = opacity;
        scrollIndicator.style.pointerEvents = opacity === 0 ? 'none' : '';
      }

      if (heroBg && !prefersReducedMotion) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* =======================================================
     9. SMOOTH BACK-TO-TOP
  ======================================================= */
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* =======================================================
     10. ANIMATED COUNTER EFFECT FOR MINI-STATS
  ======================================================= */
  function initCounters() {
    const miniStats = document.querySelector('.mini-stats');
    if (!miniStats) return;

    if (prefersReducedMotion) return;

    const statItems = miniStats.querySelectorAll('strong');
    let animated = false;

    function parseStatText(text) {
      const match = text.match(/^(\d+(?:\.\d+)?)\s*(.*)/);
      if (!match) return null;
      return {
        value:  parseFloat(match[1]),
        suffix: match[2] ? ' ' + match[2] : '',
        isFloat: match[1].includes('.')
      };
    }

    function animateValue(el, parsed, duration) {
      const start    = performance.now();
      const endVal   = parsed.value;
      const decimals = parsed.isFloat ? 1 : 0;

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * endVal;

        el.textContent = current.toFixed(decimals) + parsed.suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statItems.forEach((el) => {
              const parsed = parseStatText(el.textContent.trim());
              if (parsed) {
                animateValue(el, parsed, 1200);
              }
            });
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(miniStats);
  }

  initCounters();
});
