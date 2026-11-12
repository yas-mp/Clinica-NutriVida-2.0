package com.clinica.servicios.Dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicioRequestDTO {

    @NotBlank(message = "El código no puede estar vacío")
    @Size(min = 5, max = 10)
    @Schema(
        description = "Código único del servicio dentro de la clínica",
        example = "CN001",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String codigo;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 100)
    @Schema(
        description = "Nombre del servicio nutricional",
        example = "Primera Consulta Nutricional",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String nombre;

    @NotBlank(message = "La duración no puede estar vacía")
    @Size(max = 30)
    @Schema(
        description = "Duración del servicio",
        example = "50 minutos",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String duracion;

    @NotBlank(message = "Debe seleccionar una modalidad")
    @Size(max = 30)
    @Schema(
        description = "Modalidad del servicio (Presencial, Online, Presencial (grupo))",
        example = "Presencial",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String modalidad;

    @NotBlank(message = "Debe indicar el profesional")
    @Size(max = 50)
    @Schema(
        description = "Profesional que imparte el servicio",
        example = "Nutricionista",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String profesional;

    @NotNull(message = "El precio no puede ser nulo")
    @Min(value = 1000, message = "El precio mínimo debe ser 1000 CLP")
    @Schema(
        description = "Precio del servicio en pesos chilenos",
        example = "35000",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Integer precio;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(max = 300)
    @Schema(
        description = "Descripción completa del servicio",
        example = "Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio.",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String descripcion;

    @NotBlank(message = "La imagen es obligatoria")
    @Size(max = 255)
    @Schema(
        description = "Ruta o archivo de imagen del servicio",
        example = "../images/primera-consulta.jpg",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private String imagen;

    @NotNull(message = "El id del tipo de servicio es obligatorio")
    @Schema(
        description = "ID del tipo de servicio asociado (1: Consulta, 2: Plan especializado, 3: Evaluación, 4: Taller grupal)",
        example = "1",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private Long tipoId;
}