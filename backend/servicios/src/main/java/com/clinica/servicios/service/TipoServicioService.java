package com.clinica.servicios.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.servicios.Dtos.TipoServicioRequestDTO;
import com.clinica.servicios.Dtos.TipoServicioResponseDTO;
import com.clinica.servicios.model.TipoServicio;
import com.clinica.servicios.repository.ServicioRepository;
import com.clinica.servicios.repository.TipoServicioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TipoServicioService {

    private static final Logger logger = LoggerFactory.getLogger(TipoServicioService.class);

    private final TipoServicioRepository tipoServicioRepository;
    private final ServicioRepository servicioRepository;

    @Transactional(readOnly = true)
    public List<TipoServicioResponseDTO> listarTipos() {
        logger.info("Consultando tipos de servicio...");
        return tipoServicioRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::mapearAResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoServicioResponseDTO obtenerPorId(Long id) {
        logger.info("Consultando tipo de servicio por ID: {}", id);
        return mapearAResponseDTO(buscarTipo(id));
    }

    @Transactional
    public TipoServicioResponseDTO crearTipo(TipoServicioRequestDTO dto) {
        String nombreTipo = dto.getNombreTipo().trim();
        logger.info("Intentando crear tipo de servicio: {}", nombreTipo);

        if (tipoServicioRepository.findByNombreTipoIgnoreCase(nombreTipo).isPresent()) {
            throw new RuntimeException("El tipo de servicio '" + nombreTipo + "' ya existe");
        }

        TipoServicio nuevo = new TipoServicio(
                null,
                nombreTipo,
                dto.getDescripcion().trim());

        TipoServicio guardado = tipoServicioRepository.save(nuevo);
        logger.info("Tipo de servicio creado exitosamente con ID: {}", guardado.getId());
        return mapearAResponseDTO(guardado);
    }

    @Transactional
    public TipoServicioResponseDTO actualizarTipo(Long id, TipoServicioRequestDTO dto) {
        logger.info("Actualizando tipo de servicio con ID: {}", id);
        TipoServicio existente = buscarTipo(id);
        String nombreTipo = dto.getNombreTipo().trim();

        tipoServicioRepository.findByNombreTipoIgnoreCase(nombreTipo)
                .filter(tipo -> !tipo.getId().equals(id))
                .ifPresent(tipo -> {
                    throw new RuntimeException("El tipo de servicio '" + nombreTipo + "' ya existe");
                });

        existente.setNombreTipo(nombreTipo);
        existente.setDescripcion(dto.getDescripcion().trim());

        return mapearAResponseDTO(tipoServicioRepository.save(existente));
    }

    @Transactional
    public void eliminarTipo(Long id) {
        TipoServicio tipo = buscarTipo(id);

        if (servicioRepository.existsByTipo_Id(id)) {
            throw new RuntimeException(
                    "No se puede eliminar el tipo de servicio '" + tipo.getNombreTipo()
                            + "' porque tiene servicios asociados");
        }

        logger.info("Eliminando tipo de servicio con ID: {}", id);
        tipoServicioRepository.delete(tipo);
    }

    private TipoServicio buscarTipo(Long id) {
        return tipoServicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de servicio no encontrado con ID: " + id));
    }

    private TipoServicioResponseDTO mapearAResponseDTO(TipoServicio tipo) {
        return new TipoServicioResponseDTO(
                tipo.getId(),
                tipo.getNombreTipo(),
                tipo.getDescripcion());
    }
}
