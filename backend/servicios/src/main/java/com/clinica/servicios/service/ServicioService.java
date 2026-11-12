package com.clinica.servicios.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.clinica.servicios.Dtos.ServicioRequestDTO;
import com.clinica.servicios.Dtos.ServicioResponseDTO;
import com.clinica.servicios.model.Servicio;
import com.clinica.servicios.model.TipoServicio;
import com.clinica.servicios.repository.ServicioRepository;
import com.clinica.servicios.repository.TipoServicioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final TipoServicioRepository tipoServicioRepository;

    public List<ServicioResponseDTO> listarServicios(String busqueda, String tipo) {
        List<Servicio> servicios = servicioRepository.findAll();

        return servicios.stream()
            .filter(serv -> {
                boolean coincideTexto = (busqueda == null || busqueda.isBlank())
                    || serv.getNombre().toLowerCase().contains(busqueda.toLowerCase())
                    || serv.getCodigo().toLowerCase().contains(busqueda.toLowerCase());

                boolean coincideTipo = (tipo == null || tipo.isBlank() || tipo.equalsIgnoreCase("Todos"))
                    || serv.getTipo().getNombreTipo().equalsIgnoreCase(tipo);

                return coincideTexto && coincideTipo;
            })
            .map(this::mapearAResponseDTO)
            .collect(Collectors.toList());
    }

    public ServicioResponseDTO obtenerPorId(Long id) {
        Servicio servicio = servicioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
        return mapearAResponseDTO(servicio);
    }

    public ServicioResponseDTO crearServicio(ServicioRequestDTO dto) {
        TipoServicio tipo = tipoServicioRepository.findById(dto.getTipoId())
            .orElseThrow(() -> new RuntimeException("Tipo de servicio no encontrado con ID: " + dto.getTipoId()));

        Servicio nuevo = new Servicio(
            null,
            dto.getCodigo(),
            dto.getNombre(),
            dto.getDuracion(),
            dto.getModalidad(),
            dto.getProfesional(),
            dto.getPrecio(),
            dto.getDescripcion(),
            dto.getImagen(),
            tipo
        );

        return mapearAResponseDTO(servicioRepository.save(nuevo));
    }

    public ServicioResponseDTO actualizarServicio(Long id, ServicioRequestDTO dto) {
        Servicio existente = servicioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));

        TipoServicio tipo = tipoServicioRepository.findById(dto.getTipoId())
            .orElseThrow(() -> new RuntimeException("Tipo de servicio no encontrado con ID: " + dto.getTipoId()));

        existente.setCodigo(dto.getCodigo());
        existente.setNombre(dto.getNombre());
        existente.setDuracion(dto.getDuracion());
        existente.setModalidad(dto.getModalidad());
        existente.setProfesional(dto.getProfesional());
        existente.setPrecio(dto.getPrecio());
        existente.setDescripcion(dto.getDescripcion());
        existente.setImagen(dto.getImagen());
        existente.setTipo(tipo);

        return mapearAResponseDTO(servicioRepository.save(existente));
    }

    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado con ID: " + id);
        }
        servicioRepository.deleteById(id);
    }

    private ServicioResponseDTO mapearAResponseDTO(Servicio s) {
        return new ServicioResponseDTO(
            s.getId(),
            s.getCodigo(),
            s.getNombre(),
            s.getTipo().getNombreTipo(),
            s.getDuracion(),
            s.getModalidad(),
            s.getProfesional(),
            s.getPrecio(),
            s.getDescripcion(),
            s.getImagen()
        );
    }
}