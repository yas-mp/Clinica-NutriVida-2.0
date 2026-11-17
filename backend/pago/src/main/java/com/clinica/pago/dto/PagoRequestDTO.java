package com.clinica.pago.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonAlias;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos de entrada para registrar la simulación de un pago en el historial")
public class PagoRequestDTO {

    @Positive(message = "El ID de usuario debe ser un número positivo")
    @Schema(
        description = "ID del usuario registrado en el microservicio de usuarios (opcional para pagos invitados)",
        example = "1")
    private Long usuarioId;

    @Size(max = 20, message = "El número de comprobante no puede exceder los 20 caracteres")
    @JsonAlias({"idTransaccion"})
    @Schema(
        description = "Número de comprobante u orden de pago (si se omite, se genera automáticamente)",
        example = "PAY-100001")
    private String numeroComprobante;

    @NotBlank(message = "El RUT del paciente es obligatorio")
    @Size(max = 15, message = "El RUT no puede exceder los 15 caracteres")
    @JsonAlias({"rut"})
    @Schema(
        description = "RUT del paciente o titular (con o sin puntos/guion)",
        example = "188663338")
    private String rutPaciente;

    @NotBlank(message = "El nombre del titular es obligatorio")
    @Size(max = 120, message = "El nombre del titular no puede exceder los 120 caracteres")
    @Schema(
        description = "Nombre completo del titular de la tarjeta",
        example = "Diego Rivas")
    private String titular;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo electrónico no tiene un formato válido")
    @Size(max = 100, message = "El correo no puede exceder los 100 caracteres")
    @Schema(
        description = "Correo electrónico para el envío del comprobante",
        example = "cliente@ejemplo.com")
    private String correo;

    @Size(max = 40, message = "El identificador de reserva no puede exceder los 40 caracteres")
    @JsonAlias({"idCita"})
    @Schema(
        description = "Identificador de la reserva asociada al pago (opcional)",
        example = "CITA-1700000000001")
    private String idReserva;

    @Positive(message = "El ID del servicio debe ser un número positivo")
    @Schema(
        description = "ID del servicio del catálogo asociado al pago (opcional)",
        example = "1")
    private Long idServicio;

    @NotBlank(message = "El código del servicio es obligatorio")
    @Size(max = 10, message = "El código del servicio no puede exceder los 10 caracteres")
    @Schema(
        description = "Código del servicio contratado",
        example = "CN001")
    private String codigoServicio;

    @NotBlank(message = "El nombre del servicio es obligatorio")
    @Size(max = 150, message = "El nombre del servicio no puede exceder los 150 caracteres")
    @Schema(
        description = "Nombre del servicio contratado",
        example = "Primera Consulta Nutricional")
    private String servicioNombre;

    @NotBlank(message = "El método de pago es obligatorio")
    @Schema(
        description = "Método de pago utilizado: Debito, Credito o Prepago",
        example = "Debito")
    private String metodoPago;

    @NotBlank(message = "Los últimos 4 dígitos de la tarjeta son obligatorios")
    @Pattern(regexp = "\\d{4}", message = "Los últimos 4 dígitos deben contener exactamente 4 números")
    @Schema(
        description = "Últimos cuatro dígitos de la tarjeta utilizada",
        example = "6512")
    private String ultimos4Digitos;

    @NotNull(message = "El monto total es obligatorio")
    @Positive(message = "El monto total debe ser mayor a 0")
    @Schema(
        description = "Monto total a pagar en pesos chilenos (CLP)",
        example = "35000")
    private Integer monto;

    @Schema(
        description = "Estado inicial del pago (si se omite, se registra como Aprobado)",
        example = "Aprobado")
    private String estado;

    @Size(max = 255, message = "La observación no puede exceder los 255 caracteres")
    @Schema(
        description = "Observación o detalle adicional del pago",
        example = "Pago aprobado en portal de simulación")
    private String observacion;

    @Schema(
        description = "Fecha en que se realizó el pago (si se omite, toma la fecha actual)",
        example = "2026-11-17")
    private LocalDate fechaPago;
}
