package com.clinica.reservas.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaRequestDTO {

    @NotBlank(message = "El RUT del paciente es obligatorio")
    @Schema(description = "RUT del paciente que agenda la hora", example = "188663338")
    private String rutPaciente;

    @NotBlank(message = "El servicio es obligatorio")
    @Schema(description = "Nombre del servicio nutricional", example = "Consulta Nutricional Integral")
    private String servicio;

    @NotBlank(message = "El profesional es obligatorio")
    @Schema(description = "Nombre del nutricionista", example = "Dra. Camila Soto")
    private String profesional;

    @NotBlank(message = "El motivo es obligatorio")
    @Schema(description = "Motivo de la consulta", example = "Control nutricional y plan de alimentación")
    private String motivo;

    @NotNull(message = "La fecha es obligatoria")
    @Schema(description = "Fecha de la cita", example = "2026-11-20")
    private LocalDate fecha;

    @NotBlank(message = "La hora es obligatoria")
    @Schema(description = "Bloque horario de la cita", example = "10:00")
    private String hora;
}