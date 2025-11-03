const APP_URL = "https://script.google.com/macros/s/AKfycbw5Fq8xJeXjPilVb01Iz4lArtrgfq5jd8A55U8Zjp3taVRkni20QrXgHiYa1eEUN1ly/exec";

let investigations = [];
let prescriptions = [];

let complaints = [];
let labTests = [];
let medicines = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date").value = new Date().toLocaleDateString('en-GB');
  document.getElementById("opd").value = generateOPD();
  loadDoctors();
  loadComplaints();
  loadLabTests();
  loadMedicines();
});

// --- BASIC UTILITIES ---
function val(id){ return document.getElementById(id).value.trim(); }
function clear(ids){ ids.forEach(i=>document.getElementById(i).value=""); }
function toggleSection(id){ document.getElementById(id).classList.toggle("hidden"); }

function generateOPD(){
  const now = new Date();
  return `${now.getFullYear().toString().slice(2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
}

// --- LOADERS ---
function loadDoctors(){
  fetch("data/drname.json")
    .then(r=>r.json())
    .then(data=>{
      const sel = document.getElementById("doctor");
      sel.innerHTML = "";
      data.doctors.forEach(d=>{
        const opt=document.createElement("option");
        opt.textContent=d;
        sel.appendChild(opt);
      });
    });
}

function loadComplaints(){
  fetch("data/complaint.json")
    .then(r=>r.json())
    .then(data=>{
      complaints = data;
      const chief = document.getElementById("chief");
      chief.innerHTML = "";
      complaints.forEach(c=>{
        const opt=document.createElement("option");
        opt.textContent = c.chiefComplaint;
        chief.appendChild(opt);
      });

      // On chief change, fill sub-symptoms
      chief.addEventListener("change", ()=>{
        const selected = complaints.find(x=>x.chiefComplaint===chief.value);
        const subSel = document.getElementById("subsym");
        subSel.innerHTML = "";
        if(selected && selected.subSymptoms){
          selected.subSymptoms.forEach(s=>{
            const opt=document.createElement("option");
            opt.textContent=s;
            subSel.appendChild(opt);
          });
        }
      });
    });
}

function loadLabTests(){
  fetch("data/labtest.json")
    .then(r=>r.json())
    .then(data=>{
      labTests = data.laboratoryTests || [];
      const catInput = document.getElementById("testcat");
      const nameInput = document.getElementById("testname");

      // Category autocomplete
      const catList = labTests.map(l=>l.category);
      autocomplete(catInput, catList);

      // On category change → update test name list
      catInput.addEventListener("input", ()=>{
        const category = labTests.find(x=>x.category.toLowerCase()===catInput.value.toLowerCase());
        const names = category ? category.tests.map(t=>t.testName) : [];
        autocomplete(nameInput, names);

        nameInput.addEventListener("input", ()=>{
          const t = category?.tests.find(tt=>tt.testName.toLowerCase()===nameInput.value.toLowerCase());
          if(t) document.getElementById("range").value = t.normalRange;
        });
      });
    });
}

function loadMedicines(){
  fetch("data/medlist.json")
    .then(r=>r.json())
    .then(data=>{
      medicines = data;
      const formInput = document.getElementById("formavail");
      const genericInput = document.getElementById("generic");

      const forms = [...new Set(medicines.map(m=>m["Forms Available"]))];
      const generics = medicines.map(m=>m["Generic "][" API (Single or Combination)"]);

      autocomplete(formInput, forms);
      autocomplete(genericInput, generics);
    });
}

// --- AUTOCOMPLETE FUNCTION ---
function autocomplete(inp, arr){
  inp.addEventListener("input", function(){
    closeAllLists();
    if(!this.value) return false;
    const val = this.value.toLowerCase();
    const list = document.createElement("div");
    list.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(list);
    arr.filter(a=>a && a.toLowerCase().includes(val)).slice(0,10).forEach(a=>{
      const item = document.createElement("div");
      item.innerHTML = "<strong>"+a.substr(0,this.value.length)+"</strong>"+a.substr(this.value.length);
      item.addEventListener("click", ()=>{
        inp.value = a;
        closeAllLists();
      });
      list.appendChild(item);
    });
  });

  inp.addEventListener("blur", ()=>setTimeout(closeAllLists, 200));
}

function closeAllLists(){
  document.querySelectorAll(".autocomplete-items").forEach(el=>el.remove());
}

// --- TABLE MANAGEMENT ---
function addInvestigation(){
  const t=[val("testcat"), val("testname"), val("reports"), val("range"), val("drremark")];
  if(!t[1]) return alert("Enter test name");
  investigations.push(t);
  renderTable("investTable", investigations);
  clear(["testcat","testname","reports","range","drremark"]);
}

function addPrescription(){
  const t=[val("formavail"), val("generic"), val("comment")];
  if(!t[1]) return alert("Enter medicine name");
  prescriptions.push(t);
  renderTable("rxTable", prescriptions);
  clear(["formavail","generic","comment"]);
}

function renderTable(id, data){
  const tbody = document.querySelector(`#${id} tbody`);
  tbody.innerHTML = "";
  data.forEach(r=>{
    const tr=document.createElement("tr");
    r.forEach(c=>{
      const td=document.createElement("td");
      td.textContent=c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}



function collectFormData(){
  // ---- INVESTIGATION TABLE ----
  const inv = [];
  document.querySelectorAll("#investTable tbody tr").forEach(tr=>{
    const tds = [...tr.children].map(td=>td.textContent.trim());
    inv.push(tds);
  });

  // Convert multiple investigation rows → newline-separated strings
  const testCategory = inv.map(r => r[0]).join('\n');
  const testName     = inv.map(r => r[1]).join('\n');
  const reports      = inv.map(r => r[2]).join('\n');
  const normalRange  = inv.map(r => r[3]).join('\n');
  const drRemark     = inv.map(r => r[4]).join('\n');

  // ---- PRESCRIPTION TABLE ----
  const rx = [];
  document.querySelectorAll("#rxTable tbody tr").forEach(tr=>{
    const tds = [...tr.children].map(td=>td.textContent.trim());
    rx.push(tds);
  });

  // Convert multiple prescription rows → newline-separated strings
  const formAvail = rx.map(r => r[0]).join('\n');
  const medicine  = rx.map(r => r[1]).join('\n');
  const comment   = rx.map(r => r[2]).join('\n');

  // ---- RETURN FINAL DATA ----
  return {
    date: val("date"),
    opd: val("opd"),
    patientName: val("pname"),
    mobile: val("mobile"),
    gender: val("gender"),
    age: val("age"),
    department: val("dept"),
    doctor: val("doctor"),
    chiefComplaint: val("chief"),
    subSymptoms: val("subsym"),
    specificComplaint: val("specific"),
    weight: val("weight"),
    bp: val("bp"),
    pulse: val("pulse"),
    temp: val("temp"),
    sugar: val("sugar"),
    // New flattened multiline fields
    testCategory, testName, reports, normalRange, drRemark,
    formAvail, medicine, comment,
    diagnosis: val("diagnosis"),
    advice: val("advice"),
    effect: val("effect"),
    drRemarks: val("remarks")
  };
}


function previewData() {
  const data = collectFormData();

  // --- Build readable HTML preview ---
  let html = `
  <h3>🩺 Patient Form Preview</h3>
  <hr>
  <h4>🧍 Basic Info</h4>
  <p><b>Date:</b> ${data.date}</p>
  <p><b>OPD No:</b> ${data.opd}</p>
  <p><b>Patient Name:</b> ${data.patientName}</p>
  <p><b>Mobile No:</b> ${data.mobile}</p>
  <p><b>Gender:</b> ${data.gender}</p>
  <p><b>Age:</b> ${data.age}</p>
  <p><b>Department:</b> ${data.department}</p>
  <p><b>Doctor:</b> ${data.doctor}</p>
  <p><b>Chief Complaint:</b> ${data.chiefComplaint}</p>
  <p><b>Sub-Symptoms:</b> ${data.subSymptoms}</p>
  <p><b>Specific Complaint:</b> ${data.specificComplaint}</p>

  <h4>💓 Vitals</h4>
  <p><b>Weight:</b> ${data.weight}</p>
  <p><b>BP:</b> ${data.bp}</p>
  <p><b>Pulse:</b> ${data.pulse}</p>
  <p><b>Temp:</b> ${data.temp}</p>
  <p><b>Sugar:</b> ${data.sugar}</p>

  <h4>🧪 Investigations</h4>
  <table border="1" style="border-collapse:collapse;width:100%;text-align:left;">
    <tr><th>Category</th><th>Name</th><th>Report</th><th>Limit</th><th>Remark</th></tr>
    ${data.investigations.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
  </table>

  <h4>💊 Prescriptions</h4>
  <table border="1" style="border-collapse:collapse;width:100%;text-align:left;">
    <tr><th>Form</th><th>Medicine</th><th>Comment</th></tr>
    ${data.prescriptions.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
  </table>

  <h4>🩹 Treatment / Diagnosis</h4>
  <p><b>Diagnosis:</b> ${data.diagnosis}</p>
  <p><b>Advice:</b> ${data.advice}</p>
  <p><b>Effect:</b> ${data.effect}</p>

  <h4>📝 Doctor Remark</h4>
  <p>${data.drRemarks}</p>
  `;

  // --- Show in modal-like preview ---
  const w = window.open("", "Preview", "width=800,height=700,scrollbars=yes");
  w.document.write(`
    <html><head><title>Patient Preview</title>
    <style>
      body { font-family: Arial; padding: 20px; line-height:1.6; }
      h3,h4 { margin-top: 20px; }
      table, th, td { border:1px solid #ccc; padding:6px; }
      th { background:#f5f5f5; }
    </style>
    </head><body>${html}</body></html>
  `);
}
