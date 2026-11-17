package com.clinica.pago.service;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.pago.client.UsuarioClient;
import com.clinica.pago.dto.PagoRequestDTO;
import com.clinica.pago.dto.PagoResponseDTO;
import com.clinica.pago.model.Pago;
import com.clinica.pago.repository.PagoRepository;

@Service
public class PagoService {

    private static final Logger logger = LoggerFactory.getLogger(PagoService.class);

    private static final String ESTADO_APROBADO = "Aprobado";
    private static final String ESTADO_PENDIENTE = "Pendiente";
    private static final String ESTADO_RECHAZADO = "Rechazado";
    private static final String ESTADO_ANULADO = "Anulado";

    private static final String METODO_DEBITO = "Debito";
    private static final String METODO_CREDITO = "Credito";
    private static final String METODO_PREPAGO = "Prepago";

    private static final String OBSERVACION_POR_DEFECTO = "Pago registrado en el portal de simulación";

    private final PagoRepository pagoRepository;
    private final UsuarioClient usuarioClient;

    public PagoService(PagoRepository pagoRepository, UsuarioClient usuarioClient) {
        this.pagoRepository = pagoRepository;
        this.usuarioClient = usuarioClient;
    }

    private PagoResponseDTO mapToDTO(Pago pago) {
        return new PagoResponseDTO(
            pago.getId(),
            pago.getNumeroComprobante(),
            pago.getUsuarioId(),
            pago.getRutPaciente(),
            pago.getTitular(),
            pago.getCorreo(),
            pago.getIdReserva(),
            pago.getIdServicio(),
            pago.getCodigoServicio(),
            pago.getServicioNombre(),
            pago.getMetodoPago(),
            pago.getUltimos4Digitos(),
            pago.getMonto(),
            pago.getEstado(),
            pago.getObservacion(),
            pago.getFechaPago(),
            pago.getFechaCreacion()
        );
    }

    private Pago mapToEntidad(PagoRequestDTO dto) {
        Pago pago = new Pago();
        pago.setUsuarioId(dto.getUsuarioId());
        pago.setRutPaciente(limpiarRut(dto.getRutPaciente()));
        pago.setTitular(dto.getTitular().trim());
        pago.setCorreo(dto.getCorreo().trim().toLowerCase(Locale.ROOT));
        pago.setIdReserva(textoOpcional(dto.getIdReserva()));
        pago.setIdServicio(dto.getIdServicio());
        pago.setCodigoServicio(dto.getCodigoServicio().trim().toUpperCase(Locale.ROOT));
        pago.setServicioNombre(dto.getServicioNombre().trim());
        pago.setMetodoPago(normalizarMetodoPago(dto.getMetodoPago()));
        pago.setUltimos4Digitos(dto.getUltimos4Digitos().trim());
        pago.setMonto(dto.getMonto());
        pago.setEstado(normalizarEstado(dto.getEstado()));
        pago.setObservacion(textoOpcional(dto.getObservacion()) != null
                ? dto.getObservacion().trim()
                : OBSERVACION_POR_DEFECTO);
        pago.setFechaPago(dto.getFechaPago() != null ? dto.getFechaPago() : LocalDate.now());
        return pago;
    }

    private String limpiarRut(String rut) {
        if (rut == null) {
            throw new RuntimeException("El RUT del paciente es obligatorio");
        }
        String rutLimpio = rut.replaceAll("[^0-9kK]", "").toUpperCase(Locale.ROOT);
        if (rutLimpio.length() < 8 || rutLimpio.length() > 9) {
            throw new RuntimeException("El RUT debe tener entre 8 y 9 caracteres sin puntos ni guión");
        }
        return rutLimpio;
    }

    private String textoOpcional(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return valor.trim();
    }

    private String normalizarMetodoPago(String metodoPago) {
        if (metodoPago == null || metodoPago.isBlank()) {
            throw new RuntimeException(
                "El método de pago es obligatorio. Valores permitidos: Debito, Credito, Prepago");
        }

        String sinAcentos = Normalizer.normalize(metodoPago.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);

        return switch (sinAcentos) {
            case "debito" -> METODO_DEBITO;
            case "credito" -> METODO_CREDITO;
            case "prepago" -> METODO_PREPAGO;
            default -> throw new RuntimeException(
                "Método de pago no válido: " + metodoPago
                    + ". Valores permitidos: Debito, Credito, Prepago");
        };
    }

    private String normalizarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            return ESTADO_APROBADO;
        }

        String sinAcentos = Normalizer.normalize(estado.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);

        return switch (sinAcentos) {
            case "aprobado" -> ESTADO_APROBADO;
            case "pendiente" -> ESTADO_PENDIENTE;
            case "rechazado" -> ESTADO_RECHAZADO;
            case "anulado" -> ESTADO_ANULADO;
            default -> throw new RuntimeException(
                "Estado no válido: " + estado
                    + ". Valores permitidos: Aprobado, Pendiente, Rechazado, Anulado");
        };
    }

    private String generarNumeroComprobante() {
        for (int intento = 0; intento < 10; intento++) {
            String candidato = "PAY-" + String.format("%06d",
                    ThreadLocalRandom.current().nextInt(1_000_000));
            if (!pagoRepository.existsByNumeroComprobante(candidato)) {
                return candidato;
            }
        }

        String alternativo = "PAY-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase(Locale.ROOT);
        logger.warn("No se pudo generar un comprobante numérico único; se utiliza {}", alternativo);
        return alternativo;
    }

    @Transactional(readOnly = true)
    public List<PagoResponseDTO> listarPagos() {
        logger.info("Consultando historial completo de pagos...");
        return pagoRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<PagoResponseDTO> buscarPorId(Long id) {
        logger.info("Consultando pago por ID: {}", id);
        Pago pago = pagoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));
        return Optional.of(mapToDTO(pago));
    }

    @Transactional(readOnly = true)
    public Optional<PagoResponseDTO> buscarPorComprobante(String numeroComprobante) {
        String comprobante = numeroComprobante != null
                ? numeroComprobante.trim().toUpperCase(Locale.ROOT)
                : null;
        logger.info("Consultando pago por número de comprobante: {}", comprobante);
        Pago pago = pagoRepository.findByNumeroComprobante(comprobante)
                .orElseThrow(() -> new RuntimeException(
                    "Pago no encontrado con número de comprobante: " + numeroComprobante));
        return Optional.of(mapToDTO(pago));
    }

    @Transactional(readOnly = true)
    public List<PagoResponseDTO> listarPorUsuario(Long usuarioId) {
        logger.info("Consultando pagos del usuario ID: {}", usuarioId);
        return pagoRepository.findByUsuarioIdOrderByFechaCreacionDesc(Objects.requireNonNull(usuarioId))
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PagoResponseDTO> listarPorRut(String rutPaciente) {
        String rutLimpio = limpiarRut(rutPaciente);
        logger.info("Consultando pagos del paciente con RUT: {}", rutLimpio);
        return pagoRepository.findByRutPacienteOrderByFechaCreacionDesc(rutLimpio)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PagoResponseDTO> listarPorEstado(String estado) {
        String estadoNormalizado = normalizarEstado(estado);
        logger.info("Consultando pagos con estado: {}", estadoNormalizado);
        return pagoRepository.findByEstadoIgnoreCaseOrderByFechaCreacionDesc(estadoNormalizado)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PagoResponseDTO registrarPago(PagoRequestDTO dto) {
        logger.info("Registrando simulación de pago para RUT: {} por monto: {}",
                dto.getRutPaciente(), dto.getMonto());

        usuarioClient.validarExistencia(dto.getUsuarioId());

        Pago nuevoPago = mapToEntidad(dto);

        String comprobanteSolicitado = textoOpcional(dto.getNumeroComprobante());
        if (comprobanteSolicitado != null) {
            String comprobante = comprobanteSolicitado.toUpperCase(Locale.ROOT);
            if (pagoRepository.existsByNumeroComprobante(comprobante)) {
                throw new RuntimeException("Ya existe un pago con el número de comprobante: " + comprobante);
            }
            nuevoPago.setNumeroComprobante(comprobante);
        } else {
            nuevoPago.setNumeroComprobante(generarNumeroComprobante());
        }

        Pago guardado = pagoRepository.save(nuevoPago);
        logger.info("Pago registrado exitosamente ID: {} comprobante: {} estado: {}",
                guardado.getId(), guardado.getNumeroComprobante(), guardado.getEstado());
        return mapToDTO(guardado);
    }

    @Transactional
    public PagoResponseDTO cambiarEstado(Long id, String estado) {
        String estadoNormalizado = normalizarEstado(estado);
        logger.info("Cambiando estado del pago ID {} a {}", id, estadoNormalizado);

        Pago pago = pagoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));

        if (ESTADO_ANULADO.equals(pago.getEstado()) && !ESTADO_ANULADO.equals(estadoNormalizado)) {
            throw new RuntimeException("El pago se encuentra anulado y no puede cambiar de estado");
        }

        pago.setEstado(estadoNormalizado);
        return mapToDTO(pagoRepository.save(pago));
    }

    @Transactional
    public PagoResponseDTO anularPago(Long id) {
        logger.info("Anulando pago ID: {}", id);

        Pago pago = pagoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + id));

        if (ESTADO_ANULADO.equals(pago.getEstado())) {
            throw new RuntimeException("El pago con ID " + id + " ya se encuentra anulado");
        }

        pago.setEstado(ESTADO_ANULADO);
        pago.setObservacion("Pago anulado desde el portal de administración");

        Pago actualizado = pagoRepository.save(pago);
        logger.info("Pago ID {} anulado correctamente", actualizado.getId());
        return mapToDTO(actualizado);
    }
}
