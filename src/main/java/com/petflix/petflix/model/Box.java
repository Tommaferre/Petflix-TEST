package com.petflix.petflix.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.*;

@Entity
@Table(name = "box")
@JsonPropertyOrder({
    "id_box",
    "nome",
    "capienza"
})
public class Box {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_box;

    private String nome;

    private Integer capienza;

    // Getters and Setters
    public Integer getId_box() {
        return id_box;
    }

    public void setId_box(Integer id_box) {
        this.id_box = id_box;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getCapienza() {
        return capienza;
    }

    public void setCapienza(Integer capienza) {
        this.capienza = capienza;
    }
}