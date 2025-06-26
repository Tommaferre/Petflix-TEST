class CartelleClinicheManager {
    constructor() {
        this.cartelle = [];
        this.animali = [];
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
            { id: 1, nome: 'Buddy', specie: 'Cane', razza: 'Golden Retriever' },
            { id: 2, nome: 'Whiskers', specie: 'Gatto', razza: 'Persiano' },
            { id: 3, nome: 'Max', specie: 'Cane', razza: 'Pastore Tedesco' }
        ];

        this.cartelle = [
            {
                id: 1,
                animale_id: 1,
                data_creazione: '2024-01-10',
                peso: 25.5,
                altezza: 60,
                stato_salute: 'buono',
                note: 'Animale in buone condizioni generali. Vaccinazioni aggiornate.'
            },
            {
                id: 2,
                animale_id: 2,
                data_creazione: '2024-01-15',
                peso: 4.2,
                altezza: 25,
                stato_salute: 'ottimo',
                note: 'Gatto sterilizzato, in perfetta salute.'
            },
            {
                id: 3,
                animale_id: 3,
                data_creazione: '2024-01-20',
                peso: 32.0,
                altezza: 65,
                stato_salute: 'discreto',
                note: 'Leggera zoppia alla zampa posteriore destra. Sotto osservazione.'
            }
        ];

        this.populateAnimaliSelect();
    }

    populateAnimaliSelect() {
        const select = document.getElementById('animaleSelect');
        select.innerHTML = '<option value="">Seleziona animale</option>';
        
        this.animali.forEach(animale => {
            select.innerHTML += `<option value="${animale.id}">${animale.nome} - ${animale.specie} (${animale.razza})</option>`;
        });
    }

    setupEventListeners() {
        document.getElementById('addCartellaBtn').addEventListener('click', () => this.openModal());
        document.getElementById('cartellaForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('cartellaModal')) {
                this.closeModal();
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('cartelleTableBody');
        tbody.innerHTML = '';

        this.cartelle.forEach(cartella => {
            const animale = this.animali.find(a => a.id === cartella.animale_id);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cartella.id}</td>
                <td>${animale ? `${animale.nome} (${animale.specie})` : 'N/A'}</td>
                <td>${new Date(cartella.data_creazione).toLocaleDateString('it-IT')}</td>
                <td>${cartella.peso}</td>
                <td>${cartella.altezza}</td>
                <td><span class="badge badge-${this.getStatoBadgeClass(cartella.stato_salute)}">${this.getStatoLabel(cartella.stato_salute)}</span></td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="cartelleManager.editCartella(${cartella.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="cartelleManager.deleteCartella(${cartella.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-info btn-small" onclick="cartelleManager.viewDetails(${cartella.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getStatoBadgeClass(stato) {
        switch(stato) {
            case 'ottimo': return 'success';
            case 'buono': return 'info';
            case 'discreto': return 'warning';
            case 'critico': return 'danger';
            default: return 'secondary';
        }
    }

    getStatoLabel(stato) {
        const labels = {
            'ottimo': 'Ottimo',
            'buono': 'Buono',
            'discreto': 'Discreto',
            'critico': 'Critico'
        };
        return labels[stato] || stato;
    }

    openModal(cartella = null) {
        const modal = document.getElementById('cartellaModal');
        const form = document.getElementById('cartellaForm');
        const title = document.getElementById('modalTitle');

        if (cartella) {
            title.textContent = 'Modifica Cartella Clinica';
            this.currentEditId = cartella.id;
            this.populateForm(cartella);
        } else {
            title.textContent = 'Nuova Cartella Clinica';
            this.currentEditId = null;
            form.reset();
            // Imposta la data corrente
            document.getElementById('dataCreazione').value = new Date().toISOString().split('T')[0];
        }

        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('cartellaModal').style.display = 'none';
        this.currentEditId = null;
    }

    populateForm(cartella) {
        document.getElementById('animaleSelect').value = cartella.animale_id;
        document.getElementById('dataCreazione').value = cartella.data_creazione;
        document.getElementById('peso').value = cartella.peso;
        document.getElementById('altezza').value = cartella.altezza;
        document.getElementById('statoSalute').value = cartella.stato_salute;
        document.getElementById('note').value = cartella.note || '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            animale_id: parseInt(document.getElementById('animaleSelect').value),
            data_creazione: document.getElementById('dataCreazione').value,
            peso: parseFloat(document.getElementById('peso').value),
            altezza: parseInt(document.getElementById('altezza').value),
            stato_salute: document.getElementById('statoSalute').value,
            note: document.getElementById('note').value
        };

        if (this.currentEditId) {
            this.updateCartella(this.currentEditId, formData);
        } else {
            this.addCartella(formData);
        }
    }

    addCartella(data) {
        const newId = Math.max(...this.cartelle.map(c => c.id), 0) + 1;
        const newCartella = { id: newId, ...data };
        this.cartelle.push(newCartella);
        this.renderTable();
        this.closeModal();
        alert('Cartella clinica aggiunta con successo!');
    }

    updateCartella(id, data) {
        const index = this.cartelle.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cartelle[index] = { ...this.cartelle[index], ...data };
            this.renderTable();
            this.closeModal();
            alert('Cartella clinica aggiornata con successo!');
        }
    }

    editCartella(id) {
        const cartella = this.cartelle.find(c => c.id === id);
        if (cartella) {
            this.openModal(cartella);
        }
    }

    deleteCartella(id) {
        if (confirm('Sei sicuro di voler eliminare questa cartella clinica?')) {
            this.cartelle = this.cartelle.filter(c => c.id !== id);
            this.renderTable();
            alert('Cartella clinica eliminata con successo!');
        }
    }

    viewDetails(id) {
        const cartella = this.cartelle.find(c => c.id === id);
        const animale = this.animali.find(a => a.id === cartella.animale_id);
        
        if (cartella) {
            alert(`Dettagli Cartella Clinica:\n\nAnimale: ${animale.nome} (${animale.specie})\nData: ${new Date(cartella.data_creazione).toLocaleDateString('it-IT')}\nPeso: ${cartella.peso} kg\nAltezza: ${cartella.altezza} cm\nStato: ${this.getStatoLabel(cartella.stato_salute)}\nNote: ${cartella.note || 'Nessuna nota'}`);
        }
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#cartelleTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm.toLowerCase());
            row.style.display = isVisible ? '' : 'none';
        });
    }
}

// Inizializza il manager quando la pagina è caricata
let cartelleManager;
document.addEventListener('DOMContentLoaded', () => {
    cartelleManager = new CartelleClinicheManager();
});