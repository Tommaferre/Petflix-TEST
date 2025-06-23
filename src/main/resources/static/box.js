let currentBoxId = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
    loadBox();
});

async function loadBox() {
    try {
        const response = await fetch('/box');
        const boxes = await response.json();
        
        const tbody = document.getElementById('boxBody');
        tbody.innerHTML = '';
        
        boxes.forEach(box => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${box.id_box}</td>
                <td>${box.nome || ''}</td>
                <td>${box.capienza || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="editBox(${box.id_box})">✏️</button>
                    <button class="btn btn-danger" onclick="deleteBox(${box.id_box})">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('boxTable').style.display = 'table';
    } catch (error) {
        console.error('Errore nel caricamento dei box:', error);
        document.getElementById('loading').innerHTML = 'Errore nel caricamento dei dati';
    }
}

function openModal(mode, boxId = null) {
    const modal = document.getElementById('boxModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('boxForm');
    
    if (mode === 'add') {
        title.textContent = 'Aggiungi Box';
        form.reset();
        isEditMode = false;
        currentBoxId = null;
    } else if (mode === 'edit') {
        title.textContent = 'Modifica Box';
        isEditMode = true;
        currentBoxId = boxId;
        loadBoxData(boxId);
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('boxModal').style.display = 'none';
}

async function loadBoxData(id) {
    try {
        const response = await fetch(`/box/${id}`);
        const box = await response.json();
        
        document.getElementById('nome').value = box.nome || '';
        document.getElementById('capienza').value = box.capienza || '';
    } catch (error) {
        console.error('Errore nel caricamento dei dati del box:', error);
        alert('Errore nel caricamento dei dati');
    }
}

function editBox(id) {
    openModal('edit', id);
}

async function deleteBox(id) {
    if (confirm('Sei sicuro di voler eliminare questo box?')) {
        try {
            const response = await fetch(`/box/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Box eliminato con successo!');
                loadBox();
            } else {
                alert('Errore nell\'eliminazione del box');
            }
        } catch (error) {
            console.error('Errore nell\'eliminazione:', error);
            alert('Errore nell\'eliminazione del box');
        }
    }
}

document.getElementById('boxForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const boxData = {
        nome: formData.get('nome'),
        capienza: parseInt(formData.get('capienza'))
    };
    
    try {
        let response;
        if (isEditMode) {
            response = await fetch(`/box/${currentBoxId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(boxData)
            });
        } else {
            response = await fetch('/box', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(boxData)
            });
        }
        
        if (response.ok) {
            alert(isEditMode ? 'Box aggiornato con successo!' : 'Box aggiunto con successo!');
            closeModal();
            loadBox();
        } else {
            alert('Errore nel salvataggio del box');
        }
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        alert('Errore nel salvataggio del box');
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('boxModal');
    if (event.target === modal) {
        closeModal();
    }
}