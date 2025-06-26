class DonatoriManager {
    constructor() {
        this.donatori = [];
        this.currentDonatore = null;
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
    }

    async loadData() {
        try {
            const response = await fetch('/donatori');
            if (!response.ok) throw new Error('Errore nel caricamento dei donatori');
            this.donatori = await response.json();
            this.renderTable();
        } catch (error) {
            alert('Errore nel caricamento dei donatori: ' + error.message);
        }
    }

    bindEvents() {
        // Filter functionality
        const nameFilter = document.getElementById('nameFilter');
        const emailFilter = document.getElementById('emailFilter');
        
        if (nameFilter) {
            nameFilter.addEventListener('input', () => this.applyFilters());
        }
        if (emailFilter) {
            emailFilter.addEventListener('input', () => this.applyFilters());
        }

        // Add button
        const addBtn = document.getElementById('addBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.openModal();
            });
        }

        // Print button
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }

        // Modal events
        const modal = document.getElementById('donatoreModal');
        const closeBtn = modal?.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');
        const saveBtn = document.getElementById('saveBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveDonatore();
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    renderTable() {
        const tbody = document.querySelector('#donatoriTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.donatori.forEach(donatore => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donatore.id_donatore}</td>
                <td>${donatore.nome}</td>
                <td>${donatore.cognome}</td>
                <td>${donatore.email}</td>
                <td>${donatore.telefono}</td>
                <td>${donatore.totaleDonazioni || ''}</td>
                    <button class="btn btn-warning btn-small" onclick="donatoriManager.editDonatore(${donatore.id_donatore})">
                        <i class="fas fa-edit"></i> 
                    </button>
                    <button class="btn btn-danger btn-small" onclick="donatoriManager.deleteDonatore(${donatore.id_donatore})">
                        <i class="fas fa-trash"></i> 
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#donatoriTable tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    openModal(donatore = null) {
        const modal = document.getElementById('donatoreModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('donatoreForm');

        this.currentDonatore = donatore;

        if (donatore) {
            modalTitle.textContent = 'Modifica Donatore';
            document.getElementById('nome').value = donatore.nome;
            document.getElementById('cognome').value = donatore.cognome;
            document.getElementById('telefono').value = donatore.telefono;
            document.getElementById('email').value = donatore.email;
            document.getElementById('indirizzo').value = donatore.indirizzo;
        } else {
            modalTitle.textContent = 'Aggiungi Nuovo Donatore';
            form.reset();
        }

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('donatoreModal');
        modal.style.display = 'none';
        this.currentDonatore = null;
    }

    editDonatore(id) {
        const donatore = this.donatori.find(d => d.id_donatore === id);
        if (donatore) {
            this.openModal(donatore);
        }
    }

    async deleteDonatore(id) {
        if (confirm('Sei sicuro di voler eliminare questo donatore?')) {
            try {
                const response = await fetch(`/donatori/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Errore durante l\'eliminazione');
                this.loadData();
            } catch (error) {
                alert('Errore durante l\'eliminazione: ' + error.message);
            }
        }
    }

    async saveDonatore() {
        const form = document.getElementById('donatoreForm');
        const formData = new FormData(form);
        const donatoreData = {
            nome: formData.get('nome'),
            cognome: formData.get('cognome'),
            telefono: formData.get('telefono'),
            email: formData.get('email'),
            indirizzo: formData.get('indirizzo')
        };
        if (!donatoreData.nome || !donatoreData.cognome || !donatoreData.email) {
            alert('Per favore compila tutti i campi obbligatori.');
            return;
        }
        try {
            if (this.currentDonatore) {
                const response = await fetch(`/donatori/${this.currentDonatore.id_donatore}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donatoreData)
                });
                if (!response.ok) throw new Error('Errore durante la modifica');
            } else {
                const response = await fetch('/donatori', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donatoreData)
                });
                if (!response.ok) throw new Error('Errore durante la creazione');
            }
            this.closeModal();
            this.loadData();
        } catch (error) {
            alert('Errore durante il salvataggio: ' + error.message);
        }
    }

    applyFilters() {
        const nameFilter = document.getElementById('nameFilter')?.value.toLowerCase() || '';
        const emailFilter = document.getElementById('emailFilter')?.value.toLowerCase() || '';
        
        const rows = document.querySelectorAll('#donatoriTable tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const name = (cells[1]?.textContent + ' ' + cells[2]?.textContent).toLowerCase();
            const email = cells[3]?.textContent.toLowerCase() || '';
            
            const nameMatch = name.includes(nameFilter);
            const emailMatch = email.includes(emailFilter);
            
            row.style.display = nameMatch && emailMatch ? '' : 'none';
        });
    }
}

// Inizializza il manager quando la pagina è caricata
let donatoriManager;
document.addEventListener('DOMContentLoaded', () => {
    donatoriManager = new DonatoriManager();
});

// Funzione globale per resettare i filtri
function clearFilters() {
    document.getElementById('nameFilter').value = '';
    document.getElementById('emailFilter').value = '';
    donatoriManager.applyFilters();
}

// Funzione per aprire il modal e resettare il form
function openModal() {
    document.getElementById('donatoreForm').reset();
    document.getElementById('modalTitle').innerText = 'Nuovo Donatore';
    document.getElementById('donatoreModal').style.display = 'block';
}

// Funzione per chiudere il modal
function closeModal() {
    document.getElementById('donatoreModal').style.display = 'none';
}

// Chiudi il modal cliccando sulla X
document.querySelector('#donatoreModal .close').onclick = closeModal;

// Chiudi il modal cliccando fuori dal contenuto
window.onclick = function(event) {
    const modal = document.getElementById('donatoreModal');
    if (event.target == modal) {
        closeModal();
    }
};

// Gestione submit del form
document.getElementById('donatoreForm').onsubmit = function(e) {
    e.preventDefault();
    // Qui dovresti aggiungere la logica per salvare il donatore (via API o localmente)
    closeModal();
    // Dopo il salvataggio aggiorna la tabella
    // aggiornaTabellaDonatori();
};

// Funzione per aggiungere una riga alla tabella
function aggiungiRigaDonatore(donatore) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${donatore.id_donatore}</td>
        <td>${donatore.nome}</td>
        <td>${donatore.cognome}</td>
        <td>${donatore.email}</td>
        <td>${donatore.telefono}</td>
        <td>${donatore.tipo || ''}</td>
        <td>${donatore.totaleDonazioni || ''}</td>
        <td>
            <button class="btn btn-sm btn-warning" onclick="modificaDonatore(${donatore.id_donatore})">Modifica</button>
            <button class="btn btn-sm btn-danger" onclick="eliminaDonatore(${donatore.id_donatore})">Elimina</button>
        </td>
    `;
    document.getElementById('donatoriTableBody').appendChild(tr);
}