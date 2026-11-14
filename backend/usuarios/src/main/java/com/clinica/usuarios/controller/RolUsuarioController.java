package com.clinica.usuarios.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.usuarios.Dtos.RolUsuarioRequestDTO;
import com.clinica.usuarios.Dtos.RolUsuarioResponseDTO;
import com.clinica.usuarios.service.RolUsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
@Tag(name = "Roles", description = "Operaciones de consulta y creación de roles del sistema")
public class RolUsuarioController {

    private static final Logger logger = LoggerFactory.getLogger(RolUsuarioController.class);
    private final RolUsuarioService rolUsuarioService;

    public RolUsuarioController(RolUsuarioService rolUsuarioService) {
        this.rolUsuarioService = rolUsuarioService;
    }

    @Operation(
        summary = "Listar todos los roles",
        description = "Retorna la lista completa de los roles registrados en el sistema (ADMINISTRADOR, NUTRICIONISTA, PACIENTE)"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista de roles retornada correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = RolUsuarioResponseDTO.class)
            )
        )
    })
    @GetMapping
    public ResponseEntity<List<RolUsuarioResponseDTO>> listarRoles() {
        logger.debug("GET /api/roles - Listando roles disponibles");
        return ResponseEntity.ok(rolUsuarioService.listarRoles());
    }

    @Operation(
        summary = "Crear un nuevo rol",
        description = "Registra un nuevo rol en el sistema validando que su nombre no esté duplicado"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Rol creado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = RolUsuarioResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos o el rol ya existe",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PostMapping
    public ResponseEntity<RolUsuarioResponseDTO> crearRol(@Valid @RequestBody RolUsuarioRequestDTO dto) {
        logger.debug("POST /api/roles - Registrando nuevo rol: {}", dto.getNombreRol());
        RolUsuarioResponseDTO creado = rolUsuarioService.crearRol(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}