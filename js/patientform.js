const scriptURL = "https://script.google.com/macros/s/AKfycbwgRNLtac8jSFw8a9DTAwHaHMx8kgu4Ba7JhpTUgee1WfOK00zYIJ-zQIgG0TY1UuY37A/exec";
const form = document.getElementById("patientForm");
const responseDiv = document.getElementById("response");

form.addEventListener("submit", e => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(() => {
    responseDiv.innerHTML = "<div class='alert success'>✅ Patient record saved successfully.</div>";
    setTimeout(() => responseDiv.innerHTML = "", 15000);
    form.reset();
  })
  .catch(() => {
    responseDiv.innerHTML = "<div class='alert error'>❌ Error saving data. Try again.</div>";
  });
});
