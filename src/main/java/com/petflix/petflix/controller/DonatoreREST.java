package com.petflix.petflix.controller;

import com.petflix.petflix.model.Donatore; // Modello Donatore
import com.petflix.petflix.services.DonatoreService;

import org.springframework.beans.factory.annotation.Autowired; // Iniezione dipendenze
import org.springframework.web.bind.annotation.*; // RestController e mapping

import java.util.List; // Lista di oggetti

/**
 * Controller REST per la gestione dei Donatori.
 * Espone endpoint per operazioni CRUD sui donatori.
 */
@RestController // Indica che questa classe è un controller REST
@RequestMapping("/donatori") // Mappa tutte le richieste su /donatori
public class DonatoreREST {
    @Autowired // Inietta il service dei donatori
    private DonatoreService donatoreService;

    /**
     * Restituisce la lista di tutti i donatori.
     * Metodo: GET /donatori
     */
    @GetMapping
    public List<Donatore> getAllDonatori() {
        return donatoreService.getAllDonatori();
    }

    /**
     * Restituisce un donatore dato il suo id.
     * Metodo: GET /donatori/{id}
     * @param id_donatore identificativo del donatore
     */
    @GetMapping("/{id_donatore}")
    public Donatore getDonatoreById(@PathVariable int id_donatore) {
        return donatoreService.getDonatoreById(id_donatore);
    }

    /**
     * Salva un nuovo donatore o aggiorna uno esistente.
     * Metodo: POST /donatori
     * @param donatore oggetto Donatore da salvare
     */
    @PostMapping
    public Donatore saveDonatore(@RequestBody Donatore donatore) {
        return donatoreService.saveDonatore(donatore);
    }

    /**
     * Elimina un donatore dato il suo id.
     * Metodo: DELETE /donatori/{id}
     * @param id_donatore identificativo del donatore da eliminare
     */
    @DeleteMapping("/{id_donatore}")
    public void deleteDonatore(@PathVariable int id_donatore) {
        donatoreService.deleteDonatore(id_donatore);
    }

    /**
     * Aggiorna completamente un donatore esistente.
     * Metodo: PUT /donatori/{id}
     * @param id_donatore identificativo del donatore da aggiornare
     * @param donatore oggetto Donatore con i nuovi dati
     */
    @PutMapping("/{id_donatore}")
    public Donatore updateDonatore(@PathVariable int id_donatore, @RequestBody Donatore donatore) {
        Donatore esistente = donatoreService.getDonatoreById(id_donatore);
        if (esistente != null) {
            esistente.setNome(donatore.getNome());
            esistente.setCognome(donatore.getCognome());
            esistente.setEmail(donatore.getEmail());
            esistente.setIndirizzo(donatore.getIndirizzo());
            esistente.setTelefono(donatore.getTelefono());
            return donatoreService.saveDonatore(esistente);
        }
        return null;
    }

    /**
     * Aggiorna parzialmente un donatore esistente.
     * Metodo: PATCH /donatori/{id}
     * @param id_donatore identificativo del donatore da aggiornare
     * @param donatore oggetto Donatore con i campi da aggiornare
     */
    @PatchMapping("/{id_donatore}")
    public Donatore patchDonatore(@PathVariable int id_donatore, @RequestBody Donatore donatore) {
        Donatore esistente = donatoreService.getDonatoreById(id_donatore);
        if (esistente != null) {
            if (donatore.getNome() != null) esistente.setNome(donatore.getNome());
            if (donatore.getCognome() != null) esistente.setCognome(donatore.getCognome());
            if (donatore.getEmail() != null) esistente.setEmail(donatore.getEmail());
            if (donatore.getTelefono() != null) esistente.setTelefono(donatore.getTelefono());
            if (donatore.getIndirizzo() != null) esistente.setIndirizzo(donatore.getIndirizzo());
            return donatoreService.saveDonatore(esistente);
        }
        return null;
    }

    /**
     * Elimina tutti i donatori dal database.
     * Metodo: DELETE /donatori
     */
    @DeleteMapping
    public void deleteAllDonatori() {
        donatoreService.deleteAllDonatori();
    }

}
