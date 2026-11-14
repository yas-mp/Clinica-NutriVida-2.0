package com.clinica.servicios.Dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicioResponseDTO {

    @Schema(
        description = "Identificador único generado automáticamente por la BD",
        example = "1",
        accessMode = Schema.AccessMode.READ_ONLY
    )
    private Long id;

    @Schema(description = "Código del servicio", example = "CN001")
    private String codigo;

    @Schema(description = "Nombre del servicio", example = "Primera Consulta Nutricional")
    private String nombre;

    @Schema(description = "Nombre del tipo o categoría del servicio", example = "Consulta")
    private String tipo;

    @Schema(description = "Duración del servicio", example = "50 minutos")
    private String duracion;

    @Schema(description = "Modalidad de atención", example = "Presencial")
    private String modalidad;

    @Schema(description = "Profesional asignado", example = "Nutricionista")
    private String profesional;

    @Schema(description = "Valor en CLP", example = "35000")
    private Integer precio;

    @Schema(
        description = "Descripción del servicio",
        example = "Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio."
    )
    private String descripcion;

    @Schema(description = "Ruta de la imagen", example = "../images/primera-consulta.jpg")
    private String imagen;
}