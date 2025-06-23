package com.petflix.petflix.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petflix.petflix.model.Box;
import com.petflix.petflix.services.BoxServiceImpl;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("box")
public class BoxREST {

    @Autowired
    private BoxServiceImpl boxService;

    @GetMapping
    public List<Box> getBoxes() {
        return boxService.findAllBox();
    }

    @GetMapping("/{id}")
    public Box getBox(@PathVariable int id) {
        return boxService.findBoxById(id).orElse(null);
    }

    @GetMapping("/nome/{nome}")
    public Box getBoxByNome(@PathVariable String nome) {
        return boxService.findBoxByNome(nome).orElse(null);
    }

    @GetMapping("/capienza/{capienza}")
    public List<Box> getBoxByCapienzaMinima(@PathVariable int capienza) {
        return boxService.findBoxByCapienzaMinima(capienza);
    }

    @PostMapping()
    public Box addBox(@RequestBody Box box) {
        return boxService.saveBox(box);
    }

    @PutMapping("/{id}")
    public Box updateBox(@PathVariable int id, @RequestBody Box box) {
        box.setId_box(id);
        return boxService.updateBox(id, box);
    }

    @DeleteMapping("/{id}")
    public void deleteBox(@PathVariable int id) {
        boxService.deleteById(id);
    }

    @PatchMapping("/{id}")
    public Box patchBox(@PathVariable int id, @RequestBody Box box) {
        return boxService.updateBox(id, box);
    }
}