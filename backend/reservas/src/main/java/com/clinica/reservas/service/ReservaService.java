package com.clinica.reservas.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.reservas.dto.ReservaRequestDTO;
import com.clinica.reservas.dto.ReservaResponseDTO;
import com.clinica.reservas.model.Reserva;
import com.clinica.reservas.repository.ReservaRepository;

@Service
public class ReservaService {

    private static final Logger logger = LoggerFactory.getLogger(ReservaService.class);
    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    private ReservaResponseDTO mapToDTO(Reserva reserva) {
        return new ReservaResponseDTO(
            reserva.getId(),
            reserva.getRutPaciente(),
            reserva.getServicio(),
            reserva.getProfesional(),
            reserva.getMotivo(),
            reserva.getFecha(),
            reserva.getHora(),
            reserva.getEstado(),
            reserva.getRecordatorioEnviado(),
            reserva.getFechaCreacion()
        );
    }

    private Reserva mapToEntidad(ReservaRequestDTO dto) {
        Reserva r = new Reserva();
        r.setRutPaciente(limpiarRut(dto.getRutPaciente()));
        r.setServicio(dto.getServicio());
        r.setProfesional(dto.getProfesional());
        r.setMotivo(dto.getMotivo());
        r.setFecha(dto.getFecha());
        r.setHora(dto.getHora());
        r.setEstado("Pendiente");
        r.setRecordatorioEnviado(true);
        return r;
    }

    private String limpiarRut(String rut) {
        return rut != null ? rut.replaceAll("[^0-9kK]", "").toUpperCase() : "";
    }

    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> listarReservas() {
        logger.info("Consultando lista de reservas...");
        List<Reserva> listaReservas = reservaRepository.findAll();
        logger.debug("FindAll() retorno {} registros de la BD", listaReservas.size());
        return listaReservas.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ReservaResponseDTO> buscarPorId(Long id) {
        logger.info("Consultando reserva por ID: {}", id);
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        return Optional.of(mapToDTO(reserva));
    }

    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> listarPorPaciente(String rutPaciente) {
        String rutLimpio = limpiarRut(rutPaciente);
        logger.info("Consultando reservas del paciente con RUT: {}", rutLimpio);
        List<Reserva> reservasPaciente = reservaRepository.findByRutPacienteOrderByFechaDescHoraDesc(rutLimpio);
        logger.debug("Se encontraron {} reservas para el paciente {}", reservasPaciente.size(), rutLimpio);
        return reservasPaciente.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> listarPorProfesional(String profesional) {
        logger.info("Consultando agenda del profesional: {}", profesional);
        List<Reserva> agendaProfesional = reservaRepository.findByProfesionalOrderByFechaAscHoraAsc(profesional);
        logger.debug("Se encontraron {} citas para el profesional {}", agendaProfesional.size(), profesional);
        return agendaProfesional.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservaResponseDTO crearReserva(ReservaRequestDTO dto) {
        logger.info("Intentando agendar reserva para paciente RUT: {} con profesional: {}", dto.getRutPaciente(), dto.getProfesional());

        boolean horarioOcupado = reservaRepository.existsByProfesionalAndFechaAndHoraAndEstadoNot(
            dto.getProfesional(),
            dto.getFecha(),
            dto.getHora(),
            "Cancelada"
        );

        if (horarioOcupado) {
            throw new RuntimeException("El profesional " + dto.getProfesional() + " ya tiene una cita reservada en esa fecha y hora.");
        }

        Reserva nuevaReserva = mapToEntidad(dto);
        Reserva guardada = reservaRepository.save(nuevaReserva);
        logger.info("Reserva creada exitosamente con ID: {}", guardada.getId());
        return mapToDTO(guardada);
    }

    @Transactional
    public Optional<ReservaResponseDTO> reprogramarReserva(Long id, ReservaRequestDTO dto) {
        logger.info("Reprogramando reserva con ID: {}", id);
        Reserva reserva = reservaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));

        boolean horarioOcupado = reservaRepository.existsByProfesionalAndFechaAndHoraAndEstadoNotAndIdNot(
            dto.getProfesional(),
            dto.getFecha(),
            dto.getHora(),
            "Cancelada",
            id
        );

        if (horarioOcupado) {
            throw new RuntimeException("El profesional " + dto.getProfesional() + " ya tiene una cita reservada en esa fecha y hora.");
        }

        reserva.setServicio(dto.getServicio());
        reserva.setProfesional(dto.getProfesional());
        reserva.setMotivo(dto.getMotivo());
        reserva.setFecha(dto.getFecha());
        reserva.setHora(dto.getHora());
        reserva.setEstado("Pendiente");

        return Optional.of(mapToDTO(reservaRepository.save(reserva)));
    }

    @Transactional
    public ReservaResponseDTO cambiarEstado(Long id, String estado) {
        logger.info("Cambiando estado de la reserva ID {} a estado={}", id, estado);
        Reserva reserva = reservaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        reserva.setEstado(estado);
        return mapToDTO(reservaRepository.save(reserva));
    }
}