package cl.contacto.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta con el detalle completo de un mensaje de contacto")
public class ContactoResponseDTO {

    @Schema(
        description = "Identificador único del mensaje",
        example = "1")
    private Long id;

    @Schema(
        description = "Nombre completo de la persona que envió el mensaje",
        example = "Juan Alejandro Pérez Romero")
    private String nombre;

    @Schema(
        description = "Correo electrónico de contacto",
        example = "juan.perez@correo.cl")
    private String correo;

    @Schema(
        description = "Teléfono de contacto",
        example = "+56912345678")
    private String telefono;

    @Schema(
        description = "Asunto o motivo breve del mensaje",
        example = "Consulta por planes nutricionales")
    private String asunto;

    @Schema(
        description = "Contenido del mensaje enviado",
        example = "Hola, quisiera saber si atienden pacientes con planes vegetarianos.")
    private String mensaje;

    @Schema(
        description = "Indica si el mensaje fue revisado por el administrador",
        example = "false")
    private Boolean leido;

    @Schema(
        description = "Estado de gestión del mensaje (Pendiente, Leído, Respondido)",
        example = "Pendiente")
    private String estado;

    @Schema(
        description = "Respuesta entregada por el administrador",
        example = "Hola Juan, sí contamos con planes vegetarianos.")
    private String respuesta;

    @Schema(
        description = "Fecha y hora en que el mensaje fue recibido",
        example = "2026-11-16T10:30:00")
    private LocalDateTime fechaEnvio;

    @Schema(
        description = "Fecha y hora en que el mensaje fue respondido",
        example = "2026-11-16T12:00:00")
    private LocalDateTime fechaRespuesta;
}
