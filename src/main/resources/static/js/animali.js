class AnimaliManager {
    constructor() {
        this.animali = [];
        this.currentAnimaleId = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderTable();
        this.populateFilterOptions();
    }

    async loadData() {
        try {
            const response = await fetch('/animali');
            if (!response.ok) throw new Error('Errore nel caricamento degli animali');
            this.animali = await response.json();
            this.renderTable();
            this.populateFilterOptions();
        } catch (error) {
            alert('Errore nel caricamento degli animali: ' + error.message);
        }
    }

    setupEventListeners() {
        document.getElementById('addAnimaleBtn').addEventListener('click', () => this.openModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterTable(e.target.value));
        document.getElementById('animaleForm').addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('animaleModal')) {
                this.closeModal();
            }
        });
    }

    renderTable() {
        const tbody = document.getElementById('animaliTableBody');
        tbody.innerHTML = '';

        this.animali.forEach(animale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animale.id_animale}</td>
                <td>${animale.nome}</td>
                <td>${animale.specie}</td>
                <td>${animale.razza}</td>
                <td>${animale.microchip}</td>
                <td>${new Date(animale.data_arrivo).toLocaleDateString('it-IT')}</td>
                <td><span class="badge badge-${this.getStatoBadgeClass(animale.stato)}">${animale.stato}</span></td>
                <td>${animale.box_nome || '-'}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="animaliManager.editAnimale(${animale.id_animale})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="animaliManager.deleteAnimale(${animale.id_animale})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getStatoBadgeClass(stato) {
        switch(stato) {
            case 'Adottabile': return 'success';
            case 'In cura': return 'warning';
            case 'In osservazione': return 'info';
            case 'Adottato': return 'secondary';
            default: return 'secondary';
        }
    }

    filterTable(searchTerm) {
        const rows = document.querySelectorAll('#animaliTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    openModal(animaleId = null) {
        this.currentAnimaleId = animaleId;
        const modal = document.getElementById('animaleModal');
        const title = document.getElementById('modalTitle');
        
        if (animaleId) {
            title.textContent = 'Modifica Animale';
            this.populateForm(animaleId);
        } else {
            title.textContent = 'Nuovo Animale';
            document.getElementById('animaleForm').reset();
        }
        
        modal.style.display = 'block';
    }

    populateForm(animaleId) {
        const animale = this.animali.find(a => a.id_animale === animaleId);
        if (animale) {
            document.getElementById('nome').value = animale.nome;
            document.getElementById('specie').value = animale.specie;
            document.getElementById('razza').value = animale.razza;
            document.getElementById('microchip').value = animale.microchip;
            document.getElementById('dataArrivo').value = animale.data_arrivo;
            document.getElementById('stato').value = animale.stato;
            document.getElementById('backstories').value = animale.backstories || '';
        }
    }

    closeModal() {
        document.getElementById('animaleModal').style.display = 'none';
        this.currentAnimaleId = null;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            nome: document.getElementById('nome').value,
            specie: document.getElementById('specie').value,
            razza: document.getElementById('razza').value,
            microchip: document.getElementById('microchip').value,
            data_arrivo: document.getElementById('dataArrivo').value,
            stato: document.getElementById('stato').value,
            backstories: document.getElementById('backstories').value
        };

        if (this.currentAnimaleId) {
            this.updateAnimale(this.currentAnimaleId, formData);
        } else {
            this.addAnimale(formData);
        }
    }

    async addAnimale(data) {
        try {
            const response = await fetch('/api/animali', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Errore durante la creazione');
            this.closeModal();
            this.loadData();
            alert('Animale aggiunto con successo!');
        } catch (error) {
            alert('Errore durante la creazione: ' + error.message);
        }
    }

    async updateAnimale(id, data) {
        try {
            const response = await fetch(`/animali/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Errore durante la modifica');
            this.closeModal();
            this.loadData();
            alert('Animale aggiornato con successo!');
        } catch (error) {
            alert('Errore durante la modifica: ' + error.message);
        }
    }

    editAnimale(id) {
        this.openModal(id);
    }

    async deleteAnimale(id) {
        if (confirm('Sei sicuro di voler eliminare questo animale?')) {
            try {
                const response = await fetch(`/animali/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Errore durante l\'eliminazione');
                this.loadData();
                alert('Animale eliminato con successo!');
            } catch (error) {
                alert('Errore durante l\'eliminazione: ' + error.message);
            }
        }
    }

    populateFilterOptions() {
        // Popola filtro razze
        const razze = [...new Set(this.animali.map(a => a.razza))].sort();
        const razzaSelect = document.getElementById('razzaFilter');
        razze.forEach(razza => {
            const option = document.createElement('option');
            option.value = razza;
            option.textContent = razza;
            razzaSelect.appendChild(option);
        });

        // Popola filtro box
        const boxes = [...new Set(this.animali.map(a => a.box_nome))].sort();
        const boxSelect = document.getElementById('boxFilter');
        boxes.forEach(box => {
            const option = document.createElement('option');
            option.value = box;
            option.textContent = box;
            boxSelect.appendChild(option);
        });

        // Aggiungi event listeners per i filtri
        document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());
        document.getElementById('sessoFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('razzaFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('boxFilter').addEventListener('change', () => this.applyFilters());
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const sessoFilter = document.getElementById('sessoFilter').value;
        const razzaFilter = document.getElementById('razzaFilter').value;
        const boxFilter = document.getElementById('boxFilter').value;

        const rows = document.querySelectorAll('#animaliTableBody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const nome = cells[1].textContent.toLowerCase();
            const razza = cells[3].textContent;
            const box = cells[7].textContent;
            
            // Assumiamo che il sesso sia nel backstory o aggiungiamo un campo
            // Per ora filtriamo solo per nome, razza e box
            const matchesSearch = nome.includes(searchTerm);
            const matchesRazza = !razzaFilter || razza === razzaFilter;
            const matchesBox = !boxFilter || box === boxFilter;
            
            const isVisible = matchesSearch && matchesRazza && matchesBox;
            row.style.display = isVisible ? '' : 'none';
        });
    }
}

// Inizializza il manager quando la pagina è caricata
let animaliManager;
document.addEventListener('DOMContentLoaded', () => {
    animaliManager = new AnimaliManager();
});

// Funzione globale per chiudere il modal
function closeModal() {
    animaliManager.closeModal();
}

// Funzione globale per resettare i filtri
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('sessoFilter').value = '';
    document.getElementById('razzaFilter').value = '';
    document.getElementById('boxFilter').value = '';
    animaliManager.applyFilters();
}