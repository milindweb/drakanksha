// ===================================================
// Dynamically Load HEADER and FOOTER into Every Page
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  // Load Header
  fetch("header.html")
    .then(res => {
      if (!res.ok) throw new Error("Header not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("header").innerHTML = html;
      console.log("✅ Header loaded successfully");
    })
    .catch(err => console.error("❌ Header load error:", err));

  // Load Footer
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
