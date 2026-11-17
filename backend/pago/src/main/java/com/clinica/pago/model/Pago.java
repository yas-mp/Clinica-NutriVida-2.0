package com.clinica.pago.model;

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
@Table(name = "pagos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que almacena el registro histórico de una simulación de pago realizada en la plataforma")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(
        description = "Identificador único del pago",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(name = "numero_comprobante", nullable = false, unique = true, length = 20)
    @Schema(
        description = "Número de comprobante u orden de pago generado automáticamente",
        example = "PAY-100001",
        accessMode = Schema.AccessMode.READ_ONLY)
    private String numeroComprobante;

    @Column(name = "usuario_id")
    @Schema(
        description = "Identificador del usuario registrado en el microservicio de usuarios (puede ser nulo en pagos invitados)",
        example = "1")
    private Long usuarioId;

    @Column(name = "rut_paciente", nullable = false, length = 15)
    @Schema(
        description = "RUT del paciente o titular que realiza el pago (sin puntos ni guion)",
        example = "188663338")
    private String rutPaciente;

    @Column(name = "titular", nullable = false, length = 120)
    @Schema(
        description = "Nombre completo del titular de la tarjeta",
        example = "Diego Rivas")
    private String titular;

    @Column(name = "correo", nullable = false, length = 100)
    @Schema(
        description = "Correo electrónico al que se envía el comprobante",
        example = "cliente@ejemplo.com")
    private String correo;

    @Column(name = "id_reserva", length = 40)
    @Schema(
        description = "Identificador de la reserva asociada al pago",
        example = "CITA-1700000000001")
    private String idReserva;

    @Column(name = "id_servicio")
    @Schema(
        description = "Identificador del servicio del catálogo asociado al pago",
        example = "1")
    private Long idServicio;

    @Column(name = "codigo_servicio", nullable = false, length = 10)
    @Schema(
        description = "Código del servicio contratado",
        example = "CN001")
    private String codigoServicio;

    @Column(name = "servicio_nombre", nullable = false, length = 150)
    @Schema(
        description = "Nombre del servicio contratado",
        example = "Primera Consulta Nutricional")
    private String servicioNombre;

    @Column(name = "metodo_pago", nullable = false, length = 20)
    @Schema(
        description = "Método de pago utilizado (Debito, Credito, Prepago)",
        example = "Debito")
    private String metodoPago;

    @Column(name = "ultimos4_digitos", nullable = false, length = 4)
    @Schema(
        description = "Últimos cuatro dígitos de la tarjeta utilizada (dato enmascarado)",
        example = "6512")
    private String ultimos4Digitos;

    @Column(name = "monto", nullable = false)
    @Schema(
        description = "Monto total pagado en pesos chilenos (CLP)",
        example = "35000")
    private Integer monto;

    @Column(name = "estado", nullable = false, length = 20)
    @Schema(
        description = "Estado actual del pago (Aprobado, Pendiente, Rechazado, Anulado)",
        example = "Aprobado")
    private String estado = "Aprobado";

    @Column(name = "observacion", length = 255)
    @Schema(
        description = "Observación o detalle adicional del pago",
        example = "Pago aprobado en portal de simulación")
    private String observacion;

    @Column(name = "fecha_pago", nullable = false)
    @Schema(
        description = "Fecha en que se realizó el pago",
        example = "2026-11-17")
    private LocalDate fechaPago;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @Schema(
        description = "Fecha y hora exacta de creación del registro en el sistema",
        example = "2026-11-17T10:15:00",
        accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void alCrear() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.fechaPago == null) {
            this.fechaPago = LocalDate.now();
        }
        if (this.estado == null || this.estado.isBlank()) {
            this.estado = "Aprobado";
        }
    }
}
