package com.clinica.servicios.Dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoServicioRequestDTO {

    @NotBlank(message = "El nombre del tipo de servicio no puede estar vacío")
    @Size(max = 50)
    @Schema(
        description = "Nombre del tipo que se le asignará al servicio",
        example = "Consulta",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String nombreTipo;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(max = 150)
    @Schema(
        description = "Descripción del tipo que se le asignará al servicio",
        example = "Atenciones clínicas individuales presenciales y por teleconsulta",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String descripcion;
}