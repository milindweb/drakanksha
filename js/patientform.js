// ✅ Your Google Apps Script web app link
const scriptURL = "https://script.google.com/macros/s/AKfycbwgRNLtac8jSFw8a9DTAwHaHMx8kgu4Ba7JhpTUgee1WfOK00zYIJ-zQIgG0TY1UuY37A/exec";

// ✅ Get form and response container elements
const form = document.getElementById("patientForm");
const responseDiv = document.getElementById("response");

// ✅ Function to auto-generate OPD No. (YYMMDDHHMMS)
function generateOPDNo() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);       // last two digits of year
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // month 01–12
  const dd = String(now.getDate()).padStart(2, "0");      // day 01–31
  const hh = String(now.getHours()).padStart(2, "0");     // hours 00–23
  const min = String(now.getMinutes()).padStart(2, "0");  // minutes 00–59
  const ss = String(now.getSeconds()).padStart(2, "0");   // seconds 00–59
  return `${yy}${mm}${dd}${hh}${min}${ss}`;               // combine into YYMMDDHHMMS
}

// ✅ Generate and show OPD No. immediately when page loads
const opdNoField = document.getElementById("opdNo");
const initialOPD = generateOPDNo();
opdNoField.value = initialOPD;

// ✅ Listen for form submission
form.addEventListener("submit", e => {
  e.preventDefault(); // prevent page reload

  // Collect all form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // --- 🔹 Generate fresh OPD No on each submission ---
  const opdNo = generateOPDNo();
  opdNoField.value = opdNo; // show the new OPD No in the input field

  // Add the generated OPD number to the data being sent
  data.opdNo = opdNo;

  // --- 🔹 Send the data to Google Apps Script endpoint ---
  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(() => {
    // Show success message
    responseDiv.innerHTML = `
      <div class='alert success'>
        ✅ Patient record saved successfully.<br>
        <strong>OPD No:</strong> ${opdNo}
      </div>`;
    // Clear message after 15 seconds
    setTimeout(() => responseDiv.innerHTML = "", 15000);
    form.reset();

    // Generate a new OPD No for the next entry
    opdNoField.value = generateOPDNo();
  })
  .catch(() => {
    // Show error if submission fails
    responseDiv.innerHTML = "<div class='alert error'>❌ Error saving data. Try again.</div>";
  });
});
