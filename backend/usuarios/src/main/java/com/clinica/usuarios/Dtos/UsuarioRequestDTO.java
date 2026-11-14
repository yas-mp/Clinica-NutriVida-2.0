package com.clinica.usuarios.Dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class UsuarioRequestDTO {
    
    @NotBlank 
    @Size (max = 12, min = 11)
    @Schema(description = "Rut del usuario dentro de la clinica",
        example = "18.866.333-8",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String rut;

    @NotBlank 
    @Size (max = 50)
    @Schema(description = "El nombre no puede estar vacío",
        example = "Yasna Francisca",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String nombres;

    @NotBlank 
    @Size (max = 50)
    @Schema(description = "El apellido no puede estar vacío",
        example = "Mora Durán",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String apellidos;

    @NotBlank(message = "El correo no puede estar vacío")
    @Size(max = 100)
    @Schema(description = "Correo con el que el usuario inicia sesión",
        example = "yasna@gmail.com",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String correo;

    @NotNull 
    @Size(max = 10, min = 4)
    @Schema(description = "La contrasena debe tener minimo 4 caracteres",
        example = "1234",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String password;

    @NotBlank 
    @Schema(description = "Debes seleccionar una comuna",
        example = "Lampa",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String comuna;

    @NotBlank 
    @Schema(description = "Debes seleccionar una región",
        example = "Región Metropolitana",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String region;

    @Schema(description = "Id del rol del usuario",
        example = "1",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Long rolId;

}
