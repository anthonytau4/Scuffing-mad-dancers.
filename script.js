const modal = document.getElementById('booking-modal');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
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
    const pkg = btn.dataset.package;
    const price = btn.dataset.price;
    modalTitle.textContent = `Book ${pkg}`;
    modalPrice.textContent = `$${price} NZD`;
    updateMailto(pkg, price);
    modal.showModal();
  });
});

[customerName, customerEmail].forEach((input) => {
  input.addEventListener('input', () => {
    const current = modalTitle.textContent.replace(/^Book /, '') || 'Class';
    const priceText = (modalPrice.textContent || '$0.00 NZD').replace(/[^0-9.]/g, '') || '0.00';
    updateMailto(current, priceText);
  });
});

document.getElementById('close-modal').addEventListener('click', () => modal.close());

document.getElementById('copy-bank').addEventListener('click', async () => {
  const details = 'ANTHONY TAUTARI\n01-0666-0308263-00';
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

document.getElementById('year').textContent = new Date().getFullYear();


const partnerToggle = document.getElementById('partner-toggle');
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
