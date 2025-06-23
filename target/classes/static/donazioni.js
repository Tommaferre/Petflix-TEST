let currentDonazioneId = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    loadDonazioni();
});

async function loadDonazioni() {
    try {
        const response = await fetch('/donazioni');
        const donazioni = await response.json();
        
        const tbody = document.getElementById('donazioniBody');
        tbody.innerHTML = '';
        
        donazioni.forEach(donazione => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donazione.id_donazione}</td>
                <td>${donazione.tipo || ''}</td>
                <td>${donazione.contenuto || ''}</td>
                <td>${donazione.data_emissione ? new Date(donazione.data_emissione).toLocaleDateString('it-IT') : ''}</td>
                <td>${donazione.note_donatore || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="editDonazione(${donazione.id_donazione})">✏️</button>
                    <button class="btn btn-danger" onclick="deleteDonazione(${donazione.id_donazione})">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('donazioniTable').style.display = 'table';
    } catch (error) {
        console.error('Errore nel caricamento delle donazioni:', error);
        document.getElementById('loading').innerHTML = 'Errore nel caricamento dei dati';
    }
}

function openModal(mode, donazioneId = null) {
    const modal = document.getElementById('donazioneModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('donazioneForm');
    
    if (mode === 'add') {
        title.textContent = 'Aggiungi Donazione';
        form.reset();
        isEditMode = false;
        currentDonazioneId = null;
    } else if (mode === 'edit') {
        title.textContent = 'Modifica Donazione';
        isEditMode = true;
        currentDonazioneId = donazioneId;
        loadDonazioneData(donazioneId);
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('donazioneModal').style.display = 'none';
}

async function loadDonazioneData(id) {
    try {
        const response = await fetch(`/donazioni/${id}`);
        const donazione = await response.json();
        
        document.getElementById('tipo').value = donazione.tipo || '';
        document.getElementById('contenuto').value = donazione.contenuto || '';
        document.getElementById('noteDonatore').value = donazione.note_donatore || '';
        
        if (donazione.data_emissione) {
            const date = new Date(donazione.data_emissione);
            document.getElementById('dataEmissione').value = date.toISOString().split('T')[0];
        }
    } catch (error) {
        console.error('Errore nel caricamento dei dati della donazione:', error);
        alert('Errore nel caricamento dei dati');
    }
}

function editDonazione(id) {
    openModal('edit', id);
}

async function deleteDonazione(id) {
    if (confirm('Sei sicuro di voler eliminare questa donazione?')) {
        try {
            const response = await fetch(`/donazioni/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Donazione eliminata con successo!');
                loadDonazioni();
            } else {
                alert('Errore nell\'eliminazione della donazione');
            }
        } catch (error) {
            console.error('Errore nell\'eliminazione:', error);
            alert('Errore nell\'eliminazione della donazione');
        }
    }
}

document.getElementById('donazioneForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const donazioneData = {
        tipo: formData.get('tipo'),
        contenuto: formData.get('contenuto'),
        data_emissione: formData.get('dataEmissione'),
        note_donatore: formData.get('noteDonatore')
    };
    
    try {
        let response;
        if (isEditMode) {
            response = await fetch(`/donazioni/${currentDonazioneId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donazioneData)
            });
        } else {
            response = await fetch('/donazioni', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donazioneData)
            });
        }
        
        if (response.ok) {
            alert(isEditMode ? 'Donazione aggiornata con successo!' : 'Donazione aggiunta con successo!');
            closeModal();
            loadDonazioni();
        } else {
            alert('Errore nel salvataggio della donazione');
        }
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        alert('Errore nel salvataggio della donazione');
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('donazioneModal');
    if (event.target === modal) {
        closeModal();
    }
}