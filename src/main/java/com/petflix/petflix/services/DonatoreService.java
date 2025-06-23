package com.petflix.petflix.services;

import com.petflix.petflix.model.Donatore;
import java.util.List;

public interface DonatoreService {
    List<Donatore> getAllDonatori();
    Donatore getDonatoreById(int id_donatore);
    Donatore saveDonatore(Donatore donatore);
    void deleteDonatore(int id_donatore);
    void deleteAllDonatori();
    List<Donatore> updateAllDonatori(List<Donatore> donatori);
}
