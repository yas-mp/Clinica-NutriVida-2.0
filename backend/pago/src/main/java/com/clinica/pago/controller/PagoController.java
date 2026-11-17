package com.clinica.pago.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.pago.dto.PagoRequestDTO;
import com.clinica.pago.dto.PagoResponseDTO;
import com.clinica.pago.service.PagoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
@Tag(name = "Pagos", description = "Registro, consulta y gestión del historial de simulaciones de pago de la clínica")
public class PagoController {

    private static final Logger logger = LoggerFactory.getLogger(PagoController.class);
    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @Operation(
        summary = "Listar todos los pagos",
        description = "Retorna el historial completo de pagos ordenado desde el más reciente al más antiguo"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Historial de pagos retornado correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        )
    })
    @GetMapping
    public ResponseEntity<List<PagoResponseDTO>> listar() {
        logger.debug("GET /api/pagos");
        return ResponseEntity.ok(pagoService.listarPagos());
    }

    @Operation(summary = "Obtener pago por ID")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pago encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Pago no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<PagoResponseDTO> buscarPorId(
        @Parameter(description = "ID del pago", example = "1", required = true)
        @PathVariable Long id) {
        logger.debug("GET /api/pagos/{}", id);
        return ResponseEntity.ok(pagoService.buscarPorId(id).orElseThrow());
    }

    @Operation(summary = "Obtener pago por número de comprobante")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pago encontrado por comprobante",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Comprobante no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @GetMapping("/comprobante/{numeroComprobante}")
    public ResponseEntity<PagoResponseDTO> buscarPorComprobante(
        @Parameter(description = "Número de comprobante u orden de pago", example = "PAY-100001", required = true)
        @PathVariable String numeroComprobante) {
        logger.debug("GET /api/pagos/comprobante/{}", numeroComprobante);
        return ResponseEntity.ok(pagoService.buscarPorComprobante(numeroComprobante).orElseThrow());
    }

    @Operation(summary = "Listar pagos de un usuario")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pagos del usuario retornados correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        )
    })
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PagoResponseDTO>> listarPorUsuario(
        @Parameter(description = "ID del usuario registrado en el microservicio de usuarios", example = "1", required = true)
        @PathVariable Long usuarioId) {
        logger.debug("GET /api/pagos/usuario/{}", usuarioId);
        return ResponseEntity.ok(pagoService.listarPorUsuario(usuarioId));
    }

    @Operation(summary = "Listar pagos por RUT del paciente")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pagos del paciente retornados correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        )
    })
    @GetMapping("/rut/{rut}")
    public ResponseEntity<List<PagoResponseDTO>> listarPorRut(
        @Parameter(description = "RUT del paciente (con o sin puntos/guion)", example = "188663338", required = true)
        @PathVariable String rut) {
        logger.debug("GET /api/pagos/rut/{}", rut);
        return ResponseEntity.ok(pagoService.listarPorRut(rut));
    }

    @Operation(summary = "Listar pagos por estado")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pagos filtrados por estado correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Estado no válido",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PagoResponseDTO>> listarPorEstado(
        @Parameter(description = "Estado del pago: Aprobado, Pendiente, Rechazado o Anulado", example = "Aprobado", required = true)
        @PathVariable String estado) {
        logger.debug("GET /api/pagos/estado/{}", estado);
        return ResponseEntity.ok(pagoService.listarPorEstado(estado));
    }

    @Operation(
        summary = "Registrar un pago simulado",
        description = "Guarda el comprobante de la simulación de pago en el historial, generando automáticamente el número de comprobante, "
                + "la fecha de registro y validando la existencia del usuario cuando se envía usuarioId"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Pago registrado exitosamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de entrada inválidos o usuario inexistente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PostMapping
    public ResponseEntity<PagoResponseDTO> registrarPago(@Valid @RequestBody PagoRequestDTO dto) {
        logger.debug("POST /api/pagos - RUT: {} monto: {}", dto.getRutPaciente(), dto.getMonto());
        return ResponseEntity.status(HttpStatus.CREATED).body(pagoService.registrarPago(dto));
    }

    @Operation(summary = "Actualizar el estado de un pago")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Estado del pago actualizado correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Estado no válido o pago no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<PagoResponseDTO> cambiarEstado(
        @Parameter(description = "ID del pago", example = "1", required = true)
        @PathVariable Long id,
        @Parameter(description = "Nuevo estado del pago: Aprobado, Pendiente, Rechazado o Anulado", example = "Aprobado", required = true)
        @RequestParam String estado) {
        logger.debug("PATCH /api/pagos/{}/estado?estado={}", id, estado);
        return ResponseEntity.ok(pagoService.cambiarEstado(id, estado));
    }

    @Operation(summary = "Anular un pago")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pago anulado correctamente",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = PagoResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Pago no encontrado o ya anulado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PatchMapping("/{id}/anular")
    public ResponseEntity<PagoResponseDTO> anularPago(
        @Parameter(description = "ID del pago a anular", example = "1", required = true)
        @PathVariable Long id) {
        logger.debug("PATCH /api/pagos/{}/anular", id);
        return ResponseEntity.ok(pagoService.anularPago(id));
    }
}
