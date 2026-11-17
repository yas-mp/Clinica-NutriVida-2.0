package cl.contacto.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.contacto.dto.ContactoRequestDTO;
import cl.contacto.dto.ContactoRespuestaRequestDTO;
import cl.contacto.dto.ContactoResponseDTO;
import cl.contacto.service.ContactoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contactos")
@CrossOrigin(origins = "*")
@Tag(name = "Contacto", description = "Operaciones de envío, consulta, gestión y respuesta de mensajes de contacto")
public class ContactoController {

    private static final Logger logger = LoggerFactory.getLogger(ContactoController.class);
    private final ContactoService contactoService;

    public ContactoController(ContactoService contactoService) {
        this.contactoService = contactoService;
    }

    @Operation(
        summary = "Listar todos los mensajes de contacto",
        description = "Retorna la lista completa de mensajes de contacto ordenada desde el más reciente al más antiguo"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista de mensajes retornada correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        )
    })
    @GetMapping
    public ResponseEntity<List<ContactoResponseDTO>> listar() {
        logger.debug("GET /api/contactos - Listando mensajes de contacto");
        return ResponseEntity.ok(contactoService.listarMensajes());
    }

    @Operation(
        summary = "Obtener mensaje de contacto por ID",
        description = "Busca y retorna el mensaje con el ID indicado. Puede retornar un 404 si no lo encuentra"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Mensaje de contacto encontrado",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Mensaje de contacto no encontrado en la base de datos",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ContactoResponseDTO> buscarPorId(
        @Parameter(
            description = "ID del mensaje de contacto a buscar",
            example = "1",
            required = true
        )
        @PathVariable Long id) {
        logger.debug("GET /api/contactos/{}", id);
        return ResponseEntity.ok(contactoService.buscarPorId(id).orElseThrow());
    }

    @Operation(
        summary = "Listar mensajes por estado",
        description = "Retorna los mensajes filtrados por estado: Pendiente, Leído o Respondido"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Mensajes filtrados por estado retornados correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Estado no válido",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ContactoResponseDTO>> listarPorEstado(
        @Parameter(
            description = "Estado del mensaje (Pendiente, Leído, Respondido)",
            example = "Pendiente",
            required = true
        )
        @PathVariable String estado) {
        logger.debug("GET /api/contactos/estado/{}", estado);
        return ResponseEntity.ok(contactoService.listarPorEstado(estado));
    }

    @Operation(
        summary = "Listar mensajes no leídos",
        description = "Retorna los mensajes que aún no han sido revisados por el administrador"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Mensajes no leídos retornados correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        )
    })
    @GetMapping("/no-leidos")
    public ResponseEntity<List<ContactoResponseDTO>> listarNoLeidos() {
        logger.debug("GET /api/contactos/no-leidos");
        return ResponseEntity.ok(contactoService.listarNoLeidos());
    }

    @Operation(
        summary = "Enviar un nuevo mensaje de contacto",
        description = "Registra el mensaje enviado desde el formulario público de contacto con estado Pendiente"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Mensaje de contacto creado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de entrada inválidos",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PostMapping
    public ResponseEntity<ContactoResponseDTO> crearMensaje(@Valid @RequestBody ContactoRequestDTO dto) {
        logger.debug("POST /api/contactos - Registrando mensaje de: {}", dto.getCorreo());
        ContactoResponseDTO creado = contactoService.crearMensaje(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(
        summary = "Marcar mensaje como leído o no leído",
        description = "Actualiza el indicador de lectura del mensaje. Al marcarlo como leído cambia su estado a Leído"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Estado de lectura actualizado correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Mensaje de contacto no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PatchMapping("/{id}/leido")
    public ResponseEntity<ContactoResponseDTO> marcarLeido(
        @Parameter(
            description = "ID del mensaje de contacto",
            example = "1",
            required = true
        )
        @PathVariable Long id,
        @Parameter(
            description = "Nuevo estado de lectura (true = leído, false = no leído)",
            example = "true",
            required = true
        )
        @RequestParam Boolean leido) {
        logger.debug("PATCH /api/contactos/{}/leido - Nuevo estado leido={}", id, leido);
        return ResponseEntity.ok(contactoService.marcarLeido(id, leido));
    }

    @Operation(
        summary = "Cambiar estado de un mensaje",
        description = "Actualiza el estado del mensaje. Valores permitidos: Pendiente, Leído, Respondido"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Estado del mensaje actualizado correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Estado no válido",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Mensaje de contacto no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ContactoResponseDTO> cambiarEstado(
        @Parameter(
            description = "ID del mensaje de contacto",
            example = "1",
            required = true
        )
        @PathVariable Long id,
        @Parameter(
            description = "Nuevo estado (Pendiente, Leído, Respondido)",
            example = "Respondido",
            required = true
        )
        @RequestParam String estado) {
        logger.debug("PATCH /api/contactos/{}/estado - Nuevo estado={}", id, estado);
        return ResponseEntity.ok(contactoService.cambiarEstado(id, estado));
    }

    @Operation(
        summary = "Responder un mensaje de contacto",
        description = "Registra la respuesta del administrador, marca el mensaje como leído y cambia su estado a Respondido"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Respuesta registrada correctamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ContactoResponseDTO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos de respuesta inválidos",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Mensaje de contacto no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @PatchMapping("/{id}/respuesta")
    public ResponseEntity<ContactoResponseDTO> responderMensaje(
        @Parameter(
            description = "ID del mensaje de contacto a responder",
            example = "1",
            required = true
        )
        @PathVariable Long id,
        @Valid @RequestBody ContactoRespuestaRequestDTO dto) {
        logger.debug("PATCH /api/contactos/{}/respuesta - Registrando respuesta", id);
        return ResponseEntity.ok(contactoService.responderMensaje(id, dto));
    }

    @Operation(
        summary = "Eliminar un mensaje de contacto",
        description = "Elimina definitivamente el mensaje indicado de la base de datos"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Mensaje de contacto eliminado correctamente"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Mensaje de contacto no encontrado",
            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMensaje(
        @Parameter(
            description = "ID del mensaje de contacto a eliminar",
            example = "1",
            required = true
        )
        @PathVariable Long id) {
        logger.debug("DELETE /api/contactos/{}", id);
        contactoService.eliminarMensaje(id);
        return ResponseEntity.noContent().build();
    }
}
