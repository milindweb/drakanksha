const APP_URL = "https://script.google.com/macros/s/AKfycbysvWwETA5lDzsx6_zi8yPEWFTY05fxNFIUiDIZZ0VvrvwzyefX1WtEcfFTkohdJDqi/exec";

let investigations = [];
let prescriptions = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date").value = new Date().toLocaleDateString('en-GB');
  document.getElementById("opd").value = generateOPD();
  loadDoctors();
});

function toggleSection(id){
  const el = document.getElementById(id);
  el.classList.toggle("hidden");
}

function generateOPD(){
  const now = new Date();
  return `${now.getFullYear().toString().slice(2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
}

function loadDoctors(){
  fetch('data/drname.json')
  .then(r=>r.json())
  .then(list=>{
    const sel = document.getElementById("doctor");
    list.forEach(d=>{
      const opt=document.createElement("option");
      opt.textContent=d;
      sel.appendChild(opt);
    });
  });
}

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

function val(id){ return document.getElementById(id).value.trim(); }
function clear(ids){ ids.forEach(i=>document.getElementById(i).value=""); }

function collectFormData(){
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
    investigations,
    prescriptions,
    diagnosis: val("diagnosis"),
    advice: val("advice"),
    effect: val("effect"),
    drRemarks: val("remarks")
  };
}

function previewData(){
  const data = collectFormData();
  alert("Preview:\n"+JSON.stringify(data, null, 2));
}

function submitForm(){
  const data = collectFormData();
  if(!data.patientName){ alert("Enter patient name"); return; }
  fetch(APP_URL, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"save", data})
  })
  .then(r=>r.json())
  .then(res=>{
    if(res.success){
      alert("Data Saved Successfully!");
      location.reload();
    } else alert("Error: "+res.message);
  })
  .catch(err=>alert("Error: "+err));
}
