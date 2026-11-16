package com.clinica.fichas.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos de entrada para registrar o actualizar una ficha clínica nutricional")
public class FichaClinicaRequestDTO {

    @NotBlank(message = "El RUT del paciente es obligatorio")
    @Size(max = 9, min = 8, message = "El RUT debe tener 8 o 9 caracteres sin puntos ni guion")
    @Schema(
        description = "RUT del paciente (con o sin puntos/guion)",
        example = "188663338")
    private String rutPaciente;

    @Schema(
        description = "Fecha de la medición (si se omite, toma la fecha actual)",
        example = "2026-11-14")
    private LocalDate fecha;

    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "1.0", message = "El peso debe ser mayor a 0")
    @Positive 
    @Schema(
        description = "Peso corporal en kilogramos",
        example = "68.5")
    private Double pesoKg;

    @NotNull(message = "La talla es obligatoria")
    @DecimalMin(value = "30.0", message = "La talla debe ser válida en centímetros", inclusive = true)
    @Positive 
    @Schema(
        description = "Talla o estatura en centímetros",
        example = "165.0")
    private Double tallaCm;

    @NotNull(message = "La medida de cintura es obligatoria")
    @DecimalMin(value = "20.0", message = "La medida de cintura debe ser válida en centímetros")
    @Positive 
    @Schema(
        description = "Perímetro de cintura en centímetros",
        example = "78.5")
    private Double cinturaCm;

    @NotBlank(message = "El plan alimenticio es obligatorio")
    @Schema(
        description = "Indicaciones y plan alimenticio digital",
        example = "Pauta hipocalórica balanceada de 1800 kcal distribuida en 4 comidas diarias")
    private String planAlimenticio;

    @Schema(
        description = "Observaciones clínicas opcionales",
        example = "Control registrado digitalmente")
    private String observaciones;

    @NotBlank(message = "El nombre del nutricionista es obligatorio")
    @Size(max = 150, message = "El nombre del nutricionista no puede exceder los 150 caracteres")
    @Schema(
        description = "Nombre completo del profesional nutricionista",
        example = "Camila Soto")
    private String nutricionista;
}