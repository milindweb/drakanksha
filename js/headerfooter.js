// Toggle mobile menu
const mobileToggle = document.querySelector('.hf-mobile-toggle');
const mobileMenu = document.querySelector('.hf-mobile-menu');
const overlay = document.querySelector('.hf-mobile-overlay');

mobileToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  overlay.classList.toggle('active');
});

// Close on overlay click
overlay.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
});

// Close on link click
document.querySelectorAll('.hf-mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
});
