package com.clinica.usuarios.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Entity 
@Table(name = "usuario")
public class Usuario {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID de usuario generada de forma automática",
        example = "1",
         accessMode=Schema.AccessMode.READ_ONLY
    )
    private Long id;

    @Column(name = "rut", nullable = false, unique = true,length = 12)
    @Schema(description = "Rut del usuario dentro de la clinica",
        example = "18.866.333-8",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String rut;

    @Column (name = "nombres", nullable = false, length = 50)
    @Schema(description = "Nombres del usuario dentro del sistema de la clinica",
        example = "Yasna Francisca",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String nombres;

    @Column  (name = "apellidos", nullable = false, length = 50)
    @Schema(description = "Apellidos del usuario dentro del sistema de la clinica",
        example = "Mora Durán",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String apellidos;

    @Column (name = "correo", nullable = false, length = 30)
    @Schema(description = "Correo con el que el usuario inicia sesión",
        example = "yasna@gmail.com",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String correo;

    @Column (name = "password", nullable = false, length = 255)
    @Schema(description = "Contrasena con la cual el usuario registra sesión",
        example = "1234",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String password;

    @Column (name = "comuna", nullable = false)
    @Schema(description = "Comuna de donde proviene el usuario",
        example = "Lampa",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String comuna;

    @Column (name = "region", nullable = false)
    @Schema(description = "Región donde proviene el usuario",
        example = "Región Metropolitana",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String region;

    @Column(name = "activo", nullable = false)
    @Schema(description = "Indica si el usuario está activo en el sistema", example = "true")
    private Boolean activo = true;

    @ManyToOne 
    @JoinColumn(name = "rol_id", nullable = false)
    @Schema(description = "Rol que identifica los permisos del usuario dentro del sistema")
    private RolUsuario rol;
    
}
