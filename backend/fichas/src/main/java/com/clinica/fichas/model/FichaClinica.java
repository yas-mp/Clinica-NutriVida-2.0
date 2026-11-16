package com.clinica.fichas.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fichas_clinicas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que almacena el registro clínico, antropometría y plan alimenticio de un paciente")
public class FichaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(
        description = "Identificador único de la ficha clínica",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(name = "rut_paciente", nullable = false, length = 20)
    @Schema(
        description = "RUT del paciente asociado a la atención (sin puntos ni guion)",
        example = "188663338")
    private String rutPaciente;

    @Column(name = "fecha", nullable = false)
    @Schema(
        description = "Fecha en que se realiza el control nutricional",
        example = "2026-11-14")
    private LocalDate fecha;

    @Column(name = "peso_kg", nullable = false)
    @Schema(
        description = "Peso corporal del paciente expresado en kilogramos",
        example = "68.5")
    private Double pesoKg;

    @Column(name = "talla_cm", nullable = false)
    @Schema(
        description = "Estatura o talla del paciente expresada en centímetros",
        example = "165.0")
    private Double tallaCm;

    @Column(name = "cintura_cm", nullable = false)
    @Schema(
        description = "Perímetro de cintura del paciente expresado en centímetros",
        example = "78.5")
    private Double cinturaCm;

    @Column(name = "imc", nullable = false)
    @Schema(
        description = "Índice de Masa Corporal (IMC) calculado automáticamente",
        example = "25.2",
        accessMode = Schema.AccessMode.READ_ONLY)
    private Double imc;

    @Column(name = "plan_alimenticio", nullable = false, columnDefinition = "TEXT")
    @Schema(
        description = "Detalle de la pauta o plan alimenticio asignado al paciente",
        example = "Pauta hipocalórica balanceada de 1800 kcal distribuida en 4 comidas diarias")
    private String planAlimenticio;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    @Schema(
        description = "Observaciones clínicas adicionales del control",
        example = "Control registrado digitalmente")
    private String observaciones;

    @Column(name = "nutricionista", nullable = false, length = 150)
    @Schema(
        description = "Nombre completo del profesional nutricionista que realiza la atención",
        example = "Camila Soto")
    private String nutricionista;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @Schema(
        description = "Fecha y hora exacta de creación del registro en el sistema",
        example = "2026-11-14T19:30:00",
        accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.fecha == null) {
            this.fecha = LocalDate.now();
        }
    }
}