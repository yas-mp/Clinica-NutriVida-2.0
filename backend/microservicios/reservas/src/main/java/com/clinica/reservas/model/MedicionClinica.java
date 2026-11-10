package com.clinica.reservas.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Entity 
@Table (name = "medicion_clinica")
public class MedicionClinica {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rut_paciente", nullable = false, length = 12)
    private String rutPaciente;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "peso_kg", nullable = false)
    private Double pesoKg;

    @Column(name = "talla_cm", nullable = false)
    private Double tallaCm;

    @Column(name = "cintura_cm", nullable = false)
    private Double cinturaCm;

    @Column(nullable = false)
    private Double imc;

    @Column(name = "plan_alimenticio", columnDefinition = "TEXT")
    private String planAlimenticio;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(nullable = false, length = 100)
    private String nutricionista;
    
}
