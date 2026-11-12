package com.clinica.servicios.model;

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
@Table(name = "servicio")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(
        description = "ID de servicio generado de forma automática",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY
    )
    private Long id;

    @Column(name = "codigo", nullable = false, unique = true, length = 10)
    @Schema(
        description = "Código identificador del servicio dentro de la clínica",
        example = "CN001",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String codigo;

    @Column(name = "nombre", nullable = false, length = 100)
    @Schema(
        description = "Nombre del servicio dentro del catálogo de la clínica",
        example = "Primera Consulta Nutricional",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String nombre;

    @Column(name = "duracion", nullable = false, length = 30)
    @Schema(
        description = "Duración de la sesión o plan nutricional",
        example = "50 minutos",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String duracion;

    @Column(name = "modalidad", nullable = false, length = 30)
    @Schema(
        description = "Modalidad de atención (Presencial, Online, Presencial (grupo))",
        example = "Presencial",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String modalidad;

    @Column(name = "profesional", nullable = false, length = 50)
    @Schema(
        description = "Profesional encargado de impartir el servicio",
        example = "Nutricionista",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String profesional;

    @Column(name = "precio", nullable = false)
    @Schema(
        description = "Precio en pesos chilenos (CLP)",
        example = "35000",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Integer precio;

    @Column(name = "descripcion", nullable = false, length = 300)
    @Schema(
        description = "Descripción detallada para la vista de detalle del servicio",
        example = "Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio.",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String descripcion;

    @Column(name = "imagen", nullable = false, length = 255)
    @Schema(
        description = "Ruta de la imagen asociada al servicio",
        example = "../images/primera-consulta.jpg",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String imagen;

    @ManyToOne
    @JoinColumn(name = "tipo_id", nullable = false)
    @Schema(
        description = "Tipo o categoría que clasifica al servicio dentro del catálogo",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private TipoServicio tipo;
}