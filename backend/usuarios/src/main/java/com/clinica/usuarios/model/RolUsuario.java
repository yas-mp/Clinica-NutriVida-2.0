package com.clinica.usuarios.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Entity 
@Table (name = "rol")
public class RolUsuario {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(
        description = "ID del rol generado de forma automática",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY
    )
    private Long id;

    @Column(name = "nombre_rol", nullable = false, length = 50)
    @Schema(
        description = "Nombre del rol en el sistema (ADMINISTRADOR, PACIENTE, NUTRICIONISTA)",
        example = "ADMINISTRADOR",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String nombreRol;

    @Column(name = "descripcion", nullable = false, length = 100)
    @Schema(
        description = "Descripción de las facultades del rol dentro del sistema",
        example = "Administrador encargado de gestionar usuarios y servicios",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String descripcion;
}
