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
public class RolUsuarioResponseDTO {
    
    @NotNull (message = "El id del rol es obligatorio")
    @Schema(
        description="Identificador único generado automáticamente por la BD",
        example="1",
        accessMode=Schema.AccessMode.READ_ONLY
    )
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacio")
    @Size(max = 50)
    @Schema(
        description = "Nombre del rol que se le asignara al usuario",
        example = "Administrador",
        requiredMode=Schema.RequiredMode.REQUIRED
    )
    private String nombre;

    @NotBlank(message = "La descripción no puede estar vacia")
    @Size(max = 100)
    @Schema(
        description = "Descripción del rol que se le asignara al usuario",
        example = "Se encarga de la administración, gestión de usuarios, servicios y reservas.",
        requiredMode=Schema.RequiredMode.REQUIRED
    )
    private String descripcion;
}
