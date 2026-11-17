package com.clinica.pago.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta con el detalle completo del pago registrado en el historial")
public class PagoResponseDTO {

    @Schema(
        description = "Identificador único del pago",
        example = "1")
    private Long id;

    @Schema(
        description = "Número de comprobante u orden de pago generado automáticamente",
        example = "PAY-100001")
    private String numeroComprobante;

    @Schema(
        description = "Identificador del usuario asociado al pago",
        example = "1")
    private Long usuarioId;

    @Schema(
        description = "RUT del paciente o titular del pago",
        example = "188663338")
    private String rutPaciente;

    @Schema(
        description = "Nombre completo del titular de la tarjeta",
        example = "Diego Rivas")
    private String titular;

    @Schema(
        description = "Correo electrónico al que se envió el comprobante",
        example = "cliente@ejemplo.com")
    private String correo;

    @Schema(
        description = "Identificador de la reserva asociada al pago",
        example = "CITA-1700000000001")
    private String idReserva;

    @Schema(
        description = "Identificador del servicio asociado al pago",
        example = "1")
    private Long idServicio;

    @Schema(
        description = "Código del servicio contratado",
        example = "CN001")
    private String codigoServicio;

    @Schema(
        description = "Nombre del servicio contratado",
        example = "Primera Consulta Nutricional")
    private String servicioNombre;

    @Schema(
        description = "Método de pago utilizado",
        example = "Debito")
    private String metodoPago;

    @Schema(
        description = "Últimos cuatro dígitos de la tarjeta utilizada",
        example = "6512")
    private String ultimos4Digitos;

    @Schema(
        description = "Monto total pagado en pesos chilenos (CLP)",
        example = "35000")
    private Integer monto;

    @Schema(
        description = "Estado actual del pago",
        example = "Aprobado")
    private String estado;

    @Schema(
        description = "Observación o detalle adicional del pago",
        example = "Pago aprobado en portal de simulación")
    private String observacion;

    @Schema(
        description = "Fecha en que se realizó el pago",
        example = "2026-11-17")
    private LocalDate fechaPago;

    @Schema(
        description = "Fecha y hora de creación del registro",
        example = "2026-11-17T10:15:00")
    private LocalDateTime fechaCreacion;
}
