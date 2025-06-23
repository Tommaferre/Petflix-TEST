let currentDonatoreId = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    loadDonatori();
});

async function loadDonatori() {
    try {
        const response = await fetch('/donatori');
        const donatori = await response.json();
        
        const tbody = document.getElementById('donatoriBody');
        tbody.innerHTML = '';
        
        donatori.forEach(donatore => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donatore.id_donatore}</td>
                <td>${donatore.nome || ''}</td>
                <td>${donatore.cognome || ''}</td>
                <td>${donatore.telefono || ''}</td>
                <td>${donatore.email || ''}</td>
                <td>${donatore.indirizzo || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="editDonatore(${donatore.id_donatore})">✏️</button>
                    <button class="btn btn-danger" onclick="deleteDonatore(${donatore.id_donatore})">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('donatoriTable').style.display = 'table';
    } catch (error) {
        console.error('Errore nel caricamento dei donatori:', error);
        document.getElementById('loading').innerHTML = 'Errore nel caricamento dei dati';
    }
}

function openModal(mode, donatoreId = null) {
    const modal = document.getElementById('donatoreModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('donatoreForm');
    
    if (mode === 'add') {
        title.textContent = 'Aggiungi Donatore';
        form.reset();
        isEditMode = false;
        currentDonatoreId = null;
    } else if (mode === 'edit') {
        title.textContent = 'Modifica Donatore';
        isEditMode = true;
        currentDonatoreId = donatoreId;
        loadDonatoreData(donatoreId);
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('donatoreModal').style.display = 'none';
}

async function loadDonatoreData(id) {
    try {
        const response = await fetch(`/donatori/${id}`);
        const donatore = await response.json();
        
        document.getElementById('nome').value = donatore.nome || '';
        document.getElementById('cognome').value = donatore.cognome || '';
        document.getElementById('telefono').value = donatore.telefono || '';
        document.getElementById('email').value = donatore.email || '';
        document.getElementById('indirizzo').value = donatore.indirizzo || '';
    } catch (error) {
        console.error('Errore nel caricamento dei dati del donatore:', error);
        alert('Errore nel caricamento dei dati');
    }
}

function editDonatore(id) {
    openModal('edit', id);
}

async function deleteDonatore(id) {
    if (confirm('Sei sicuro di voler eliminare questo donatore?')) {
        try {
            const response = await fetch(`/donatori/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Donatore eliminato con successo!');
                loadDonatori();
            } else {
                alert('Errore nell\'eliminazione del donatore');
            }
        } catch (error) {
            console.error('Errore nell\'eliminazione:', error);
            alert('Errore nell\'eliminazione del donatore');
        }
    }
}

document.getElementById('donatoreForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const donatoreData = {
        nome: formData.get('nome'),
        cognome: formData.get('cognome'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        indirizzo: formData.get('indirizzo')
    };
    
    try {
        let response;
        if (isEditMode) {
            response = await fetch(`/donatori/${currentDonatoreId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donatoreData)
            });
        } else {
            response = await fetch('/donatori', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donatoreData)
            });
        }
        
        if (response.ok) {
            alert(isEditMode ? 'Donatore aggiornato con successo!' : 'Donatore aggiunto con successo!');
            closeModal();
            loadDonatori();
        } else {
            alert('Errore nel salvataggio del donatore');
        }
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        alert('Errore nel salvataggio del donatore');
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('donatoreModal');
    if (event.target === modal) {
        closeModal();
    }
}