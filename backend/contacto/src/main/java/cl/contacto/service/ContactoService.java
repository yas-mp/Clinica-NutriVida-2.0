package cl.contacto.service;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.contacto.dto.ContactoRequestDTO;
import cl.contacto.dto.ContactoRespuestaRequestDTO;
import cl.contacto.dto.ContactoResponseDTO;
import cl.contacto.model.Contacto;
import cl.contacto.repository.ContactoRepository;

@Service
public class ContactoService {

    private static final Logger logger = LoggerFactory.getLogger(ContactoService.class);

    private static final String ESTADO_PENDIENTE = "Pendiente";
    private static final String ESTADO_LEIDO = "Leído";
    private static final String ESTADO_RESPONDIDO = "Respondido";
    private static final String ASUNTO_POR_DEFECTO = "Consulta general";

    private final ContactoRepository contactoRepository;

    public ContactoService(ContactoRepository contactoRepository) {
        this.contactoRepository = contactoRepository;
    }

    private ContactoResponseDTO mapToDTO(Contacto contacto) {
        return new ContactoResponseDTO(
            contacto.getId(),
            contacto.getNombre(),
            contacto.getCorreo(),
            contacto.getTelefono(),
            contacto.getAsunto(),
            contacto.getMensaje(),
            contacto.getLeido(),
            contacto.getEstado(),
            contacto.getRespuesta(),
            contacto.getFechaEnvio(),
            contacto.getFechaRespuesta()
        );
    }

    private Contacto mapToEntidad(ContactoRequestDTO dto) {
        Contacto contacto = new Contacto();
        String telefono = textoOpcional(dto.getTelefono());
        String asunto = textoOpcional(dto.getAsunto());

        contacto.setNombre(dto.getNombre().trim());
        contacto.setCorreo(dto.getCorreo().trim().toLowerCase(Locale.ROOT));
        contacto.setTelefono(telefono);
        contacto.setAsunto(asunto != null ? asunto : ASUNTO_POR_DEFECTO);
        contacto.setMensaje(dto.getMensaje().trim());
        contacto.setLeido(false);
        contacto.setEstado(ESTADO_PENDIENTE);
        return contacto;
    }

    private String textoOpcional(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return valor.trim();
    }

    private String normalizarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            throw new RuntimeException(
                "El estado es obligatorio. Valores permitidos: Pendiente, Leído, Respondido");
        }

        String sinAcentos = Normalizer.normalize(estado.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);

        return switch (sinAcentos) {
            case "pendiente" -> ESTADO_PENDIENTE;
            case "leido" -> ESTADO_LEIDO;
            case "respondido" -> ESTADO_RESPONDIDO;
            default -> throw new RuntimeException(
                "Estado no válido: " + estado
                    + ". Valores permitidos: Pendiente, Leído, Respondido");
        };
    }

    @Transactional(readOnly = true)
    public List<ContactoResponseDTO> listarMensajes() {
        logger.info("Consultando lista completa de mensajes de contacto...");
        List<Contacto> mensajes = contactoRepository.findAllByOrderByFechaEnvioDesc();
        logger.debug("FindAll() retornó {} mensajes de contacto", mensajes.size());
        return mensajes.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ContactoResponseDTO> buscarPorId(Long id) {
        logger.info("Consultando mensaje de contacto por ID: {}", id);
        Contacto contacto = contactoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Mensaje de contacto no encontrado con ID: " + id));
        return Optional.of(mapToDTO(contacto));
    }

    @Transactional(readOnly = true)
    public List<ContactoResponseDTO> listarPorEstado(String estado) {
        String estadoNormalizado = normalizarEstado(estado);
        logger.info("Consultando mensajes de contacto con estado: {}", estadoNormalizado);
        return contactoRepository.findByEstadoIgnoreCaseOrderByFechaEnvioDesc(estadoNormalizado)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ContactoResponseDTO> listarNoLeidos() {
        logger.info("Consultando mensajes de contacto no leídos...");
        return contactoRepository.findByLeidoFalseOrderByFechaEnvioDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContactoResponseDTO crearMensaje(ContactoRequestDTO dto) {
        logger.info("Registrando nuevo mensaje de contacto de: {}", dto.getCorreo());
        Contacto nuevoMensaje = mapToEntidad(dto);
        Contacto guardado = contactoRepository.save(nuevoMensaje);
        logger.info("Mensaje de contacto creado exitosamente con ID: {}", guardado.getId());
        return mapToDTO(guardado);
    }

    @Transactional
    public ContactoResponseDTO marcarLeido(Long id, Boolean leido) {
        logger.info("Actualizando estado de lectura del mensaje ID {} a leido={}", id, leido);
        Contacto contacto = contactoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Mensaje de contacto no encontrado con ID: " + id));

        boolean estaLeido = Boolean.TRUE.equals(leido);
        contacto.setLeido(estaLeido);

        if (estaLeido && ESTADO_PENDIENTE.equals(contacto.getEstado())) {
            contacto.setEstado(ESTADO_LEIDO);
        } else if (!estaLeido && !ESTADO_RESPONDIDO.equals(contacto.getEstado())) {
            contacto.setEstado(ESTADO_PENDIENTE);
        }

        return mapToDTO(contactoRepository.save(contacto));
    }

    @Transactional
    public ContactoResponseDTO cambiarEstado(Long id, String estado) {
        String estadoNormalizado = normalizarEstado(estado);
        logger.info("Cambiando estado del mensaje ID {} a {}", id, estadoNormalizado);

        Contacto contacto = contactoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Mensaje de contacto no encontrado con ID: " + id));

        contacto.setEstado(estadoNormalizado);
        contacto.setLeido(!ESTADO_PENDIENTE.equals(estadoNormalizado));

        return mapToDTO(contactoRepository.save(contacto));
    }

    @Transactional
    public ContactoResponseDTO responderMensaje(Long id, ContactoRespuestaRequestDTO dto) {
        logger.info("Registrando respuesta para el mensaje de contacto ID: {}", id);

        Contacto contacto = contactoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Mensaje de contacto no encontrado con ID: " + id));

        contacto.setRespuesta(dto.getRespuesta().trim());
        contacto.setEstado(ESTADO_RESPONDIDO);
        contacto.setLeido(true);
        contacto.setFechaRespuesta(LocalDateTime.now());

        Contacto actualizado = contactoRepository.save(contacto);
        logger.info("Mensaje ID {} respondido correctamente", actualizado.getId());
        return mapToDTO(actualizado);
    }

    @Transactional
    public void eliminarMensaje(Long id) {
        logger.info("Eliminando mensaje de contacto con ID: {}", id);
        Contacto contacto = contactoRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Mensaje de contacto no encontrado con ID: " + id));
        contactoRepository.delete(contacto);
        logger.info("Mensaje de contacto ID {} eliminado correctamente", id);
    }
}
