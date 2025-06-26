class ModuloAdozioneManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setDefaultDate();
        this.loadSampleData();
    }

    bindEvents() {
        const form = document.getElementById('moduloAdozioneForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveForm();
            });
        }

        // Auto-save on input change
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.autoSave();
            });
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dataAdozione').value = today;
    }

    loadSampleData() {
        // Carica dati di esempio per facilitare i test
        const urlParams = new URLSearchParams(window.location.search);
        const sample = urlParams.get('sample');
        
        if (sample === 'true') {
            document.getElementById('nomeAnimale').value = 'Buddy';
            document.getElementById('tipoAnimale').value = 'Cane';
            document.getElementById('razzaAnimale').value = 'Golden Retriever';
            document.getElementById('etaAnimale').value = '3';
            document.getElementById('nomeAdottante').value = 'Mario';
            document.getElementById('cognomeAdottante').value = 'Rossi';
            document.getElementById('emailAdottante').value = 'mario.rossi@email.com';
            document.getElementById('telefonoAdottante').value = '123-456-7890';
            document.getElementById('indirizzoAdottante').value = 'Via Roma 123, Milano';
            document.getElementById('statoAdozione').value = 'In Attesa';
            document.getElementById('noteAdozione').value = 'Adottante molto motivato e con esperienza con cani di taglia grande.';
        }
    }

    validateForm() {
        const requiredFields = [
            'nomeAnimale',
            'nomeAdottante', 
            'cognomeAdottante',
            'dataAdozione'
        ];

        let isValid = true;
        let errors = [];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                errors.push(`Il campo ${field.previousElementSibling.textContent} è obbligatorio`);
            } else {
                field.classList.remove('error');
            }
        });

        // Validazione email
        const email = document.getElementById('emailAdottante').value;
        if (email && !this.isValidEmail(email)) {
            isValid = false;
            document.getElementById('emailAdottante').classList.add('error');
            errors.push('Inserisci un indirizzo email valido');
        }

        // Validazione data
        const dataAdozione = new Date(document.getElementById('dataAdozione').value);
        const oggi = new Date();
        if (dataAdozione < oggi.setHours(0,0,0,0)) {
            isValid = false;
            document.getElementById('dataAdozione').classList.add('error');
            errors.push('La data di adozione non può essere nel passato');
        }

        if (!isValid) {
            alert('Errori nel modulo:\n' + errors.join('\n'));
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getFormData() {
        return {
            animale: {
                nome: document.getElementById('nomeAnimale').value,
                tipo: document.getElementById('tipoAnimale').value,
                razza: document.getElementById('razzaAnimale').value,
                eta: document.getElementById('etaAnimale').value
            },
            adottante: {
                nome: document.getElementById('nomeAdottante').value,
                cognome: document.getElementById('cognomeAdottante').value,
                email: document.getElementById('emailAdottante').value,
                telefono: document.getElementById('telefonoAdottante').value,
                indirizzo: document.getElementById('indirizzoAdottante').value
            },
            adozione: {
                data: document.getElementById('dataAdozione').value,
                stato: document.getElementById('statoAdozione').value,
                note: document.getElementById('noteAdozione').value
            }
        };
    }

    saveForm() {
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        
        // Simula il salvataggio
        console.log('Dati modulo adozione:', formData);
        
        // TODO: Implementare chiamata API
        // fetch('/api/adozioni/modulo', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(formData)
        // })

        alert('Modulo di adozione salvato con successo!');
        
        // Opzionalmente reindirizza alla pagina adozioni
        if (confirm('Vuoi tornare alla pagina delle adozioni?')) {
            window.location.href = 'adozioni.html';
        }
    }

    autoSave() {
        const formData = this.getFormData();
        localStorage.setItem('moduloAdozione_draft', JSON.stringify(formData));
        
        // Mostra indicatore di salvataggio automatico
        this.showAutoSaveIndicator();
    }

    showAutoSaveIndicator() {
        let indicator = document.getElementById('autoSaveIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'autoSaveIndicator';
            indicator.className = 'auto-save-indicator';
            indicator.innerHTML = '<i class="fas fa-check"></i> Salvato automaticamente';
            document.querySelector('.page-header').appendChild(indicator);
        }
        
        indicator.style.display = 'block';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 2000);
    }

    loadDraft() {
        const draft = localStorage.getItem('moduloAdozione_draft');
        if (draft && confirm('È stata trovata una bozza salvata. Vuoi caricarla?')) {
            const data = JSON.parse(draft);
            
            // Carica dati animale
            document.getElementById('nomeAnimale').value = data.animale.nome || '';
            document.getElementById('tipoAnimale').value = data.animale.tipo || 'Cane';
            document.getElementById('razzaAnimale').value = data.animale.razza || '';
            document.getElementById('etaAnimale').value = data.animale.eta || '';
            
            // Carica dati adottante
            document.getElementById('nomeAdottante').value = data.adottante.nome || '';
            document.getElementById('cognomeAdottante').value = data.adottante.cognome || '';
            document.getElementById('emailAdottante').value = data.adottante.email || '';
            document.getElementById('telefonoAdottante').value = data.adottante.telefono || '';
            document.getElementById('indirizzoAdottante').value = data.adottante.indirizzo || '';
            
            // Carica dati adozione
            document.getElementById('dataAdozione').value = data.adozione.data || '';
            document.getElementById('statoAdozione').value = data.adozione.stato || 'In Attesa';
            document.getElementById('noteAdozione').value = data.adozione.note || '';
        }
    }
}

// Funzioni globali per i pulsanti
function resetForm() {
    if (confirm('Sei sicuro di voler resettare il modulo? Tutti i dati inseriti andranno persi.')) {
        document.getElementById('moduloAdozioneForm').reset();
        localStorage.removeItem('moduloAdozione_draft');
        
        // Reimposta la data di default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dataAdozione').value = today;
        
        // Rimuovi classi di errore
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
}

function previewForm() {
    const manager = window.moduloAdozioneManager;
    const formData = manager.getFormData();
    
    const previewContent = `
        <div class="preview-section">
            <h3><i class="fas fa-paw"></i> Informazioni Animale</h3>
            <p><strong>Nome:</strong> ${formData.animale.nome || 'Non specificato'}</p>
            <p><strong>Tipo:</strong> ${formData.animale.tipo}</p>
            <p><strong>Razza:</strong> ${formData.animale.razza || 'Non specificata'}</p>
            <p><strong>Età:</strong> ${formData.animale.eta ? formData.animale.eta + ' anni' : 'Non specificata'}</p>
        </div>
        
        <div class="preview-section">
            <h3><i class="fas fa-user"></i> Informazioni Adottante</h3>
            <p><strong>Nome:</strong> ${formData.adottante.nome} ${formData.adottante.cognome}</p>
            <p><strong>Email:</strong> ${formData.adottante.email || 'Non specificata'}</p>
            <p><strong>Telefono:</strong> ${formData.adottante.telefono || 'Non specificato'}</p>
            <p><strong>Indirizzo:</strong> ${formData.adottante.indirizzo || 'Non specificato'}</p>
        </div>
        
        <div class="preview-section">
            <h3><i class="fas fa-calendar"></i> Informazioni Adozione</h3>
            <p><strong>Data:</strong> ${formData.adozione.data ? new Date(formData.adozione.data).toLocaleDateString('it-IT') : 'Non specificata'}</p>
            <p><strong>Stato:</strong> ${formData.adozione.stato}</p>
            <p><strong>Note:</strong> ${formData.adozione.note || 'Nessuna nota'}</p>
        </div>
    `;
    
    document.getElementById('previewContent').innerHTML = previewContent;
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function printPreview() {
    const printContent = document.getElementById('previewContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Modulo di Adozione - PetFlix</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .preview-section { margin-bottom: 20px; }
                    h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                    p { margin: 5px 0; }
                </style>
            </head>
            <body>
                <h1>Modulo di Adozione - PetFlix</h1>
                ${printContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Inizializza il manager quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    window.moduloAdozioneManager = new ModuloAdozioneManager();
    
    // Carica bozza se disponibile
    setTimeout(() => {
        window.moduloAdozioneManager.loadDraft();
    }, 500);
});

// Chiudi modal cliccando fuori
window.addEventListener('click', (e) => {
    const modal = document.getElementById('previewModal');
    if (e.target === modal) {
        closePreview();
    }
});