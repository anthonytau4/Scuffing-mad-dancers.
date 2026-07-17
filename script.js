/* ═══════════════════════════════════════════════
   Scuffing Mad Dancers — Full Remaster
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Year in footer ── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════════════
     MOBILE NAV
     ══════════════════════════════════════════════ */
  var menuToggle = document.getElementById('menu-toggle');
  var navMenu = document.getElementById('nav-menu');
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

  if (menuToggle && navMenu && overlay) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu(); else openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    navMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  }

  /* ══════════════════════════════════════════════
     HEADER STATE + SCROLL PROGRESS + BACK TO TOP
     ══════════════════════════════════════════════ */
  var header = document.querySelector('.site-header');
  var progress = document.getElementById('scroll-progress');
  var backToTop = document.getElementById('back-to-top');
  var scrollTicking = false;

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ══════════════════════════════════════════════
     ACTIVE NAV LINK
     ══════════════════════════════════════════════ */
  var navLinks = navMenu ? Array.prototype.slice.call(navMenu.querySelectorAll('a[href^="#"]')) : [];
  var watched = navLinks
    .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if (watched.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    watched.forEach(function (sec) { sectionObserver.observe(sec); });
  }

  /* ══════════════════════════════════════════════
     SCROLL REVEAL (with stagger)
     ══════════════════════════════════════════════ */
  var revealElements = document.querySelectorAll('[data-reveal]');

  document.querySelectorAll('[data-reveal-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--reveal-delay', (i * 0.09) + 's');
    });
    /* The group itself reveals instantly; children carry the animation */
    group.style.setProperty('--reveal-delay', '0s');
  });
  revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length && 'IntersectionObserver' in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ══════════════════════════════════════════════
     PARTNER DROPDOWN
     ══════════════════════════════════════════════ */
  var partnerToggle = document.getElementById('partner-toggle');
  var partnerDropdown = document.getElementById('partner-dropdown');

  function closeDropdown() {
    partnerDropdown.setAttribute('hidden', '');
    partnerToggle.setAttribute('aria-expanded', 'false');
  }

  if (partnerToggle && partnerDropdown) {
    partnerToggle.addEventListener('click', function () {
      if (partnerDropdown.hasAttribute('hidden')) {
        partnerDropdown.removeAttribute('hidden');
        partnerToggle.setAttribute('aria-expanded', 'true');
      } else {
        closeDropdown();
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.partner-menu')) closeDropdown();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
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

  var closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', function () { modal.close(); });
    /* Click on the backdrop closes the dialog */
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.close();
    });
  }

  /* ══════════════════════════════════════════════
     COPY BANK DETAILS
     ══════════════════════════════════════════════ */
  var copyBtn = document.getElementById('copy-bank');
  var BANK_DETAILS = 'PETER REYNOLDS\n02-0552-0027244-005';

  function flashCopied() {
    copyBtn.textContent = 'Copied!';
    setTimeout(function () { copyBtn.textContent = 'Copy Details'; }, 1500);
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
      flashCopied();
    } catch (_) {
      /* silent */
    }
    document.body.removeChild(ta);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(BANK_DETAILS).then(flashCopied).catch(function () {
          fallbackCopy(BANK_DETAILS);
        });
      } else {
        fallbackCopy(BANK_DETAILS);
      }
    });
  }

  /* ══════════════════════════════════════════════
     GALLERY LIGHTBOX
     ══════════════════════════════════════════════ */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCounter = document.getElementById('lightbox-counter');
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item[data-lightbox]'));
  var currentIndex = 0;

  function showPhoto(index) {
    var count = galleryItems.length;
    currentIndex = ((index % count) + count) % count;
    var item = galleryItems[currentIndex];
    var thumb = item.querySelector('img');
    lightboxImg.src = item.dataset.lightbox;
    lightboxImg.alt = thumb ? thumb.alt : '';
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + count;
  }

  if (lightbox && lightboxImg && galleryItems.length) {
    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () {
        showPhoto(i);
        lightbox.showModal();
      });
    });

    document.getElementById('lightbox-close').addEventListener('click', function () { lightbox.close(); });
    document.getElementById('lightbox-prev').addEventListener('click', function () { showPhoto(currentIndex - 1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { showPhoto(currentIndex + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
      if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
    });

    lightbox.addEventListener('close', function () {
      lightboxImg.src = '';
    });
  }

})();
