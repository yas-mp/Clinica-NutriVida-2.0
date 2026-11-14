package com.clinica.reservas.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "DTO de respuesta con los datos detallados de una reserva médica")
public class ReservaResponseDTO {

    @Schema(
        description = "ID único de la reserva", 
        example = "1")
    private Long id;

    @Schema(
        description = "RUT del paciente asociado a la cita", 
        example = "188663338")
    private String rutPaciente;

    @Schema(
        description = "Nombre del servicio nutricional agendado", 
        example = "Consulta Nutricional Integral")
    private String servicio;

    @Schema(
        description = "Nombre del profesional asignado", 
        example = "Dra. Camila Soto")
    private String profesional;

    @Schema(
        description = "Motivo de la consulta registrado por el paciente", 
        example = "Control nutricional y plan de alimentación")
    private String motivo;

    @Schema(
        description = "Fecha programada de la atención", 
        example = "2026-11-20")
    private LocalDate fecha;

    @Schema(
        description = "Bloque horario de la atención", 
        example = "10:00")
    private String hora;

    @Schema(
        description = "Estado actual de la reserva", 
        example = "Pendiente")
    private String estado;

    @Schema(
        description = "Indica si el recordatorio de la cita fue enviado", 
        example = "true")
    private Boolean recordatorioEnviado;

    @Schema(
        description = "Fecha y hora de creación del registro", 
        example = "2026-11-14T18:10:00")
    private LocalDateTime fechaCreacion;
}