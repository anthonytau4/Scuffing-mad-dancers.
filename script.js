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

    emailBooking.href = 'mailto:Scuffingmaddance@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyLines);
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


  /* ══════════════════════════════════════════════
     PARTY MODE + TOUCH SPARKS
     ══════════════════════════════════════════════ */
  document.documentElement.classList.add('js');

  var glow = document.createElement('div');
  glow.className = 'interaction-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(glow, document.body.firstChild);

  function gentlePulse(duration) {
    if (navigator.vibrate) navigator.vibrate(duration || 10);
  }

  function makeSpark(x, y, dx, dy) {
    if (reducedMotion) return;
    var spark = document.createElement('span');
    spark.className = 'party-spark';
    spark.textContent = Math.random() > .45 ? '✦' : '·';
    spark.style.setProperty('--spark-x', x + 'px');
    spark.style.setProperty('--spark-y', y + 'px');
    spark.style.setProperty('--spark-dx', dx + 'px');
    spark.style.setProperty('--spark-dy', dy + 'px');
    document.body.appendChild(spark);
    window.setTimeout(function () { spark.remove(); }, 760);
  }

  function sparkBurst(x, y, amount) {
    for (var i = 0; i < amount; i += 1) {
      var angle = (Math.PI * 2 * i / amount) + Math.random() * .3;
      var distance = 28 + Math.random() * 54;
      makeSpark(x, y, Math.cos(angle) * distance, Math.sin(angle) * distance);
    }
  }

  window.addEventListener('pointermove', function (event) {
    document.body.style.setProperty('--pointer-x', event.clientX + 'px');
    document.body.style.setProperty('--pointer-y', event.clientY + 'px');
  }, { passive: true });

  document.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest('input, textarea, dialog')) return;
    makeSpark(event.clientX, event.clientY, (Math.random() - .5) * 36, -28 - Math.random() * 22);
  }, { passive: true });

  var partyToggle = document.getElementById('party-toggle');
  var partyLabel = document.getElementById('party-toggle-label');
  var partyOn = false;

  function applyPartyMode(on, celebrate) {
    partyOn = on;
    document.body.classList.toggle('party-mode', partyOn);
    if (partyToggle) partyToggle.setAttribute('aria-pressed', String(partyOn));
    if (partyLabel) partyLabel.textContent = partyOn ? 'Party mode on' : 'Party mode';
    try { localStorage.setItem('smd-party-mode', partyOn ? 'on' : 'off'); } catch (_) {}
    if (partyOn && celebrate && partyToggle) {
      var rect = partyToggle.getBoundingClientRect();
      sparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
      gentlePulse([12, 35, 12]);
    }
  }

  try {
    applyPartyMode(localStorage.getItem('smd-party-mode') === 'on', false);
  } catch (_) {
    applyPartyMode(false, false);
  }

  if (partyToggle) {
    partyToggle.addEventListener('click', function () {
      applyPartyMode(!partyOn, true);
    });
  }

  /* ══════════════════════════════════════════════
     LOGO DANCE
     ══════════════════════════════════════════════ */
  var logoDanceTrigger = document.getElementById('logo-dance-trigger');
  var heroLogo = document.querySelector('.hero-logo');
  var logoDanceTimer;

  if (logoDanceTrigger && heroLogo) {
    logoDanceTrigger.addEventListener('click', function () {
      window.clearTimeout(logoDanceTimer);
      heroLogo.classList.remove('is-dancing');
      void heroLogo.offsetWidth;
      heroLogo.classList.add('is-dancing');
      var rect = heroLogo.getBoundingClientRect();
      sparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
      gentlePulse(16);
      logoDanceTimer = window.setTimeout(function () {
        heroLogo.classList.remove('is-dancing');
      }, 1100);
    });
  }

  /* ══════════════════════════════════════════════
     CLASS MATCHER — PUBLISHED INFORMATION ONLY
     ══════════════════════════════════════════════ */
  var finderOptions = Array.prototype.slice.call(document.querySelectorAll('.finder-option'));
  var finderResult = document.getElementById('finder-result');
  var finderKicker = document.getElementById('finder-kicker');
  var finderTitle = document.getElementById('finder-title');
  var finderCopy = document.getElementById('finder-copy');
  var finderFacts = document.getElementById('finder-facts');
  var finderData = {
    new: {
      kicker: 'Published beginner class',
      title: 'Friday Beginners',
      copy: 'The beginner class runs every Friday from 6:30 PM–7:30 PM at Tawa School Hall.',
      facts: ['Friday', '6:30 PM–7:30 PM', 'Beginners']
    },
    all: {
      kicker: 'Published improver class',
      title: 'Stay on for Improvers',
      copy: 'Stay on after beginners every Friday from 7:30 PM–8:00 PM at Tawa School Hall.',
      facts: ['Friday', '7:30 PM–8:00 PM', 'Improvers']
    },
    both: {
      kicker: 'The full published Friday session',
      title: 'Beginners + Improvers',
      copy: 'Beginners run 6:30 PM–7:30 PM, then stay on for improvers from 7:30 PM–8:00 PM. The Friday session is $8.',
      facts: ['Every Friday', '6:30 PM–8:00 PM', '$8']
    }
  };

  finderOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      var data = finderData[option.dataset.match];
      if (!data || !finderResult) return;

      finderOptions.forEach(function (button) {
        var selected = button === option;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });

      finderResult.classList.remove('is-changing');
      void finderResult.offsetWidth;
      finderResult.classList.add('is-changing');
      finderKicker.textContent = data.kicker;
      finderTitle.textContent = data.title;
      finderCopy.textContent = data.copy;
      finderFacts.textContent = '';
      data.facts.forEach(function (fact) {
        var chip = document.createElement('span');
        chip.textContent = fact;
        finderFacts.appendChild(chip);
      });
      gentlePulse(8);
      window.setTimeout(function () { finderResult.classList.remove('is-changing'); }, 720);
    });
  });

  /* ══════════════════════════════════════════════
     TAP-THE-BEAT EIGHT COUNT
     ══════════════════════════════════════════════ */
  var beatPad = document.getElementById('beat-pad');
  var beatReset = document.getElementById('beat-reset');
  var beatStatus = document.getElementById('beat-status');
  var beatDots = Array.prototype.slice.call(document.querySelectorAll('#beat-dots span'));
  var beatCount = 0;
  var beatResetTimer;
  var audioContext;

  function playTinyBeat(isDownbeat) {
    var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return;
    if (!audioContext) audioContext = new AudioContextCtor();
    if (audioContext.state === 'suspended') audioContext.resume();

    var now = audioContext.currentTime;
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(isDownbeat ? 125 : 180, now);
    oscillator.frequency.exponentialRampToValueAtTime(isDownbeat ? 58 : 92, now + .085);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(isDownbeat ? .16 : .09, now + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .11);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + .12);
  }

  function resetBeatCount() {
    window.clearTimeout(beatResetTimer);
    beatCount = 0;
    beatDots.forEach(function (dot) {
      dot.classList.remove('active', 'downbeat');
    });
    if (beatStatus) beatStatus.textContent = '0 of 8 beats';
  }

  function hitBeat() {
    if (!beatPad || !beatStatus) return;
    window.clearTimeout(beatResetTimer);
    if (beatCount >= 8) resetBeatCount();

    beatCount += 1;
    var dot = beatDots[beatCount - 1];
    var downbeat = beatCount === 1 || beatCount === 5;
    if (dot) dot.classList.add('active');
    if (dot && downbeat) dot.classList.add('downbeat');

    beatPad.classList.remove('hit');
    void beatPad.offsetWidth;
    beatPad.classList.add('hit');
    window.setTimeout(function () { beatPad.classList.remove('hit'); }, 150);

    playTinyBeat(downbeat);
    gentlePulse(downbeat ? 18 : 9);

    if (beatCount === 8) {
      beatStatus.textContent = 'Full 8-count! Tap again to restart.';
      var rect = beatPad.getBoundingClientRect();
      sparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
      beatResetTimer = window.setTimeout(resetBeatCount, 2600);
    } else {
      beatStatus.textContent = beatCount + ' of 8 beats';
    }
  }

  if (beatPad) beatPad.addEventListener('click', hitBeat);
  if (beatReset) beatReset.addEventListener('click', resetBeatCount);

  /* ══════════════════════════════════════════════
     DESKTOP TILT + UNIVERSAL BUTTON RIPPLES
     ══════════════════════════════════════════════ */
  var tiltCards = Array.prototype.slice.call(document.querySelectorAll(
    '.hero-visual, .feature-card, .class-card, .venue-card, .step-card, .price-card, .partner-card, .contact-card'
  ));

  tiltCards.forEach(function (card) { card.classList.add('interactive-card'); });

  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;
        var rotateY = (x - .5) * 4.5;
        var rotateX = (.5 - y) * 4.5;
        card.style.setProperty('--card-x', (x * 100) + '%');
        card.style.setProperty('--card-y', (y * 100) + '%');
        card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-3px)';
      });

      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  document.querySelectorAll('.btn, .party-toggle, .logo-dance-trigger, .finder-option, .beat-reset').forEach(function (button) {
    button.addEventListener('pointerdown', function (event) {
      var rect = button.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'tap-ripple';
      ripple.style.left = (event.clientX - rect.left) + 'px';
      ripple.style.top = (event.clientY - rect.top) + 'px';
      button.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 660);
    });
  });


})();
