-- dati fake animali

INSERT INTO animali (
    id_box,
    id_cartella_clinica,
    microchip,
    nome,
    specie,
    razza,
    data_arrivo,
    stato,
    backstories
) VALUES
(1, 101, 'ABC123456789', 'Luna', 'Gatto', 'Siberiano', '2023-11-05', 'Adottabile', 'Trovata vicino al parco, molto timida ma affettuosa.'),
(2, 102, 'XYZ987654321', 'Rex', 'Cane', 'Pastore Tedesco', '2024-02-10', 'In cura', 'Abbandonato, ha bisogno di cure veterinarie.'),
(3, 103, 'LMN456123789', 'Maya', 'Coniglio', 'Nano', '2024-05-15', 'Adottabile', 'Arrivata da poco, molto vivace e curiosa.'),
(1, 104, 'DEF321654987', 'Toby', 'Cane', 'Beagle', '2023-09-20', 'Adottato', 'Ha trovato una nuova casa, molto socievole.'),
(4, 105, 'GHI789456123', 'Nina', 'Gatto', 'Persiano', '2024-01-30', 'In osservazione', 'Malata, sotto controllo veterinario.');

-- dati fake donazioni

INSERT INTO donazioni (
    id_donatore,
    tipo, 
    contenuto, 
    data_emissione, 
    note_donatore
) VALUES
(1, 'monetario', '100.00', '2023-10-01', 'Prima donazione di prova'),
(2, 'cibo', 'crocchette', '2025-06-10', 'Seconda donazione di prova'),
(2, 'monetario', '150.00', '2025-06-10', 'Terza donazione di prova');

-- dati fake donatori

INSERT INTO donatori (
    nome,
    cognome,
    telefono,
    email,
    indirizzo
) VALUES
('Marco', 'Rossi', '3456789012', 'marco.rossi@example.com', 'Via Roma 10, Milano'),
('Giulia', 'Bianchi', '3298765432', 'giulia.bianchi@example.com', 'Corso Vittorio Emanuele 25, Torino'),
('Luca', 'Verdi', '3387654321', 'luca.verdi@example.com', 'Piazza Duomo 5, Firenze');

-- dati fake visite veterinarie

INSERT INTO visite_veterinarie (
    id_animale, 
    id_dottore_veterinario,  
    data_visita,
    tipo_visita, 
    terapia, 
    farmaci, 
    controllo,
    costo, 
    note
) 
VALUES 
(1, 2, '2024-05-01', 'Vaccinazione', 'Nessuna', 'Nessuno', false, 50.00, 'Prima vaccinazione annuale'),
(2, 1, '2024-05-10', 'Controllo Dieta', 'Dieta', 'Nessuno', true, 40.00, 'Controllo peso, follow-up necessario'),
(3, 3, '2024-06-15', 'Chirurgia', 'Antibiotici', 'Amoxicillina', false, 200.00, 'Rimozione cisti, recupero previsto 2 settimane'),
(4, 2, '2024-04-20', 'Controllo Generale', 'Nessuna', 'Nessuno', false, 35.00, 'Animale in buona salute'),
(5, 1, '2024-06-01', 'Terapia Antinfiammatoria', 'Antinfiammatorio', 'Ibuprofene', true, 60.00, 'Dolore articolare, rivalutazione tra 1 mese');

-- dati fake box

INSERT INTO box (
    nome,
    capienza
) VALUES
('Box Gatti A', 3),
('Box Cani Grande', 2),
('Box Conigli', 4),
('Box Gatti B', 3),
('Box Cani Piccoli', 4),
('Box Isolamento', 1),
('Box Cuccioli', 5),
('Box Quarantena', 2);