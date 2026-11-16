package com.clinica.fichas.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.fichas.dto.FichaClinicaRequestDTO;
import com.clinica.fichas.dto.FichaClinicaResponseDTO;
import com.clinica.fichas.service.FichaClinicaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fichas")
@CrossOrigin(origins = "*")
@Tag(name = "Fichas Clínicas", description = "Gestión de mediciones antropométricas (peso, talla, cintura, IMC) y planes alimenticios")
public class FichaClinicaController {

    private static final Logger logger = LoggerFactory.getLogger(FichaClinicaController.class);
    private final FichaClinicaService fichaClinicaService;

    public FichaClinicaController(FichaClinicaService fichaClinicaService) {
        this.fichaClinicaService = fichaClinicaService;
    }

    @Operation(summary = "Listar todas las fichas clínicas")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista de fichas clínicas retornada correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FichaClinicaResponseDTO.class))
        )
    })
    @GetMapping
    public ResponseEntity<List<FichaClinicaResponseDTO>> listar() {
        logger.debug("GET /api/fichas");
        return ResponseEntity.ok(fichaClinicaService.listarFichas());
    }

    @Operation(summary = "Obtener ficha clínica por ID")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Ficha clínica encontrada",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FichaClinicaResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Ficha clínica no encontrada",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<FichaClinicaResponseDTO> buscarPorId(
        @Parameter(description = "ID de la ficha clínica", example = "1", required = true)
        @PathVariable Long id) {
        logger.debug("GET /api/fichas/{}", id);
        return ResponseEntity.ok(fichaClinicaService.buscarPorId(id).orElseThrow());
    }

    @Operation(summary = "Historial clínico por RUT de paciente")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Historial clínico del paciente retornado correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FichaClinicaResponseDTO.class))
        )
    })
    @GetMapping("/paciente/{rut}")
    public ResponseEntity<List<FichaClinicaResponseDTO>> listarPorPaciente(
        @Parameter(description = "RUT del paciente (con o sin puntos/guion)", example = "188663338", required = true)
        @PathVariable String rut) {
        logger.debug("GET /api/fichas/paciente/{}", rut);
        return ResponseEntity.ok(fichaClinicaService.listarPorPaciente(rut));
    }

    @Operation(summary = "Fichas registradas por nutricionista")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista de fichas del nutricionista retornada correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FichaClinicaResponseDTO.class))
        )
    })
    @GetMapping("/nutricionista/{nombre}")
    public ResponseEntity<List<FichaClinicaResponseDTO>> listarPorNutricionista(
        @Parameter(description = "Nombre completo del nutricionista", example = "Camila Soto", required = true)
        @PathVariable String nombre) {
        logger.debug("GET /api/fichas/nutricionista/{}", nombre);
        return ResponseEntity.ok(fichaClinicaService.listarPorNutricionista(nombre));
    }

    @Operation(summary = "Registrar nueva ficha clínica", description = "Guarda mediciones antropométricas y plan alimenticio calculando el IMC automáticamente")
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Ficha clínica creada exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FichaClinicaResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de entrada inválidos",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PostMapping
    public ResponseEntity<FichaClinicaResponseDTO> crearFicha(@Valid @RequestBody FichaClinicaRequestDTO dto) {
        logger.debug("POST /api/fichas - RUT: {}", dto.getRutPaciente());
        return ResponseEntity.status(HttpStatus.CREATED).body(fichaClinicaService.crearFicha(dto));
    }

    @Operation(summary = "Actualizar ficha clínica existente")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Ficha clínica actualizada exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = FichaClinicaResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Ficha clínica no encontrada",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<FichaClinicaResponseDTO> actualizarFicha(
        @Parameter(description = "ID de la ficha clínica", example = "1", required = true)
        @PathVariable Long id,
        @Valid @RequestBody FichaClinicaRequestDTO dto) {
        logger.debug("PUT /api/fichas/{}", id);
        return ResponseEntity.ok(fichaClinicaService.actualizarFicha(id, dto).orElseThrow());
    }
}