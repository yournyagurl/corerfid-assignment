let inspections = [];
let sortAsc = false;

window.onload = async function () {
  const res = await fetch("inspections.json");
  inspections = await res.json();
  renderTable(inspections);

  document.getElementById("searchInput").addEventListener("input", filterAndRender);
  document.getElementById("statusFilter").addEventListener("change", filterAndRender);
  document.getElementById("sortButton").addEventListener("click", () => {
    sortAsc = !sortAsc;
    filterAndRender();
    document.getElementById("sortButton").innerText = `Sort by Date ${sortAsc ? '↑' : '↓'}`;
  });
};

function filterAndRender() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;

  let filtered = inspections.filter(item => 
    item.serial_number.toLowerCase().includes(search) &&
    (status === "All" || item.status === status)
  );

  filtered.sort((a, b) => {
    return sortAsc 
      ? new Date(a.date) - new Date(b.date) 
      : new Date(b.date) - new Date(a.date);
  });

  renderTable(filtered);
}

function renderTable(data) {
  const container = document.getElementById("inspectionTableContainer");
  if (data.length === 0) {
    container.innerHTML = "<p class='text-center text-red-500'>No inspection records found.</p>";
    return;
  }

  let html = `<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">`; // Start grid layout

  data.forEach(item => {
    const statusClass = item.status === 'Pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
    html += `
      <div class="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all" onclick="showDetails('${item.serial_number}')">
        <h3 class="text-xl font-semibold mb-2">Serial Number: ${item.serial_number}</h3>
        <p><strong>Date:</strong> ${item.date}</p>
        <p><strong>Inspector:</strong> ${item.inspector}</p>
        <p class="${statusClass} font-semibold mt-2">${item.status}</p>
        <p><strong>Notes:</strong> ${item.notes}</p>
      </div>
    `;
  });

  html += `</div>`; // End grid layout
  container.innerHTML = html;
}

function showDetails(serialNumber) {
  const item = inspections.find(inspect => inspect.serial_number === serialNumber);

  // inspection details
  document.getElementById('modalTitle').innerText = `Details for Serial Number: ${item.serial_number}`;
  document.getElementById('modalSerialNumber').innerText = item.serial_number;
  document.getElementById('modalDate').innerText = item.date;
  document.getElementById('modalInspector').innerText = item.inspector;
  document.getElementById('modalStatus').innerText = item.status;
  document.getElementById('modalNotes').innerText = item.notes;

  const modalStatus = document.getElementById('modalStatus');
  if (item.status.toLowerCase() === 'pass') {
    modalStatus.className = 'bg-green-100 text-green-600'; 
  } else if (item.status.toLowerCase() === 'fail') {
    modalStatus.className = 'bg-red-100 text-red-600';
  }

  document.getElementById('inspectionModal').classList.remove('hidden');
}


function closeModal() {
  document.getElementById('inspectionModal').classList.add('hidden');
}
