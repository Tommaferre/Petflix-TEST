class BoxManager {
    constructor() {
        this.boxes = [];
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
            { id: 1, nome: 'Buddy', specie: 'Cane' },
            { id: 2, nome: 'Whiskers', specie: 'Gatto' },
            { id: 3, nome: 'Max', specie: 'Cane' }
        ];

        this.boxes = [
            {
                id: 1,
                numero_box: 'A01',
                tipo: 'cani_medi',
                dimensioni: 12.5,
                stato: 'occupato',
                animale_id: 1,
                note: 'Box con accesso esterno'
            },
            {
                id: 2,
                numero_box: 'B03',
                tipo: 'gatti',
                dimensioni: 8.0,
                stato: 'libero',
                animale_id: null,
                note: 'Box climatizzato'
            },
            {
                id: 3,
                numero_box: 'C05',
                tipo: 'cani_grandi',
                dimensioni: 20.0,
                stato: 'manutenzione',
                animale_id: null,
                note: 'Riparazione recinzione in corso'
            }
        ];
    }

    setupEventListeners() {
        document.getElementById('addBoxBtn').addEventListener('click', () => this.openModal());
        document.getElementById('boxForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('boxModal')) {
                this.closeModal();
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('boxTableBody');
        tbody.innerHTML = '';

        this.boxes.forEach(box => {
            const animale = this.animali.find(a => a.id === box.animale_id);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${box.id}</td>
                <td>${box.numero_box}</td>
                <td>${this.getTipoLabel(box.tipo)}</td>
                <td>${box.dimensioni} mq</td>
                <td><span class="badge badge-${this.getStatoBadgeClass(box.stato)}">${this.getStatoLabel(box.stato)}</span></td>
                <td>${animale ? `${animale.nome} (${animale.specie})` : '-'}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="boxManager.editBox(${box.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="boxManager.deleteBox(${box.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getTipoLabel(tipo) {
        const labels = {
            'cani_piccoli': 'Cani Piccoli',
            'cani_medi': 'Cani Medi',
            'cani_grandi': 'Cani Grandi',
            'gatti': 'Gatti',
            'quarantena': 'Quarantena',
            'infermeria': 'Infermeria'
        };
        return labels[tipo] || tipo;
    }

    getStatoBadgeClass(stato) {
        switch(stato) {
            case 'libero': return 'success';
            case 'occupato': return 'info';
            case 'manutenzione': return 'warning';
            case 'pulizia': return 'secondary';
            default: return 'secondary';
        }
    }

    getStatoLabel(stato) {
        const labels = {
            'libero': 'Libero',
            'occupato': 'Occupato',
            'manutenzione': 'In Manutenzione',
            'pulizia': 'In Pulizia'
        };
        return labels[stato] || stato;
    }

    openModal(box = null) {
        const modal = document.getElementById('boxModal');
        const form = document.getElementById('boxForm');
        const title = document.getElementById('modalTitle');

        if (box) {
            title.textContent = 'Modifica Box';
            this.currentEditId = box.id;
            this.populateForm(box);
        } else {
            title.textContent = 'Nuovo Box';
            this.currentEditId = null;
            form.reset();
        }

        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('boxModal').style.display = 'none';
        this.currentEditId = null;
    }

    populateForm(box) {
        document.getElementById('numeroBox').value = box.numero_box;
        document.getElementById('tipoBox').value = box.tipo;
        document.getElementById('dimensioni').value = box.dimensioni;
        document.getElementById('statoBox').value = box.stato;
        document.getElementById('note').value = box.note || '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            numero_box: document.getElementById('numeroBox').value,
            tipo: document.getElementById('tipoBox').value,
            dimensioni: parseFloat(document.getElementById('dimensioni').value),
            stato: document.getElementById('statoBox').value,
            note: document.getElementById('note').value
        };

        if (this.currentEditId) {
            this.updateBox(this.currentEditId, formData);
        } else {
            this.addBox(formData);
        }
    }

    addBox(data) {
        const newId = Math.max(...this.boxes.map(b => b.id), 0) + 1;
        const newBox = { id: newId, animale_id: null, ...data };
        this.boxes.push(newBox);
        this.renderTable();
        this.closeModal();
        alert('Box aggiunto con successo!');
    }

    updateBox(id, data) {
        const index = this.boxes.findIndex(b => b.id === id);
        if (index !== -1) {
            this.boxes[index] = { ...this.boxes[index], ...data };
            this.renderTable();
            this.closeModal();
            alert('Box aggiornato con successo!');
        }
    }

    editBox(id) {
        const box = this.boxes.find(b => b.id === id);
        if (box) {
            this.openModal(box);
        }
    }

    deleteBox(id) {
        if (confirm('Sei sicuro di voler eliminare questo box?')) {
            this.boxes = this.boxes.filter(b => b.id !== id);
            this.renderTable();
            alert('Box eliminato con successo!');
        }
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#boxTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm.toLowerCase());
            row.style.display = isVisible ? '' : 'none';
        });
    }
}

// Inizializza il manager quando la pagina è caricata
let boxManager;
document.addEventListener('DOMContentLoaded', () => {
    boxManager = new BoxManager();
});