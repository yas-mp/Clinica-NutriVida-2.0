package cl.contacto.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos de entrada para registrar un mensaje desde el formulario de contacto")
public class ContactoRequestDTO {

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    @Schema(
        description = "Nombre completo de la persona que envía el mensaje",
        example = "Juan Alejandro Pérez Romero",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private String nombre;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo electrónico debe tener un formato válido")
    @Size(max = 100, message = "El correo no puede superar los 100 caracteres")
    @Schema(
        description = "Correo electrónico de contacto",
        example = "juan.perez@correo.cl",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private String correo;

    @Size(max = 20, message = "El teléfono no puede superar los 20 caracteres")
    @Pattern(
        regexp = "^\\s*$|^[0-9+()\\-\\s]{8,20}$",
        message = "El teléfono solo puede contener números, espacios, +, -, paréntesis y al menos 8 dígitos")
    @Schema(
        description = "Teléfono de contacto opcional",
        example = "+56912345678")
    private String telefono;

    @Size(max = 150, message = "El asunto no puede superar los 150 caracteres")
    @Schema(
        description = "Asunto o motivo breve del mensaje (opcional)",
        example = "Consulta por planes nutricionales")
    private String asunto;

    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 500, message = "El mensaje no puede superar los 500 caracteres")
    @JsonAlias("comentarios")
    @Schema(
        description = "Contenido del mensaje o comentario",
        example = "Hola, quisiera saber si atienden pacientes con planes vegetarianos.",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private String mensaje;
}
