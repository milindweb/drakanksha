// ===================================================
// HEADER & FOOTER LOADER + NAVIGATION CONTROLLER
// ===================================================

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
      initializeHeaderEvents(); // Setup navigation logic after header loads
      highlightActiveNav();     // Highlight current active page
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
// SECTION 1: HEADER NAVIGATION HANDLER
// ===================================================
function initializeHeaderEvents() {
  // Note: In new design, links are always visible horizontally
  // No mobile menu toggle is required now.
  // But we keep structure ready if needed for future expansion.

  const navLinks = document.querySelectorAll(".hf-nav-link");

  if (!navLinks.length) {
    console.warn("⚠️ No navigation links found inside header.");
    return;
  }

  // Smooth scroll or close future mobile overlay (if exists)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      // Optional: Scroll to top when navigation clicked
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  console.log("🧭 Header navigation initialized successfully");
}


// ===================================================
// SECTION 2: ACTIVE PAGE HIGHLIGHTER
// ===================================================
function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".hf-nav-link");

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  console.log("🔹 Active page highlighted:", currentPage);
}


// ===================================================
// SECTION 3: MOBILE MENU HANDLER (optional legacy support)
// ===================================================
// ⚠️ This remains here for backward compatibility.
// Your current header design shows all links horizontally on all devices.
// If you decide to add a hamburger menu later, this section will handle it.
function initializeMobileMenu() {
  const toggle = document.querySelector(".hf-mobile-toggle");
  const mobileMenu = document.querySelector(".hf-mobile-menu");
  const overlay = document.querySelector(".hf-mobile-overlay");
  const navLinks = document.querySelectorAll(".hf-mobile-nav-link");

  if (!toggle || !mobileMenu || !overlay) return;

  toggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    toggle.classList.toggle("open");
  });

  overlay.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    toggle.classList.remove("open");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      overlay.classList.remove("active");
      toggle.classList.remove("open");
    });
  });

  console.log("📱 Mobile menu ready (legacy mode)");
}
