package com.clinica.servicios.model;

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
@Table(name = "tipo_servicio")
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(
        description = "ID del tipo de servicio generado de forma automática",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY
    )
    private Long id;

    @Column(name = "nombre_tipo", nullable = false, length = 50)
    @Schema(
        description = "Nombre del tipo en el sistema (Consulta, Plan especializado, Evaluación, Taller grupal)",
        example = "Consulta",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String nombreTipo;

    @Column(name = "descripcion", nullable = false, length = 150)
    @Schema(
        description = "Descripción de la categoría de servicios clínicos",
        example = "Consultas nutricionales presenciales y online de evaluación y seguimiento",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String descripcion;
}