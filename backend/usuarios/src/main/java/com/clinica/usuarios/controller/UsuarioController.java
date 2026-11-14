package com.clinica.usuarios.controller;

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

import com.clinica.usuarios.Dtos.LoginRequestDTO;
import com.clinica.usuarios.Dtos.UsuarioRequestDTO;
import com.clinica.usuarios.Dtos.UsuarioResponseDTO;
import com.clinica.usuarios.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController 
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@Tag(name = "Usuarios", description = "Operaciones CRUD de usuarios")
public class UsuarioController {
    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @Operation(
        summary = "Listar todos los usuarios",
        description = "Retorna la lista completa de los usuarios existentes en la tabla"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista de usuarios retornada correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema (implementation = UsuarioResponseDTO.class)
            )
        )
    })

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar(){
        logger.debug("GET /api/usuarios - Listando usuarios");
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @Operation(
        summary = "Obtener usuario por ID",
        description = "Busca y retorna el usuario con el ID indicado." + 
        "Puede retornar un 404 si no lo consigue en la tabla"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Usuario encontrado mediante su ID",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = UsuarioResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Usuario no encontrado en la base de datos",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })

    @GetMapping ("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorId(
        @Parameter(
            description = "ID del usuario a buscar",
            example = "1",
            required = true
        )
        @PathVariable Long id){
        logger.debug("GET /api/usuarios/{} ", id);
        UsuarioResponseDTO u = usuarioService.buscarPorId(id)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return ResponseEntity.ok(u);
    }

    @Operation(
        summary = "Registrar un nuevo usuario",
        description = "Crea un nuevo usuario en el sistema. Si no se indica rolId, se asigna PACIENTE por defecto."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Usuario creado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = UsuarioResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos o correo/RUT ya registrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
        logger.debug("POST /api/usuarios - Registrando usuario con correo: {}", dto.getCorreo());
        UsuarioResponseDTO creado = usuarioService.crearUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(
        summary = "Actualizar usuario existente",
        description = "Actualiza los datos personales y el rol de un usuario según su ID."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Usuario actualizado correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = UsuarioResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Usuario o rol no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizarUsuario(
        @Parameter(
            description = "ID del usuario a actualizar",
            example = "1",
            required = true
        )
        @PathVariable Long id,
        @Valid @RequestBody UsuarioRequestDTO dto) {
        logger.debug("PUT /api/usuarios/{} - Actualizando usuario", id);
        UsuarioResponseDTO actualizado = usuarioService.actualizarUsuario(id, dto)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return ResponseEntity.ok(actualizado);
    }

    @Operation(
        summary = "Activar o desactivar un usuario",
        description = "Realiza el borrado lógico cambiando el estado activo del usuario (true/false)."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Estado del usuario actualizado correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = UsuarioResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Usuario no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponseDTO> cambiarEstado(
        @Parameter(
            description = "ID del usuario",
            example = "1",
            required = true
        )
        @PathVariable Long id,
        @Parameter(
            description = "Nuevo estado (true = activo, false = inactivo)",
            example = "false",
            required = true
        )
        @RequestParam Boolean activo) {
        logger.debug("PATCH /api/usuarios/{}/estado - Nuevo estado activo={}", id, activo);
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, activo));
    }

    @Operation(
        summary = "Iniciar sesión",
        description = "Valida correo, contraseña y que la cuenta esté activa, devolviendo los datos y rol del usuario."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Inicio de sesión exitoso",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = UsuarioResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Credenciales incorrectas o cuenta desactivada",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        logger.debug("POST /api/usuarios/login - Intento de acceso para: {}", dto.getCorreo());
        UsuarioResponseDTO usuario = usuarioService.login(
                dto.getCorreo(),
                dto.getPassword()
        );
        return ResponseEntity.ok(usuario);
    }
    
    
}
