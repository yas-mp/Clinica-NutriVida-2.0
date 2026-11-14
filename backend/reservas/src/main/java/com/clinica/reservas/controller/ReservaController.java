package com.clinica.reservas.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.reservas.dto.ReservaRequestDTO;
import com.clinica.reservas.dto.ReservaResponseDTO;
import com.clinica.reservas.service.ReservaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@Tag(name = "Reservas", description = "Operaciones CRUD y gestión de agenda de citas médicas")
public class ReservaController {

    private static final Logger logger = LoggerFactory.getLogger(ReservaController.class);
    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @Operation(
        summary = "Listar todas las reservas",
        description = "Retorna la lista completa de las reservas existentes en la tabla"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista de reservas retornada correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ReservaResponseDTO.class)
            )
        )
    })
    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listar() {
        logger.debug("GET /api/reservas - Listando reservas");
        return ResponseEntity.ok(reservaService.listarReservas());
    }

    @Operation(
        summary = "Obtener reserva por ID",
        description = "Busca y retorna la reserva con el ID indicado. Puede retornar un 404 si no la consigue en la tabla"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Reserva encontrada mediante su ID",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ReservaResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Reserva no encontrada en la base de datos",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> buscarReservaPorId(
        @Parameter(
            description = "ID de la reserva a buscar",
            example = "1",
            required = true
        )
        @PathVariable Long id) {
        logger.debug("GET /api/reservas/{}", id);
        ReservaResponseDTO r = reservaService.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        return ResponseEntity.ok(r);
    }

    @Operation(
        summary = "Listar reservas por RUT de paciente",
        description = "Retorna el historial de citas agendadas por un paciente específico"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Historial de reservas del paciente retornado correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ReservaResponseDTO.class)
            )
        )
    })
    @GetMapping("/paciente/{rut}")
    public ResponseEntity<List<ReservaResponseDTO>> listarPorPaciente(
        @Parameter(
            description = "RUT del paciente (con o sin puntos/guión)",
            example = "188663338",
            required = true
        )
        @PathVariable String rut) {
        logger.debug("GET /api/reservas/paciente/{}", rut);
        return ResponseEntity.ok(reservaService.listarPorPaciente(rut));
    }

    @Operation(
        summary = "Listar agenda por profesional",
        description = "Retorna las citas asignadas a un profesional nutricionista"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Agenda del profesional retornada correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ReservaResponseDTO.class)
            )
        )
    })
    @GetMapping("/profesional/{nombre}")
    public ResponseEntity<List<ReservaResponseDTO>> listarPorProfesional(
        @Parameter(
            description = "Nombre completo del profesional",
            example = "Dra. Camila Soto",
            required = true
        )
        @PathVariable String nombre) {
        logger.debug("GET /api/reservas/profesional/{}", nombre);
        return ResponseEntity.ok(reservaService.listarPorProfesional(nombre));
    }

    @Operation(
        summary = "Agendar una nueva reserva",
        description = "Crea una nueva cita médica validando que el profesional no tenga tope horario."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Reserva creada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ReservaResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos o el profesional ya tiene una cita en ese bloque horario",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crearReserva(@Valid @RequestBody ReservaRequestDTO dto) {
        logger.debug("POST /api/reservas - Agendando cita para RUT: {}", dto.getRutPaciente());
        ReservaResponseDTO creada = reservaService.crearReserva(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @Operation(
        summary = "Reprogramar reserva existente",
        description = "Actualiza la fecha, hora, servicio o profesional de una cita según su ID, validando disponibilidad."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Reserva reprogramada correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ReservaResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Reserva no encontrada o bloque horario ocupado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> reprogramarReserva(
        @Parameter(
            description = "ID de la reserva a reprogramar",
            example = "1",
            required = true
        )
        @PathVariable Long id,
        @Valid @RequestBody ReservaRequestDTO dto) {
        logger.debug("PUT /api/reservas/{} - Reprogramando reserva", id);
        ReservaResponseDTO actualizada = reservaService.reprogramarReserva(id, dto)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        return ResponseEntity.ok(actualizada);
    }

    @Operation(
        summary = "Cambiar estado de una reserva",
        description = "Actualiza el estado de la cita (Pendiente, Confirmada, Cancelada, Realizada)."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Estado de la reserva actualizado correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ReservaResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Reserva no encontrada",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ReservaResponseDTO> cambiarEstado(
        @Parameter(
            description = "ID de la reserva",
            example = "1",
            required = true
        )
        @PathVariable Long id,
        @Parameter(
            description = "Nuevo estado (Pendiente, Confirmada, Cancelada, Realizada)",
            example = "Confirmada",
            required = true
        )
        @RequestParam String estado) {
        logger.debug("PATCH /api/reservas/{}/estado - Nuevo estado={}", id, estado);
        return ResponseEntity.ok(reservaService.cambiarEstado(id, estado));
    }
}