package com.clinica.usuarios.Dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class RolUsuarioRequestDTO {
    
    @NotBlank 
    @Size(max = 50)
    @Schema(
        description = "Nombre del rol que se le asignara al usuario",
        example = "Administrador",
        requiredMode=Schema.RequiredMode.REQUIRED
    )
    private String nombreRol;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(max = 100)
    @Schema(
        description = "Descripción del rol que se le asignara al usuario",
        example = "",
        requiredMode=Schema.RequiredMode.REQUIRED
    )
    private String descripcion;
}
