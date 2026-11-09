package com.clinica.usuarios.model;
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
@NoArgsConstructor 
@AllArgsConstructor 
@Entity 
@Table(name = "usuario")

public class Usuario {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rut", nullable = false, unique = true,length = 12)
    private String rut;

    @Column (name = "nombres", nullable = false, length = 50)
    private String nombres;

    @Column  (name = "apellidos", nullable = false, length = 50)
    private String apellido;

    @Column (name = "correo", nullable = false, length = 30)
    private String correo;

    @Column (name = "password", nullable = false, length = 9)
    private String password;

    @Column (name = "comuna", nullable = false)
    private String comuna;

    @Column (name = "region", nullable = false)
    private String region;

    @Column (name = "rol", nullable = false, length = 15)
    private String rol;
    
}
