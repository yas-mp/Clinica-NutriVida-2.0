package cl.contacto.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos de entrada para que el administrador responda un mensaje de contacto")
public class ContactoRespuestaRequestDTO {

    @NotBlank(message = "La respuesta es obligatoria")
    @Size(max = 1000, message = "La respuesta no puede superar los 1000 caracteres")
    @Schema(
        description = "Respuesta que se enviará al correo de contacto registrado",
        example = "Hola Juan, sí contamos con planes vegetarianos. Te contactaremos a la brevedad.",
        requiredMode = Schema.RequiredMode.REQUIRED)
    private String respuesta;
}
