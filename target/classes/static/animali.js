let currentAnimalId = null;
let isEditMode = false;

// Carica animali all'avvio
document.addEventListener('DOMContentLoaded', function() {
    loadAnimali();
});

// Carica tutti gli animali
async function loadAnimali() {
    try {
        const response = await fetch('/animali');
        const animali = await response.json();
        
        const tbody = document.getElementById('animaliBody');
        tbody.innerHTML = '';
        
        animali.forEach(animale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animale.id_animale}</td>
                <td>${animale.nome || ''}</td>
                <td>${animale.specie || ''}</td>
                <td>${animale.razza || ''}</td>
                <td>${animale.microchip || ''}</td>
                <td>${animale.idBox || ''}</td>
                <td>${animale.dataArrivo ? new Date(animale.dataArrivo).toLocaleDateString('it-IT') : ''}</td>
                <td>${animale.stato || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="editAnimale(${animale.id_animale})">✏️</button>
                    <button class="btn btn-danger" onclick="deleteAnimale(${animale.id_animale})">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('animaliTable').style.display = 'table';
    } catch (error) {
        console.error('Errore nel caricamento degli animali:', error);
        document.getElementById('loading').innerHTML = 'Errore nel caricamento dei dati';
    }
}

// Apri modal
function openModal(mode, animalId = null) {
    const modal = document.getElementById('animaleModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('animaleForm');
    
    if (mode === 'add') {
        title.textContent = 'Aggiungi Animale';
        form.reset();
        isEditMode = false;
        currentAnimalId = null;
    } else if (mode === 'edit') {
        title.textContent = 'Modifica Animale';
        isEditMode = true;
        currentAnimalId = animalId;
        loadAnimaleData(animalId);
    }
    
    modal.style.display = 'block';
}

// Chiudi modal
function closeModal() {
    document.getElementById('animaleModal').style.display = 'none';
}

// Carica dati animale per modifica
async function loadAnimaleData(id) {
    try {
        const response = await fetch(`/animali/${id}`);
        const animale = await response.json();
        
        document.getElementById('nome').value = animale.nome || '';
        document.getElementById('specie').value = animale.specie || '';
        document.getElementById('razza').value = animale.razza || '';
        document.getElementById('microchip').value = animale.microchip || '';
        document.getElementById('idBox').value = animale.idBox || '';
        document.getElementById('stato').value = animale.stato || '';
        
        if (animale.dataArrivo) {
            const date = new Date(animale.dataArrivo);
            document.getElementById('dataArrivo').value = date.toISOString().split('T')[0];
        }
    } catch (error) {
        console.error('Errore nel caricamento dei dati dell\'animale:', error);
        alert('Errore nel caricamento dei dati');
    }
}

// Modifica animale
function editAnimale(id) {
    openModal('edit', id);
}

// Elimina animale
async function deleteAnimale(id) {
    if (confirm('Sei sicuro di voler eliminare questo animale?')) {
        try {
            const response = await fetch(`/animali/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Animale eliminato con successo!');
                loadAnimali();
            } else {
                alert('Errore nell\'eliminazione dell\'animale');
            }
        } catch (error) {
            console.error('Errore nell\'eliminazione:', error);
            alert('Errore nell\'eliminazione dell\'animale');
        }
    }
}

// Gestione form
document.getElementById('animaleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const animaleData = {
        nome: formData.get('nome'),
        specie: formData.get('specie'),
        razza: formData.get('razza'),
        microchip: formData.get('microchip'),
        idBox: formData.get('idBox') ? parseInt(formData.get('idBox')) : null,
        stato: formData.get('stato'),
        dataArrivo: formData.get('dataArrivo') || null
    };
    
    try {
        let response;
        if (isEditMode) {
            response = await fetch(`/animali/${currentAnimalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(animaleData)
            });
        } else {
            response = await fetch('/animali', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(animaleData)
            });
        }
        
        if (response.ok) {
            alert(isEditMode ? 'Animale aggiornato con successo!' : 'Animale aggiunto con successo!');
            closeModal();
            loadAnimali();
        } else {
            alert('Errore nel salvataggio dell\'animale');
        }
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        alert('Errore nel salvataggio dell\'animale');
    }
});

// Chiudi modal cliccando fuori
window.onclick = function(event) {
    const modal = document.getElementById('animaleModal');
    if (event.target === modal) {
        closeModal();
    }
}