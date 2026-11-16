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
import org.springframework.web.bind.annotation.RestController;

import com.clinica.servicios.Dtos.TipoServicioRequestDTO;
import com.clinica.servicios.Dtos.TipoServicioResponseDTO;
import com.clinica.servicios.service.TipoServicioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tipos-servicio")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Tipos de Servicio", description = "Categorías que clasifican el catálogo de servicios nutricionales")
public class TipoServicioController {

    private final TipoServicioService tipoServicioService;

    @GetMapping
    @Operation(summary = "Listar todos los tipos de servicio")
    public ResponseEntity<List<TipoServicioResponseDTO>> listar() {
        return ResponseEntity.ok(tipoServicioService.listarTipos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un tipo de servicio por ID")
    public ResponseEntity<TipoServicioResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tipoServicioService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo tipo de servicio")
    public ResponseEntity<TipoServicioResponseDTO> crear(@Valid @RequestBody TipoServicioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoServicioService.crearTipo(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un tipo de servicio existente")
    public ResponseEntity<TipoServicioResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TipoServicioRequestDTO dto) {
        return ResponseEntity.ok(tipoServicioService.actualizarTipo(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un tipo de servicio sin servicios asociados")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tipoServicioService.eliminarTipo(id);
        return ResponseEntity.noContent().build();
    }
}
