/* ═══════════════════════════════════════════════
   Scuffing Mad Dancers — Remastered Script
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Year in footer ── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════════════
     MOBILE NAV
     ══════════════════════════════════════════════ */
  var menuToggle = document.getElementById('menu-toggle');
  var navMenu = document.getElementById('nav-menu');

  /* Use overlay element from HTML for mobile menu */
  var overlay = document.getElementById('nav-overlay');

  function openMenu() {
    navMenu.classList.add('open');
    overlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu(); else openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    /* Close on nav link click */
    navMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ══════════════════════════════════════════════
     STICKY HEADER BACKGROUND
     ══════════════════════════════════════════════ */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     BACK TO TOP
     ══════════════════════════════════════════════ */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
      backToTop.hidden = window.scrollY <= 500;
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
     ══════════════════════════════════════════════ */
  var revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length && 'IntersectionObserver' in window) {
    /* 12% visibility triggers reveal; 40px bottom margin triggers slightly before element enters viewport */
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback: show everything immediately */
    revealElements.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ══════════════════════════════════════════════
     PARTNER DROPDOWN
     ══════════════════════════════════════════════ */
  var partnerToggle = document.getElementById('partner-toggle');
  var partnerDropdown = document.getElementById('partner-dropdown');

  if (partnerToggle && partnerDropdown) {
    partnerToggle.addEventListener('click', function () {
      var isOpen = !partnerDropdown.hasAttribute('hidden');
      if (isOpen) {
        partnerDropdown.setAttribute('hidden', '');
        partnerToggle.setAttribute('aria-expanded', 'false');
      } else {
        partnerDropdown.removeAttribute('hidden');
        partnerToggle.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.partner-menu')) {
        partnerDropdown.setAttribute('hidden', '');
        partnerToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        partnerDropdown.setAttribute('hidden', '');
        partnerToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ══════════════════════════════════════════════
     BOOKING MODAL
     ══════════════════════════════════════════════ */
  var modal = document.getElementById('booking-modal');
  var modalTitle = document.getElementById('modal-title');
  var modalPrice = document.getElementById('modal-price');
  var emailBooking = document.getElementById('email-booking');
  var customerName = document.getElementById('customer-name');
  var customerEmail = document.getElementById('customer-email');

  function updateMailto(pkg, price) {
    var subject = 'Scuffing Mad Dancers Booking - ' + pkg;
    var bodyLines = [
      'Hello,',
      '',
      'I would like to book: ' + pkg,
      'Price: $' + price + ' NZD',
      customerName.value ? 'Name: ' + customerName.value : '',
      customerEmail.value ? 'Email: ' + customerEmail.value : '',
      '',
      'I understand payment can be made by bank transfer or on the night.',
      '',
      'Thank you.'
    ].filter(Boolean).join('\n');

    emailBooking.href = 'mailto:Anthonytau4@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyLines);
  }

  document.querySelectorAll('.book-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pkg = btn.dataset.package;
      var price = btn.dataset.price;
      modalTitle.textContent = 'Book ' + pkg;
      modalPrice.textContent = '$' + price + ' NZD';
      updateMailto(pkg, price);
      modal.showModal();
    });
  });

  if (customerName && customerEmail) {
    [customerName, customerEmail].forEach(function (input) {
      input.addEventListener('input', function () {
        var current = (modalTitle.textContent || '').replace(/^Book /, '') || 'Class';
        var priceText = (modalPrice.textContent || '$0.00 NZD').replace(/[^0-9.]/g, '') || '0.00';
        updateMailto(current, priceText);
      });
    });
  }

  var closeModal = document.getElementById('close-modal');
  if (closeModal && modal) {
    closeModal.addEventListener('click', function () { modal.close(); });
  }

  /* ══════════════════════════════════════════════
     COPY BANK DETAILS
     ══════════════════════════════════════════════ */
  var copyBtn = document.getElementById('copy-bank');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var details = 'PETER REYNOLDS\n02-0552-0027244-005';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(details).then(function () {
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy Details'; }, 1500);
        }).catch(function () {
          fallbackCopy(details);
        });
      } else {
        fallbackCopy(details);
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      var cb = document.getElementById('copy-bank');
      if (cb) {
        cb.textContent = 'Copied!';
        setTimeout(function () { cb.textContent = 'Copy Details'; }, 1500);
      }
    } catch (_) {
      /* silent */
    }
    document.body.removeChild(ta);
  }

})();
