package com.clinica.pago.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UsuarioRemotoDTO {

    private Long id;
    private String rut;
    private String nombres;
    private String apellidos;
    private String correo;
    private Boolean activo;
    private String rol;
}
