const API_URL = 'https://694a5d641282f890d2d8746a.mockapi.io/configuraciones';

const configForm = document.getElementById('configForm');
const configList = document.getElementById('configList');

const presupuestoInput = document.getElementById('presupuesto');
const presupuestoError = document.getElementById('presupuestoError');
const nucleosInput = document.getElementById('nucleos');
const capacidadRAMInput = document.getElementById('capacidad_RAM');


document.addEventListener('DOMContentLoaded', () => {
  loadConfigurations();
});


function validarFormulario() {
  const presupuesto = Number(presupuestoInput.value);
  const nucleos = Number(nucleosInput.value);
  const capacidadRAM = Number(capacidadRAMInput.value);

  // Núcleos
  nucleosInput.style.borderColor = nucleos < 2 ? 'red' : '';

  // Capacidad RAM
  capacidadRAMInput.style.borderColor = capacidadRAM < 4 ? 'red' : '';

  // Presupuesto
  if (presupuesto > 700) {
    presupuestoError.style.display = 'block';
    presupuestoInput.style.borderColor = 'red';
  } else {
    presupuestoError.style.display = 'none';
    presupuestoInput.style.borderColor = '';
  }
}

presupuestoInput.addEventListener('input', validarFormulario);
nucleosInput.addEventListener('input', validarFormulario);
capacidadRAMInput.addEventListener('input', validarFormulario);


// SUBMIT FORMULARIO

configForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre_del_servidor = document.getElementById('nombre_del_servidor').value.trim();
  const CPU = document.getElementById('CPU').value.trim();
  const RAM = document.getElementById('RAM').value.trim();
  const almacenamiento = document.getElementById('almacenamiento').value.trim();

  const nucleos = Number(nucleosInput.value);
  const capacidad_RAM = Number(capacidadRAMInput.value);
  const presupuesto = Number(presupuestoInput.value);

  if (!nombre_del_servidor || !CPU || !RAM || !almacenamiento) {
    alert('Por favor, complete todos los campos');
    return;
  }

  if (presupuesto <= 0 || presupuesto > 700) {
    alert('El presupuesto debe estar entre 1€ y 700€');
    return;
  }

  if (nucleos < 2 || capacidad_RAM < 4) {
    alert('Revise los valores mínimos de núcleos y RAM');
    return;
  }

  const newConfig = {
    nombre_del_servidor,
    CPU,
    nucleos,
    RAM,
    capacidad_RAM,
    almacenamiento,
    presupuesto
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    });

    if (!response.ok) throw new Error('Error al crear la configuración');

    configForm.reset();
    presupuestoError.style.display = 'none';
    await loadConfigurations();
    alert('Configuración creada exitosamente');

  } catch (error) {
    console.error(error);
    alert('Error al crear la configuración');
  }
});

// LOAD CONFIGURATIONS
async function loadConfigurations() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar configuraciones');

    const configurations = await response.json();
    renderConfigurations(configurations);
  } catch (error) {
    console.error(error);
    configList.innerHTML = '<p style="color:red">Error al cargar configuraciones</p>';
  }
}


// RENDER

function renderConfigurations(configurations) {
  if (!configurations.length) {
    configList.innerHTML = '<p>No hay configuraciones disponibles</p>';
    return;
  }

  configList.innerHTML = configurations.map(config => `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-computer"></i>${config.nombre_del_servidor}</h3>
        
        <button class="delete-btn" data-id="${config.id}">×</button>

      </div>
      <div class="card-body">
        <p><i class="fas fa-microchip"></i><strong>CPU:</strong> ${config.CPU}</p>
        <p><i class="fas fa-memory"></i><strong>Núcleos:</strong> ${config.nucleos}</p>
        <p><i class="fas fa-memory"></i><strong>RAM:</strong> ${config.RAM}</p>
        <p><i class="fas fa-hdd"></i><strong>Capacidad RAM:</strong> ${config.capacidad_RAM} GB</p>
        <p><i class="fas fa-hdd"></i><strong>Almacenamiento:</strong> ${config.almacenamiento}</p>
        <p><strong>Presupuesto:</strong> ${config.presupuesto} €</p>
      </div>
    </div>
  `).join('');
}

configList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    deleteConfiguration(id);
  }
});


// DELETE

async function deleteConfiguration(id) {
  if (!confirm('¿Eliminar esta configuración?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar');
    await loadConfigurations();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar la configuración');
  }
}
