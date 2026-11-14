package com.clinica.servicios.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.clinica.servicios.Dtos.ServicioRequestDTO;
import com.clinica.servicios.Dtos.ServicioResponseDTO;
import com.clinica.servicios.service.ServicioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Servicios Nutricionales", description = "Endpoints para el catálogo, filtro, vista de detalle y CRUD de los 18 servicios")
public class ServicioController {

    private final ServicioService servicioService;

    @GetMapping
    @Operation(summary = "Listar y filtrar servicios", description = "Devuelve los 18 servicios o filtra por texto (nombre/código) y tipo")
    public ResponseEntity<List<ServicioResponseDTO>> listarServicios(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(servicioService.listarServicios(busqueda, tipo));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de servicio por ID", description = "Equivalente a la vista DetalleServicio (/servicios/:id)")
    public ResponseEntity<ServicioResponseDTO> obtenerDetalle(@PathVariable Long id) {
        return ResponseEntity.ok(servicioService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo servicio nutricional")
    public ResponseEntity<ServicioResponseDTO> crear(@Valid @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioService.crearServicio(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un servicio existente por ID")
    public ResponseEntity<ServicioResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.ok(servicioService.actualizarServicio(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un servicio por ID")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.noContent().build();
    }
}