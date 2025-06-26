class AdozioniManager {
    constructor() {
        this.adozioni = [];
        this.animali = [];
        this.adottanti = [];
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTable();
    }

    loadData() {
        // Simulazione dati - sostituire con chiamate API reali
        this.animali = [
            { id: 1, nome: 'Buddy', specie: 'Cane' },
            { id: 2, nome: 'Whiskers', specie: 'Gatto' },
            { id: 3, nome: 'Max', specie: 'Cane' }
        ];

        this.adottanti = [
            { id: 1, nome: 'Mario', cognome: 'Rossi' },
            { id: 2, nome: 'Anna', cognome: 'Verdi' },
            { id: 3, nome: 'Luca', cognome: 'Bianchi' }
        ];

        this.adozioni = [
            {
                id: 1,
                animale_id: 1,
                adottante_id: 1,
                data_adozione: '2024-01-15',
                stato: 'completata',
                note: 'Adozione completata con successo'
            },
            {
                id: 2,
                animale_id: 2,
                adottante_id: 2,
                data_adozione: '2024-01-20',
                stato: 'in_corso',
                note: 'In attesa di completamento documenti'
            }
        ];

        this.populateSelects();
    }

    populateSelects() {
        const animaleSelect = document.getElementById('animaleSelect');
        const adottanteSelect = document.getElementById('adottanteSelect');

        // Popola select animali
        animaleSelect.innerHTML = '<option value="">Seleziona animale</option>';
        this.animali.forEach(animale => {
            animaleSelect.innerHTML += `<option value="${animale.id}">${animale.nome} (${animale.specie})</option>`;
        });

        // Popola select adottanti
        adottanteSelect.innerHTML = '<option value="">Seleziona adottante</option>';
        this.adottanti.forEach(adottante => {
            adottanteSelect.innerHTML += `<option value="${adottante.id}">${adottante.nome} ${adottante.cognome}</option>`;
        });
    }

    setupEventListeners() {
        document.getElementById('addAdozioneBtn').addEventListener('click', () => this.openModal());
        document.getElementById('adozioneForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('adozioneModal')) {
                this.closeModal();
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('adozioniTableBody');
        tbody.innerHTML = '';

        this.adozioni.forEach(adozione => {
            const animale = this.animali.find(a => a.id === adozione.animale_id);
            const adottante = this.adottanti.find(a => a.id === adozione.adottante_id);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${adozione.id}</td>
                <td>${animale ? `${animale.nome} (${animale.specie})` : 'N/A'}</td>
                <td>${adottante ? `${adottante.nome} ${adottante.cognome}` : 'N/A'}</td>
                <td>${new Date(adozione.data_adozione).toLocaleDateString('it-IT')}</td>
                <td><span class="badge badge-${this.getStatoBadgeClass(adozione.stato)}">${this.getStatoLabel(adozione.stato)}</span></td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="adopzioniManager.editAdozione(${adozione.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="adopzioniManager.deleteAdozione(${adozione.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getStatoBadgeClass(stato) {
        switch(stato) {
            case 'completata': return 'success';
            case 'in_corso': return 'warning';
            case 'annullata': return 'danger';
            default: return 'secondary';
        }
    }

    getStatoLabel(stato) {
        switch(stato) {
            case 'completata': return 'Completata';
            case 'in_corso': return 'In Corso';
            case 'annullata': return 'Annullata';
            default: return stato;
        }
    }

    openModal(adozione = null) {
        const modal = document.getElementById('adozioneModal');
        const form = document.getElementById('adozioneForm');
        const title = document.getElementById('modalTitle');

        if (adozione) {
            title.textContent = 'Modifica Adozione';
            this.currentEditId = adozione.id;
            this.populateForm(adozione);
        } else {
            title.textContent = 'Nuova Adozione';
            this.currentEditId = null;
            form.reset();
        }

        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('adozioneModal').style.display = 'none';
        this.currentEditId = null;
    }

    populateForm(adozione) {
        document.getElementById('animaleSelect').value = adozione.animale_id;
        document.getElementById('adottanteSelect').value = adozione.adottante_id;
        document.getElementById('dataAdozione').value = adozione.data_adozione;
        document.getElementById('statoAdozione').value = adozione.stato;
        document.getElementById('note').value = adozione.note || '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            animale_id: parseInt(document.getElementById('animaleSelect').value),
            adottante_id: parseInt(document.getElementById('adottanteSelect').value),
            data_adozione: document.getElementById('dataAdozione').value,
            stato: document.getElementById('statoAdozione').value,
            note: document.getElementById('note').value
        };

        if (this.currentEditId) {
            this.updateAdozione(this.currentEditId, formData);
        } else {
            this.addAdozione(formData);
        }
    }

    addAdozione(data) {
        const newId = Math.max(...this.adozioni.map(a => a.id), 0) + 1;
        const newAdozione = { id: newId, ...data };
        this.adozioni.push(newAdozione);
        this.renderTable();
        this.closeModal();
        alert('Adozione aggiunta con successo!');
    }

    updateAdozione(id, data) {
        const index = this.adozioni.findIndex(a => a.id === id);
        if (index !== -1) {
            this.adozioni[index] = { ...this.adozioni[index], ...data };
            this.renderTable();
            this.closeModal();
            alert('Adozione aggiornata con successo!');
        }
    }

    editAdozione(id) {
        const adozione = this.adozioni.find(a => a.id === id);
        if (adozione) {
            this.openModal(adozione);
        }
    }

    deleteAdozione(id) {
        if (confirm('Sei sicuro di voler eliminare questa adozione?')) {
            this.adozioni = this.adozioni.filter(a => a.id !== id);
            this.renderTable();
            alert('Adozione eliminata con successo!');
        }
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#adozioniTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm.toLowerCase());
            row.style.display = isVisible ? '' : 'none';
        });
    }
}

// Inizializza il manager quando la pagina è caricata
let adopzioniManager;
document.addEventListener('DOMContentLoaded', () => {
    adopzioniManager = new AdozioniManager();
});