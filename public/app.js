


const API_URL = 'http://localhost:3000/configuraciones';


const configForm = document.getElementById('configForm');
const configList = document.getElementById('configList');


document.addEventListener('DOMContentLoaded', () => {
    loadConfigurations();
});


configForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    
    const nombre_del_servidor = document.getElementById('nombre_del_servidor').value.trim();
    const CPU = document.getElementById('CPU').value.trim();
    const RAM = document.getElementById('RAM').value.trim();
    const almacenamiento = document.getElementById('almacenamiento').value.trim();
    
    
    if (!nombre_del_servidor || !CPU || !RAM || !almacenamiento) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    
    const newConfig = {
        nombre_del_servidor,
        CPU,
        RAM,
        almacenamiento
    };
    
    try {
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newConfig)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear la configuración');
        }
        
        
        configForm.reset();
        
        
        await loadConfigurations();
        
        alert('Configuración creada exitosamente');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear la configuración. Asegúrese de que el servidor JSON esté ejecutándose.');
    }
});


async function loadConfigurations() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Error al cargar configuraciones');
        }
        
        const configurations = await response.json();
        renderConfigurations(configurations);
        
    } catch (error) {
        console.error('Error:', error);
        configList.innerHTML = `
            <p style="text-align: center; color: #e74c3c; padding: 20px;">
                Error al cargar configuraciones.<br>
                Asegúrese de que el servidor JSON esté ejecutándose en el puerto 3000.<br>
                <small>Ejecute: <code>json-server --watch db.json</code></small>
            </p>
        `;
    }
}


function renderConfigurations(configurations) {
    if (!configurations || configurations.length === 0) {
        configList.innerHTML = '<p style="text-align: center; color: #666;">No hay configuraciones disponibles</p>';
        return;
    }
    
    configList.innerHTML = configurations.map(config => `
        <div class="card" data-id="${config.id}">
            <div class="card-header">
                <h3>${config.nombre_del_servidor}</h3>
                <button class="delete-btn" onclick="deleteConfiguration(${config.id})">×</button>
            </div>
            <div class="card-body">
                <p><strong>CPU:</strong> ${config.CPU}</p>
                <p><strong>RAM:</strong> ${config.RAM}</p>
                <p><strong>Almacenamiento:</strong> ${config.almacenamiento}</p>
            </div>
        </div>
    `).join('');
}


async function deleteConfiguration(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta configuración?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar la configuración');
        }
        
        
        await loadConfigurations();
        
        alert('Configuración eliminada exitosamente');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la configuración');
    }
}