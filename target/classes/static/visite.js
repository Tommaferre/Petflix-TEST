let currentVisitaId = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    loadVisite();
});

async function loadVisite() {
    try {
        const response = await fetch('/visita'); // Cambiato da '/visite' a '/visita'
        const visite = await response.json();
        
        const tbody = document.getElementById('visiteBody');
        tbody.innerHTML = '';
        
        visite.forEach(visita => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${visita.id_visita}</td>
                <td>${visita.idAnimale || ''}</td>
                <td>${visita.idDottoreVeterinario || ''}</td>
                <td>${visita.data_visita ? new Date(visita.data_visita).toLocaleDateString('it-IT') : ''}</td>
                <td>${visita.tipo_visita || ''}</td>
                <td>${visita.terapia || ''}</td>
                <td>${visita.farmaci || ''}</td>
                <td>${visita.controllo || ''}</td>
                <td>${visita.costo ? '€' + visita.costo : ''}</td>
                <td>${visita.note || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="editVisita(${visita.id_visita})">✏️</button>
                    <button class="btn btn-danger" onclick="deleteVisita(${visita.id_visita})">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('visiteTable').style.display = 'table';
    } catch (error) {
        console.error('Errore nel caricamento delle visite:', error);
        document.getElementById('loading').innerHTML = 'Errore nel caricamento dei dati';
    }
}

function openModal(mode, visitaId = null) {
    const modal = document.getElementById('visitaModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('visitaForm');
    
    if (mode === 'add') {
        title.textContent = 'Aggiungi Visita';
        form.reset();
        isEditMode = false;
        currentVisitaId = null;
    } else if (mode === 'edit') {
        title.textContent = 'Modifica Visita';
        isEditMode = true;
        currentVisitaId = visitaId;
        loadVisitaData(visitaId);
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('visitaModal').style.display = 'none';
}

async function loadVisitaData(id) {
    try {
        const response = await fetch(`/visite/${id}`);
        const visita = await response.json();
        
        document.getElementById('idAnimale').value = visita.idAnimale || '';
        document.getElementById('idDottoreVeterinario').value = visita.idDottoreVeterinario || '';
        document.getElementById('tipoVisita').value = visita.tipo_visita || '';
        document.getElementById('terapia').value = visita.terapia || '';
        document.getElementById('farmaci').value = visita.farmaci || '';
        document.getElementById('controllo').value = visita.controllo || '';
        document.getElementById('costo').value = visita.costo || '';
        document.getElementById('note').value = visita.note || '';
        
        if (visita.data_visita) {
            const date = new Date(visita.data_visita);
            document.getElementById('dataVisita').value = date.toISOString().split('T')[0];
        }
    } catch (error) {
        console.error('Errore nel caricamento dei dati della visita:', error);
        alert('Errore nel caricamento dei dati');
    }
}

function editVisita(id) {
    openModal('edit', id);
}

async function deleteVisita(id) {
    if (confirm('Sei sicuro di voler eliminare questa visita?')) {
        try {
            const response = await fetch(`/visite/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Visita eliminata con successo!');
                loadVisite();
            } else {
                alert('Errore nell\'eliminazione della visita');
            }
        } catch (error) {
            console.error('Errore nell\'eliminazione:', error);
            alert('Errore nell\'eliminazione della visita');
        }
    }
}

document.getElementById('visitaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const visitaData = {
        idAnimale: parseInt(formData.get('idAnimale')),
        idDottoreVeterinario: parseInt(formData.get('idDottoreVeterinario')),
        data_visita: formData.get('dataVisita'),
        tipo_visita: formData.get('tipoVisita'),
        terapia: formData.get('terapia'),
        farmaci: formData.get('farmaci'),
        controllo: formData.get('controllo'),
        costo: formData.get('costo') ? parseFloat(formData.get('costo')) : null,
        note: formData.get('note')
    };
    
    try {
        let response;
        if (isEditMode) {
            response = await fetch(`/visite/${currentVisitaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visitaData)
            });
        } else {
            response = await fetch('/visite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visitaData)
            });
        }
        
        if (response.ok) {
            alert(isEditMode ? 'Visita aggiornata con successo!' : 'Visita aggiunta con successo!');
            closeModal();
            loadVisite();
        } else {
            alert('Errore nel salvataggio della visita');
        }
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        alert('Errore nel salvataggio della visita');
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('visitaModal');
    if (event.target === modal) {
        closeModal();
    }
}