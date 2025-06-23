package com.petflix.petflix.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.petflix.petflix.model.Animale;
import com.petflix.petflix.repos.AnimaleRepo;

@Service
public class AnimaleServiceImpl implements AnimaleService {

    @Autowired
    private AnimaleRepo animaleRepo;

    @Override
    public List<Animale> findAllAnimali() {
        return animaleRepo.findAll();
    }

    @Override
    public Optional<Animale> findAnimaleById(Integer id_animale) {
        return animaleRepo.findById(id_animale);
    }

    @Override
    public Optional<Animale> findAnimaleByMicrochip(String microchip) {
        return animaleRepo.findByMicrochip(microchip);
    }

    @Override
    public List<Animale> findAnimaliByNome(String nome) {
        return animaleRepo.findByNome(nome);
    }

    @Override
    public List<Animale> findAnimaliBySpecie(String specie) {
        return animaleRepo.findBySpecie(specie);
    }

    @Override
    public List<Animale> findAnimaliByStato(String stato) {
        return animaleRepo.findByStato(stato);
    }

    @Override
    public List<Animale> findByIdBox(Integer idBox) {
        return animaleRepo.findByIdBox(idBox);
    }

    @Override
    public Optional<Animale> findByIdCartellaClinica(Integer id_cartella_clinica) {
        return animaleRepo.findByIdCartellaClinica(id_cartella_clinica);
    }

    @Override
    public Animale saveAnimale(Animale animale) {
        return animaleRepo.save(animale);
    }

    @Override
    public Animale updateAnimale(Integer id, Animale animaleDetails) {
        Animale animale = animaleRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Animale non trovato con id: " + id));

        animale.setIdBox(animaleDetails.getIdBox());
        animale.setIdCartellaClinica(animaleDetails.getIdCartellaClinica());
        animale.setMicrochip(animaleDetails.getMicrochip());
        animale.setNome(animaleDetails.getNome());
        animale.setSpecie(animaleDetails.getSpecie());
        animale.setRazza(animaleDetails.getRazza());
        animale.setDataArrivo(animaleDetails.getDataArrivo());
        animale.setStato(animaleDetails.getStato());

        return animaleRepo.save(animale);
    }

    @Override
    public void deleteById(Integer id) {
        animaleRepo.deleteById(id);
    }
}
