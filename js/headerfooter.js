// ===========================
// Header Mobile Menu Toggle
// ===========================
const mobileToggle = document.querySelector('.hf-mobile-toggle');
const mobileMenu = document.querySelector('.hf-mobile-menu');
const overlay = document.querySelector('.hf-mobile-overlay');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
}

document.querySelectorAll('.hf-mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// ===========================
// Optional Smooth Scroll (for CONTACT, INFO, ABOUT anchors)
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: 'smooth'
      });
    }
  });
});

// ===========================
// Footer Year Auto Update
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.querySelector('.hf-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
