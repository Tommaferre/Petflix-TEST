class VeterinariManager {
    constructor() {
        this.veterinari = [];
        this.currentVeterinarioId = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTable();
    }

    loadData() {
        // Dati simulati - sostituire con chiamate API reali
        this.veterinari = [
            {
                id: 1,
                nome: "Dr. Marco",
                cognome: "Veterinari",
                telefono: "3331234567",
                email: "marco.vet@email.com",
                specializzazione: "Chirurgia Generale"
            },
            {
                id: 2,
                nome: "Dr.ssa Anna",
                cognome: "Rossi",
                telefono: "3339876543",
                email: "anna.rossi@email.com",
                specializzazione: "Medicina Interna"
            },
            {
                id: 3,
                nome: "Dr. Luigi",
                cognome: "Bianchi",
                telefono: "3335555555",
                email: "luigi.bianchi@email.com",
                specializzazione: "Ortopedia"
            }
        ];
    }

    setupEventListeners() {
        document.getElementById('addVeterinarioBtn').addEventListener('click', () => this.openModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
        document.getElementById('veterinarioForm').addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('veterinarioModal')) {
                this.closeModal();
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('veterinariTableBody');
        tbody.innerHTML = '';

        this.veterinari.forEach(veterinario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${veterinario.id}</td>
                <td>${veterinario.nome}</td>
                <td>${veterinario.cognome}</td>
                <td>${veterinario.telefono}</td>
                <td>${veterinario.email}</td>
                <td>${veterinario.specializzazione}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="veterinariManager.editVeterinario(${veterinario.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="veterinariManager.deleteVeterinario(${veterinario.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#veterinariTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    openModal(veterinarioId = null) {
        this.currentVeterinarioId = veterinarioId;
        const modal = document.getElementById('veterinarioModal');
        const title = document.getElementById('modalTitle');
        
        if (veterinarioId) {
            title.textContent = 'Modifica Veterinario';
            this.populateForm(veterinarioId);
        } else {
            title.textContent = 'Nuovo Veterinario';
            document.getElementById('veterinarioForm').reset();
        }
        
        modal.style.display = 'block';
    }

    populateForm(veterinarioId) {
        const veterinario = this.veterinari.find(v => v.id === veterinarioId);
        if (veterinario) {
            document.getElementById('nome').value = veterinario.nome;
            document.getElementById('cognome').value = veterinario.cognome;
            document.getElementById('telefono').value = veterinario.telefono;
            document.getElementById('email').value = veterinario.email;
            document.getElementById('specializzazione').value = veterinario.specializzazione;
        }
    }

    closeModal() {
        document.getElementById('veterinarioModal').style.display = 'none';
        this.currentVeterinarioId = null;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            nome: document.getElementById('nome').value,
            cognome: document.getElementById('cognome').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            specializzazione: document.getElementById('specializzazione').value
        };

        if (this.currentVeterinarioId) {
            this.updateVeterinario(this.currentVeterinarioId, formData);
        } else {
            this.addVeterinario(formData);
        }
    }

    addVeterinario(data) {
        const newId = Math.max(...this.veterinari.map(v => v.id)) + 1;
        const newVeterinario = {
            id: newId,
            ...data
        };
        
        this.veterinari.push(newVeterinario);
        this.renderTable();
        this.closeModal();
        alert('Veterinario aggiunto con successo!');
    }

    updateVeterinario(id, data) {
        const index = this.veterinari.findIndex(v => v.id === id);
        if (index !== -1) {
            this.veterinari[index] = {
                ...this.veterinari[index],
                ...data
            };
            
            this.renderTable();
            this.closeModal();
            alert('Veterinario aggiornato con successo!');
        }
    }

    editVeterinario(id) {
        this.openModal(id);
    }

    deleteVeterinario(id) {
        if (confirm('Sei sicuro di voler eliminare questo veterinario?')) {
            this.veterinari = this.veterinari.filter(v => v.id !== id);
            this.renderTable();
            alert('Veterinario eliminato con successo!');
        }
    }
}

// Inizializza il manager quando la pagina è caricata
let veterinariManager;
document.addEventListener('DOMContentLoaded', () => {
    veterinariManager = new VeterinariManager();
});

// Funzione globale per chiudere il modal
function closeModal() {
    veterinariManager.closeModal();
}