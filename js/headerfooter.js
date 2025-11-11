// ===================================================
// HEADER & FOOTER LOADER + RESPONSIVE NAVIGATION HANDLER
// ===================================================

// Run after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {

  // -------- Load HEADER --------
  fetch("header.html")
    .then(res => {
      if (!res.ok) throw new Error("Header not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("header").innerHTML = html;
      console.log("✅ Header loaded successfully");
      initializeHeaderEvents(); // activate menu toggle after header is loaded
    })
    .catch(err => console.error("❌ Header load error:", err));

  // -------- Load FOOTER --------
  fetch("footer.html")
    .then(res => {
      if (!res.ok) throw new Error("Footer not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("footer").innerHTML = html;
      console.log("✅ Footer loaded successfully");
    })
    .catch(err => console.error("❌ Footer load error:", err));

});


// ===================================================
// FUNCTION: Initialize Mobile Menu Toggle
// ===================================================
function initializeHeaderEvents() {
  // Select key elements
  const toggle = document.querySelector(".hf-mobile-toggle");
  const mobileMenu = document.querySelector(".hf-mobile-menu");
  const overlay = document.querySelector(".hf-mobile-overlay");
  const navLinks = document.querySelectorAll(".hf-mobile-nav-link");

  if (!toggle || !mobileMenu || !overlay) {
    console.warn("⚠️ Header elements not found for mobile menu.");
    return;
  }

  // Toggle open/close when hamburger icon clicked
  toggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    toggle.classList.toggle("open"); // optional animation for hamburger
  });

  // Close when overlay clicked
  overlay.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    toggle.classList.remove("open");
  });

  // Close when a mobile nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      overlay.classList.remove("active");
      toggle.classList.remove("open");
    });
  });

  console.log("📱 Mobile menu initialized");
}