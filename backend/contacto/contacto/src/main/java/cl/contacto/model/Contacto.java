package cl.contacto.model;

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
@Table(name = "contactos")
@Schema(description = "Entidad que almacena los mensajes enviados desde el formulario de contacto de la clínica")
public class Contacto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(
        description = "Identificador único del mensaje de contacto",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    @Schema(
        description = "Nombre completo de la persona que envía el mensaje",
        example = "Juan Alejandro Pérez Romero",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private String nombre;

    @Column(name = "correo", nullable = false, length = 100)
    @Schema(
        description = "Correo electrónico de contacto de la persona",
        example = "juan.perez@correo.cl",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private String correo;

    @Column(name = "telefono", length = 20)
    @Schema(
        description = "Teléfono de contacto opcional (formato chileno o internacional)",
        example = "+56912345678")
    private String telefono;

    @Column(name = "asunto", length = 150)
    @Schema(
        description = "Asunto o motivo breve del mensaje",
        example = "Consulta por planes nutricionales")
    private String asunto;

    @Column(name = "mensaje", nullable = false, columnDefinition = "TEXT")
    @Schema(
        description = "Contenido del mensaje o comentario enviado por el usuario",
        example = "Hola, quisiera saber si atienden pacientes con planes vegetarianos.",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private String mensaje;

    @Column(name = "leido", nullable = false)
    @Schema(
        description = "Indica si el mensaje ya fue revisado por el administrador",
        example = "false")
    private Boolean leido = false;

    @Column(name = "estado", nullable = false, length = 20)
    @Schema(
        description = "Estado de gestión del mensaje (Pendiente, Leído, Respondido)",
        example = "Pendiente")
    private String estado = "Pendiente";

    @Column(name = "respuesta", columnDefinition = "TEXT")
    @Schema(
        description = "Respuesta entregada por el administrador, si corresponde",
        example = "Hola Juan, sí contamos con planes vegetarianos. Te contactaremos a la brevedad.")
    private String respuesta;

    @Column(name = "fecha_envio", nullable = false, updatable = false)
    @Schema(
        description = "Fecha y hora exacta en que el mensaje fue recibido",
        example = "2026-11-16T10:30:00",
        accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime fechaEnvio;

    @Column(name = "fecha_respuesta")
    @Schema(
        description = "Fecha y hora en que el administrador respondió el mensaje",
        example = "2026-11-16T12:00:00",
        accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime fechaRespuesta;

    @PrePersist
    protected void onCreate() {
        if (this.fechaEnvio == null) {
            this.fechaEnvio = LocalDateTime.now();
        }
        if (this.leido == null) {
            this.leido = false;
        }
        if (this.estado == null || this.estado.isBlank()) {
            this.estado = "Pendiente";
        }
    }
}
