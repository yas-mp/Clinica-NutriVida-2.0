package com.clinica.reservas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "citas_medicas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rut_paciente", nullable = false, length = 12)
    private String rutPaciente;

    @Column(nullable = false, length = 100)
    private String servicio;

    @Column(nullable = false, length = 100)
    private String profesional;

    @Column(nullable = false, length = 20)
    private String fecha; 

    @Column(nullable = false, length = 10)
    private String hora; 

    @Column(nullable = false, length = 30)
    private String estado; 
}