package com.clinica.servicios.service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.servicios.Dtos.ServicioRequestDTO;
import com.clinica.servicios.Dtos.ServicioResponseDTO;
import com.clinica.servicios.model.Servicio;
import com.clinica.servicios.model.TipoServicio;
import com.clinica.servicios.repository.ServicioRepository;
import com.clinica.servicios.repository.TipoServicioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicioService {

    private static final Logger logger = LoggerFactory.getLogger(ServicioService.class);

    private final ServicioRepository servicioRepository;
    private final TipoServicioRepository tipoServicioRepository;

    @Transactional(readOnly = true)
    public List<ServicioResponseDTO> listarServicios(String busqueda, String tipo) {
        String textoBuscado = normalizar(busqueda);
        String tipoBuscado = normalizar(tipo);

        logger.info("Consultando catálogo de servicios. búsqueda='{}', tipo='{}'", busqueda, tipo);

        return servicioRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .filter(servicio -> coincideTexto(servicio, textoBuscado))
                .filter(servicio -> coincideTipo(servicio, tipoBuscado))
                .map(this::mapearAResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServicioResponseDTO obtenerPorId(Long id) {
        logger.info("Consultando servicio por ID: {}", id);
        return mapearAResponseDTO(buscarServicio(id));
    }

    @Transactional
    public ServicioResponseDTO crearServicio(ServicioRequestDTO dto) {
        String codigo = dto.getCodigo().trim().toUpperCase(Locale.ROOT);
        logger.info("Intentando crear servicio con código: {}", codigo);

        if (servicioRepository.findByCodigoIgnoreCase(codigo).isPresent()) {
            throw new RuntimeException("Ya existe un servicio con el código: " + codigo);
        }

        TipoServicio tipo = buscarTipo(dto.getTipoId());

        Servicio nuevo = new Servicio(
                null,
                codigo,
                dto.getNombre().trim(),
                dto.getDuracion().trim(),
                dto.getModalidad().trim(),
                dto.getProfesional().trim(),
                dto.getPrecio(),
                dto.getDescripcion().trim(),
                dto.getImagen().trim(),
                tipo);

        Servicio guardado = servicioRepository.save(nuevo);
        logger.info("Servicio creado exitosamente con ID: {}", guardado.getId());
        return mapearAResponseDTO(guardado);
    }

    @Transactional
    public ServicioResponseDTO actualizarServicio(Long id, ServicioRequestDTO dto) {
        logger.info("Actualizando servicio con ID: {}", id);
        Servicio existente = buscarServicio(id);
        String codigo = dto.getCodigo().trim().toUpperCase(Locale.ROOT);

        servicioRepository.findByCodigoIgnoreCase(codigo)
                .filter(servicio -> !servicio.getId().equals(id))
                .ifPresent(servicio -> {
                    throw new RuntimeException("Ya existe un servicio con el código: " + codigo);
                });

        TipoServicio tipo = buscarTipo(dto.getTipoId());

        existente.setCodigo(codigo);
        existente.setNombre(dto.getNombre().trim());
        existente.setDuracion(dto.getDuracion().trim());
        existente.setModalidad(dto.getModalidad().trim());
        existente.setProfesional(dto.getProfesional().trim());
        existente.setPrecio(dto.getPrecio());
        existente.setDescripcion(dto.getDescripcion().trim());
        existente.setImagen(dto.getImagen().trim());
        existente.setTipo(tipo);

        return mapearAResponseDTO(servicioRepository.save(existente));
    }

    @Transactional
    public void eliminarServicio(Long id) {
        Servicio servicio = buscarServicio(id);
        logger.info("Eliminando servicio con ID: {}", id);
        servicioRepository.delete(servicio);
    }

    private Servicio buscarServicio(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }

    private TipoServicio buscarTipo(Long tipoId) {
        return tipoServicioRepository.findById(tipoId)
                .orElseThrow(() -> new RuntimeException("Tipo de servicio no encontrado con ID: " + tipoId));
    }

    private boolean coincideTexto(Servicio servicio, String textoBuscado) {
        if (textoBuscado.isEmpty()) {
            return true;
        }
        return normalizar(servicio.getNombre()).contains(textoBuscado)
                || normalizar(servicio.getCodigo()).contains(textoBuscado);
    }

    private boolean coincideTipo(Servicio servicio, String tipoBuscado) {
        if (tipoBuscado.isEmpty() || "todos".equals(tipoBuscado)) {
            return true;
        }
        return servicio.getTipo() != null
                && normalizar(servicio.getTipo().getNombreTipo()).equals(tipoBuscado);
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim().toLowerCase(Locale.ROOT);
    }

    private ServicioResponseDTO mapearAResponseDTO(Servicio servicio) {
        return new ServicioResponseDTO(
                servicio.getId(),
                servicio.getCodigo(),
                servicio.getNombre(),
                servicio.getTipo() != null ? servicio.getTipo().getNombreTipo() : null,
                servicio.getTipo() != null ? servicio.getTipo().getId() : null,
                servicio.getDuracion(),
                servicio.getModalidad(),
                servicio.getProfesional(),
                servicio.getPrecio(),
                servicio.getDescripcion(),
                servicio.getImagen());
    }
}
