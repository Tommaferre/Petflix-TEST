class AdottantiManager {
    constructor() {
        this.adottanti = [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadAdottanti();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('adottanteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAdottante();
        });
    }

    async loadAdottanti() {
        try {
            const response = await fetch('/adottanti');
            if (!response.ok) throw new Error('Errore nel caricamento degli adottanti');
            this.adottanti = await response.json();
            this.renderTable();
        } catch (error) {
            alert('Errore nel caricamento degli adottanti: ' + error.message);
        }
    }

    renderTable() {
        const tbody = document.getElementById('adottantiTableBody');
        tbody.innerHTML = '';

        this.adottanti.forEach(adottante => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${adottante.idAdottante}</td>
                <td>${adottante.nome}</td>
                <td>${adottante.cognome}</td>
                <td>${adottante.telefono || '-'}</td>
                <td>${adottante.email || '-'}</td>
                <td>${adottante.indirizzo}</td>
                <td><span class="badge ${this.getIdoneityClass(adottante.idoneo)}">${typeof adottante.idoneo === 'string' ? adottante.idoneo : (adottante.idoneo?.valore || '')}</span></td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="adottantiManager.editAdottante(${adottante.idAdottante})">Modifica</button>
                    <button class="btn btn-danger btn-small" onclick="adottantiManager.deleteAdottante(${adottante.idAdottante})">Elimina</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getIdoneityClass(idoneo) {
        return idoneo === 'idoneo' ? 'badge-success' : 'badge-danger';
    }

    editAdottante(id) {
        const adottante = this.adottanti.find(a => a.idAdottante === id);
        if (adottante) {
            this.currentEditId = id;
            document.getElementById('modalTitle').textContent = 'Modifica Adottante';
            document.getElementById('nome').value = adottante.nome;
            document.getElementById('cognome').value = adottante.cognome;
            document.getElementById('telefono').value = adottante.telefono || '';
            document.getElementById('email').value = adottante.email || '';
            document.getElementById('indirizzo').value = adottante.indirizzo;
            document.getElementById('idoneo').value = typeof adottante.idoneo === 'string' ? adottante.idoneo : (adottante.idoneo?.valore || '');
            document.getElementById('adottanteModal').style.display = 'block';
        }
    }

    async deleteAdottante(id) {
        if (confirm('Sei sicuro di voler eliminare questo adottante?')) {
            try {
                const response = await fetch(`/adottanti/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Errore durante l\'eliminazione');
                this.loadAdottanti();
            } catch (error) {
                alert('Errore durante l\'eliminazione: ' + error.message);
            }
        }
    }

    async saveAdottante() {
        const formData = new FormData(document.getElementById('adottanteForm'));
        const adottanteData = {
            nome: formData.get('nome'),
            cognome: formData.get('cognome'),
            telefono: formData.get('telefono'),
            email: formData.get('email'),
            indirizzo: formData.get('indirizzo'),
            idoneo: formData.get('idoneo')
        };
        try {
            if (this.currentEditId) {
                const response = await fetch(`/adottanti/${this.currentEditId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(adottanteData)
                });
                if (!response.ok) throw new Error('Errore durante la modifica');
            } else {
                const response = await fetch('/adottanti', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(adottanteData)
                });
                if (!response.ok) throw new Error('Errore durante la creazione');
            }
            this.closeModal();
            this.loadAdottanti();
        } catch (error) {
            alert('Errore durante il salvataggio: ' + error.message);
        }
    }

    closeModal() {
        document.getElementById('adottanteModal').style.display = 'none';
        document.getElementById('adottanteForm').reset();
        this.currentEditId = null;
    }
}

// Global functions
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Aggiungi Adottante';
    document.getElementById('adottanteModal').style.display = 'block';
}

function closeModal() {
    adottantiManager.closeModal();
}

// Initialize
let adottantiManager;
document.addEventListener('DOMContentLoaded', () => {
    adottantiManager = new AdottantiManager();
});