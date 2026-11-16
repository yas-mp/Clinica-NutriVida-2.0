package com.clinica.fichas.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.fichas.dto.FichaClinicaRequestDTO;
import com.clinica.fichas.dto.FichaClinicaResponseDTO;
import com.clinica.fichas.model.FichaClinica;
import com.clinica.fichas.repository.FichaClinicaRepository;

@Service
public class FichaClinicaService {

    private static final Logger logger = LoggerFactory.getLogger(FichaClinicaService.class);
    private final FichaClinicaRepository fichaClinicaRepository;

    public FichaClinicaService(FichaClinicaRepository fichaClinicaRepository) {
        this.fichaClinicaRepository = fichaClinicaRepository;
    }

    private String limpiarRut(String rut) {
        if (rut == null) {
            return null;
        }
        return rut.replaceAll("[^0-9kK]", "").toUpperCase();
    }

    private Double calcularImc(Double pesoKg, Double tallaCm) {
        double tallaM = tallaCm / 100.0;
        double rawImc = pesoKg / (tallaM * tallaM);
        return Math.round(rawImc * 10.0) / 10.0;
    }

    private FichaClinicaResponseDTO mapToDTO(FichaClinica ficha) {
        return new FichaClinicaResponseDTO(
            ficha.getId(),
            ficha.getRutPaciente(),
            ficha.getFecha(),
            ficha.getPesoKg(),
            ficha.getTallaCm(),
            ficha.getCinturaCm(),
            ficha.getImc(),
            ficha.getPlanAlimenticio(),
            ficha.getObservaciones(),
            ficha.getNutricionista(),
            ficha.getFechaCreacion()
        );
    }

    private FichaClinica mapToEntidad(FichaClinicaRequestDTO dto) {
        FichaClinica ficha = new FichaClinica();
        ficha.setRutPaciente(limpiarRut(dto.getRutPaciente()));
        ficha.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        ficha.setPesoKg(dto.getPesoKg());
        ficha.setTallaCm(dto.getTallaCm());
        ficha.setCinturaCm(dto.getCinturaCm());
        ficha.setImc(calcularImc(dto.getPesoKg(), dto.getTallaCm()));
        ficha.setPlanAlimenticio(dto.getPlanAlimenticio());
        ficha.setObservaciones(
            (dto.getObservaciones() != null && !dto.getObservaciones().isBlank())
                ? dto.getObservaciones()
                : "Control registrado digitalmente"
        );
        ficha.setNutricionista(dto.getNutricionista());
        return ficha;
    }

    @Transactional(readOnly = true)
    public List<FichaClinicaResponseDTO> listarFichas() {
        logger.info("Consultando lista completa de fichas clínicas...");
        return fichaClinicaRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<FichaClinicaResponseDTO> buscarPorId(Long id) {
        logger.info("Consultando ficha clínica por ID: {}", id);
        FichaClinica ficha = fichaClinicaRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Ficha clínica no encontrada con ID: " + id));
        return Optional.of(mapToDTO(ficha));
    }

    @Transactional(readOnly = true)
    public List<FichaClinicaResponseDTO> listarPorPaciente(String rut) {
        String rutLimpio = limpiarRut(rut);
        logger.info("Consultando historial clínico del paciente RUT: {}", rutLimpio);
        return fichaClinicaRepository.findByRutPacienteOrderByFechaDesc(rutLimpio)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FichaClinicaResponseDTO> listarPorNutricionista(String nutricionista) {
        logger.info("Consultando fichas registradas por nutricionista: {}", nutricionista);
        return fichaClinicaRepository.findByNutricionistaOrderByFechaDesc(nutricionista)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FichaClinicaResponseDTO crearFicha(FichaClinicaRequestDTO dto) {
        logger.info("Registrando nueva ficha clínica para paciente RUT: {}", dto.getRutPaciente());
        FichaClinica nuevaFicha = mapToEntidad(dto);
        FichaClinica guardada = fichaClinicaRepository.save(nuevaFicha);
        logger.info("Ficha clínica creada ID: {} (IMC: {})", guardada.getId(), guardada.getImc());
        return mapToDTO(guardada);
    }

    @Transactional
    public Optional<FichaClinicaResponseDTO> actualizarFicha(Long id, FichaClinicaRequestDTO dto) {
        logger.info("Actualizando ficha clínica ID: {}", id);
        FichaClinica ficha = fichaClinicaRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Ficha clínica no encontrada con ID: " + id));

        if (dto.getFecha() != null) {
            ficha.setFecha(dto.getFecha());
        }
        ficha.setPesoKg(dto.getPesoKg());
        ficha.setTallaCm(dto.getTallaCm());
        ficha.setCinturaCm(dto.getCinturaCm());
        ficha.setImc(calcularImc(dto.getPesoKg(), dto.getTallaCm()));
        ficha.setPlanAlimenticio(dto.getPlanAlimenticio());
        if (dto.getObservaciones() != null && !dto.getObservaciones().isBlank()) {
            ficha.setObservaciones(dto.getObservaciones());
        }

        FichaClinica actualizada = fichaClinicaRepository.save(ficha);
        return Optional.of(mapToDTO(actualizada));
    }
}