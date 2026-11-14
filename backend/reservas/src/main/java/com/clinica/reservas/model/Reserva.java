package com.clinica.reservas.model;

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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID de la reserva generada de forma automática",
            example = "1",
            accessMode = Schema.AccessMode.READ_ONLY
    )
    private Long id;

    @Column(name = "rut_paciente", nullable = false, length = 15)
    @Schema(description = "RUT del paciente que agenda la hora",
            example = "188663338",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String rutPaciente;

    @Column(name = "servicio", nullable = false, length = 120)
    @Schema(description = "Nombre del servicio nutricional seleccionado",
            example = "Consulta Nutricional Integral",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String servicio;

    @Column(name = "profesional", nullable = false, length = 120)
    @Schema(description = "Nombre del nutricionista asignado a la atención",
            example = "Dra. Camila Soto",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String profesional;

    @Column(name = "motivo", nullable = false, length = 255)
    @Schema(description = "Motivo de la consulta indicado por el paciente",
            example = "Control nutricional y plan de alimentación",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String motivo;

    @Column(name = "fecha", nullable = false)
    @Schema(description = "Fecha agendada para la cita médica",
            example = "2026-11-20",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private LocalDate fecha;

    @Column(name = "hora", nullable = false, length = 10)
    @Schema(description = "Bloque horario seleccionado para la atención",
            example = "10:00",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String hora;

    @Column(name = "estado", nullable = false, length = 20)
    @Schema(description = "Estado actual de la reserva (Pendiente, Confirmada, Cancelada, Realizada)",
            example = "Pendiente"
    )
    private String estado = "Pendiente";

    @Column(name = "recordatorio_enviado", nullable = false)
    @Schema(description = "Indica si se generó el aviso de recordatorio de la cita",
            example = "true"
    )
    private Boolean recordatorioEnviado = true;

    @Column(name = "fecha_creacion", updatable = false)
    @Schema(description = "Fecha y hora en que se registró la reserva en el sistema",
            accessMode = Schema.AccessMode.READ_ONLY
    )
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void alCrear() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = "Pendiente";
        }
        if (this.recordatorioEnviado == null) {
            this.recordatorioEnviado = true;
        }
    }
}