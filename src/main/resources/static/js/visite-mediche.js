class VisiteMedicheManager {
    constructor() {
        this.visite = [];
        this.animali = [];
        this.veterinari = [];
        this.currentVisitaId = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTable();
    }

    loadData() {
        // Dati dalle visite veterinarie (corrispondenti a data-test.sql)
        this.visite = [
            {
                id: 1,
                id_animale: 1,
                animale_nome: 'Luna',
                id_dottore_veterinario: 2,
                veterinario_nome: 'Dr.ssa Anna Rossi',
                data_visita: '2024-05-01',
                tipo_visita: 'Vaccinazione',
                terapia: 'Nessuna',
                farmaci: 'Nessuno',
                controllo: false,
                costo: 50.00,
                note: 'Prima vaccinazione annuale'
            },
            {
                id: 2,
                id_animale: 2,
                animale_nome: 'Rex',
                id_dottore_veterinario: 1,
                veterinario_nome: 'Dr. Marco Veterinari',
                data_visita: '2024-05-10',
                tipo_visita: 'Controllo Dieta',
                terapia: 'Dieta',
                farmaci: 'Nessuno',
                controllo: true,
                costo: 40.00,
                note: 'Controllo peso, follow-up necessario'
            },
            {
                id: 3,
                id_animale: 3,
                animale_nome: 'Maya',
                id_dottore_veterinario: 3,
                veterinario_nome: 'Dr. Luigi Bianchi',
                data_visita: '2024-06-15',
                tipo_visita: 'Chirurgia',
                terapia: 'Antibiotici',
                farmaci: 'Amoxicillina',
                controllo: false,
                costo: 200.00,
                note: 'Rimozione cisti, recupero previsto 2 settimane'
            },
            {
                id: 4,
                id_animale: 4,
                animale_nome: 'Toby',
                id_dottore_veterinario: 2,
                veterinario_nome: 'Dr.ssa Anna Rossi',
                data_visita: '2024-04-20',
                tipo_visita: 'Controllo Generale',
                terapia: 'Nessuna',
                farmaci: 'Nessuno',
                controllo: false,
                costo: 35.00,
                note: 'Animale in buona salute'
            },
            {
                id: 5,
                id_animale: 5,
                animale_nome: 'Nina',
                id_dottore_veterinario: 1,
                veterinario_nome: 'Dr. Marco Veterinari',
                data_visita: '2024-06-01',
                tipo_visita: 'Terapia Antinfiammatoria',
                terapia: 'Antinfiammatorio',
                farmaci: 'Ibuprofene',
                controllo: true,
                costo: 60.00,
                note: 'Dolore articolare, rivalutazione tra 1 mese'
            }
        ];

        this.animali = [
            { id: 1, nome: 'Luna' },
            { id: 2, nome: 'Rex' },
            { id: 3, nome: 'Maya' },
            { id: 4, nome: 'Toby' },
            { id: 5, nome: 'Nina' }
        ];

        this.veterinari = [
            { id: 1, nome: 'Dr. Marco', cognome: 'Veterinari' },
            { id: 2, nome: 'Dr.ssa Anna', cognome: 'Rossi' },
            { id: 3, nome: 'Dr. Luigi', cognome: 'Bianchi' }
        ];
    }

    setupEventListeners() {
        document.getElementById('addVisitaBtn').addEventListener('click', () => this.openModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
        document.getElementById('visitaForm').addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('visitaModal')) {
                this.closeModal();
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('visiteMedicheTableBody');
        tbody.innerHTML = '';

        this.visite.forEach(visita => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${visita.id}</td>
                <td>${visita.animale_nome}</td>
                <td>${visita.veterinario_nome}</td>
                <td>${new Date(visita.data_visita).toLocaleDateString('it-IT')}</td>
                <td>${visita.tipo_visita}</td>
                <td>€${visita.costo.toFixed(2)}</td>
                <td><span class="badge badge-${visita.controllo ? 'warning' : 'success'}">${visita.controllo ? 'Necessario' : 'Non Necessario'}</span></td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="visiteMedicheManager.editVisita(${visita.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="visiteMedicheManager.deleteVisita(${visita.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#visiteMedicheTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    openModal(visitaId = null) {
        this.currentVisitaId = visitaId;
        const modal = document.getElementById('visitaModal');
        const title = document.getElementById('modalTitle');
        
        // Popola le select
        this.populateAnimaliSelect();
        this.populateVeterinariSelect();
        
        if (visitaId) {
            title.textContent = 'Modifica Visita Medica';
            this.populateForm(visitaId);
        } else {
            title.textContent = 'Nuova Visita Medica';
            document.getElementById('visitaForm').reset();
        }
        
        modal.style.display = 'block';
    }

    populateAnimaliSelect() {
        const select = document.getElementById('animaleSelect');
        select.innerHTML = '<option value="">Seleziona animale</option>';
        this.animali.forEach(animale => {
            select.innerHTML += `<option value="${animale.id}">${animale.nome}</option>`;
        });
    }

    populateVeterinariSelect() {
        const select = document.getElementById('veterinarioSelect');
        select.innerHTML = '<option value="">Seleziona veterinario</option>';
        this.veterinari.forEach(veterinario => {
            select.innerHTML += `<option value="${veterinario.id}">${veterinario.nome} ${veterinario.cognome}</option>`;
        });
    }

    populateForm(visitaId) {
        const visita = this.visite.find(v => v.id === visitaId);
        if (visita) {
            document.getElementById('animaleSelect').value = visita.id_animale;
            document.getElementById('veterinarioSelect').value = visita.id_dottore_veterinario;
            document.getElementById('dataVisita').value = visita.data_visita;
            document.getElementById('tipoVisita').value = visita.tipo_visita;
            document.getElementById('costo').value = visita.costo;
            document.getElementById('controllo').value = visita.controllo.toString();
            document.getElementById('terapia').value = visita.terapia || '';
            document.getElementById('farmaci').value = visita.farmaci || '';
            document.getElementById('note').value = visita.note || '';
        }
    }

    closeModal() {
        document.getElementById('visitaModal').style.display = 'none';
        this.currentVisitaId = null;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id_animale: parseInt(document.getElementById('animaleSelect').value),
            id_dottore_veterinario: parseInt(document.getElementById('veterinarioSelect').value),
            data_visita: document.getElementById('dataVisita').value,
            tipo_visita: document.getElementById('tipoVisita').value,
            costo: parseFloat(document.getElementById('costo').value),
            controllo: document.getElementById('controllo').value === 'true',
            terapia: document.getElementById('terapia').value,
            farmaci: document.getElementById('farmaci').value,
            note: document.getElementById('note').value
        };

        if (this.currentVisitaId) {
            this.updateVisita(this.currentVisitaId, formData);
        } else {
            this.addVisita(formData);
        }
    }

    addVisita(data) {
        const newId = Math.max(...this.visite.map(v => v.id)) + 1;
        const animale = this.animali.find(a => a.id === data.id_animale);
        const veterinario = this.veterinari.find(v => v.id === data.id_dottore_veterinario);
        
        const newVisita = {
            id: newId,
            ...data,
            animale_nome: animale.nome,
            veterinario_nome: `${veterinario.nome} ${veterinario.cognome}`
        };
        
        this.visite.push(newVisita);
        this.renderTable();
        this.closeModal();
        alert('Visita medica aggiunta con successo!');
    }

    updateVisita(id, data) {
        const index = this.visite.findIndex(v => v.id === id);
        if (index !== -1) {
            const animale = this.animali.find(a => a.id === data.id_animale);
            const veterinario = this.veterinari.find(v => v.id === data.id_dottore_veterinario);
            
            this.visite[index] = {
                ...this.visite[index],
                ...data,
                animale_nome: animale.nome,
                veterinario_nome: `${veterinario.nome} ${veterinario.cognome}`
            };
            
            this.renderTable();
            this.closeModal();
            alert('Visita medica aggiornata con successo!');
        }
    }

    editVisita(id) {
        this.openModal(id);
    }

    deleteVisita(id) {
        if (confirm('Sei sicuro di voler eliminare questa visita medica?')) {
            this.visite = this.visite.filter(v => v.id !== id);
            this.renderTable();
            alert('Visita medica eliminata con successo!');
        }
    }
}

// Inizializza il manager quando la pagina è caricata
let visiteMedicheManager;
document.addEventListener('DOMContentLoaded', () => {
    visiteMedicheManager = new VisiteMedicheManager();
});

// Funzione globale per chiudere il modal
function closeModal() {
    visiteMedicheManager.closeModal();
}