package com.clinica.fichas.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta con el detalle completo de la ficha clínica y su IMC calculado")
public class FichaClinicaResponseDTO {

    @Schema(
        description = "Identificador único de la ficha clínica",
        example = "1")
    private Long id;

    @Schema(
        description = "RUT del paciente",
        example = "188663338")
    private String rutPaciente;

    @Schema(
        description = "Fecha en que se realizó el control",
        example = "2026-11-14")
    private LocalDate fecha;

    @Schema(
        description = "Peso corporal en kilogramos",
        example = "68.5")
    private Double pesoKg;

    @Schema(
        description = "Talla o estatura en centímetros",
        example = "165.0")
    private Double tallaCm;

    @Schema(
        description = "Perímetro de cintura en centímetros",
        example = "78.5")
    private Double cinturaCm;

    @Schema(
        description = "Índice de Masa Corporal (IMC) calculado automáticamente",
        example = "25.2")
    private Double imc;

    @Schema(
        description = "Detalle del plan alimenticio asignado",
        example = "Pauta hipocalórica balanceada de 1800 kcal distribuida en 4 comidas diarias")
    private String planAlimenticio;

    @Schema(
        description = "Observaciones clínicas del control",
        example = "Control registrado digitalmente")
    private String observaciones;

    @Schema(
        description = "Nombre del nutricionista que registró la atención",
        example = "Camila Soto")
    private String nutricionista;

    @Schema(
        description = "Fecha y hora de creación del registro",
        example = "2026-11-14T19:40:00")
    private LocalDateTime fechaCreacion;
}