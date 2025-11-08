// ===================================================
// Dynamically load HEADER and FOOTER
// ===================================================
document.addEventListener("DOMContentLoaded", () => {

  // Load Header
  fetch("header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
      initHeaderFunctions(); // enable menu toggle after header loads
    })
    .catch(err => console.error("Header load failed:", err));

  // Load Footer
  fetch("footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;
    })
    .catch(err => console.error("Footer load failed:", err));
});


// ===================================================
// Header Menu Toggle for Mobile
// ===================================================
function initHeaderFunctions() {
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
}
