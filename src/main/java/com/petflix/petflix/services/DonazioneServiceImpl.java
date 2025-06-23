package com.petflix.petflix.services;
import com.petflix.petflix.model.Donazione;
import com.petflix.petflix.repos.DonazioneRepo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Service che gestisce la logica di business per le Donazioni.
 * Fornisce metodi per recuperare, salvare e cancellare donazioni.
 */
@Service // Indica che questa classe è un service gestito da Spring
public class DonazioneServiceImpl implements DonazioneService {
    private final DonazioneRepo donazioneRepository; // Repository per l'accesso ai dati delle donazioni

    /**
     * Costruttore con injection della repository tramite costruttore
     */
    public DonazioneServiceImpl(DonazioneRepo donazioneRepository) {
        this.donazioneRepository = donazioneRepository;
    }

    /**
     * Restituisce tutte le donazioni presenti nel database
     */
    public List<Donazione> findAll() {
        return donazioneRepository.findAll();
    }

    /**
     * Cerca una donazione per ID
     */
    public Optional<Donazione> findById(Integer id) {
        return donazioneRepository.findById(id);
    }

    /**
     * Salva una nuova donazione o aggiorna una esistente
     */
    public Donazione save(Donazione donazione) {
        return donazioneRepository.save(donazione);
    }

    /**
     * Cancella una donazione tramite ID
     */
    public void deleteById(Integer id) {
        donazioneRepository.deleteById(id);
    }
}
