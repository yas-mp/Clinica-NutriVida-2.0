package com.clinica.usuarios.Dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class UsuarioResponseDTO {
    
    @Schema(
        description = "Identificador único generado automáticamente por la BD",
        example = "1"
    )
    private Long id;

    @Schema(
        description = "RUT registrado del usuario",
        example = "18.866.333-8"
    )
    private String rut;

    @Schema(
        description = "Nombres del usuario",
        example = "Yasna Francisca"
    )
    private String nombres;

    @Schema(
        description = "Apellidos del usuario",
        example = "Mora Durán"
    )
    private String apellidos;

    @Schema(
        description = "Correo electrónico registrado del usuario",
        example = "yasna@gmail.com"
    )
    private String correo;

    @Schema(
        description = "Comuna de residencia del usuario",
        example = "Lampa"
    )
    private String comuna;

    @Schema(
        description = "Región de residencia del usuario",
        example = "Región Metropolitana"
    )
    private String region;
    
    @Schema(
        description = "Indica si el usuario está activo en el sistema",
        example = "true"
    )
    private Boolean activo;

    @Schema(
        description = "Rol asignado al usuario",
        example = "PACIENTE"
    )
    private String rol;
}