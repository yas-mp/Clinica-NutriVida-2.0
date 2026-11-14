package com.clinica.usuarios.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinica.usuarios.Dtos.UsuarioRequestDTO;
import com.clinica.usuarios.Dtos.UsuarioResponseDTO;
import com.clinica.usuarios.model.RolUsuario;
import com.clinica.usuarios.model.Usuario;
import com.clinica.usuarios.repository.RolUsuarioRepository;
import com.clinica.usuarios.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);
    private final UsuarioRepository usuarioRepository;
    private final RolUsuarioRepository rolUsuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, RolUsuarioRepository rolUsuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolUsuarioRepository = rolUsuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private UsuarioResponseDTO mapToDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
            usuario.getId(),
            usuario.getRut(),
            usuario.getNombres(),
            usuario.getApellidos(),
            usuario.getCorreo(),
            usuario.getComuna(),
            usuario.getRegion(),
            usuario.getActivo(),
            usuario.getRol() != null ? usuario.getRol().getNombreRol() : null
        );
    }

    private Usuario mapToEntidad(UsuarioRequestDTO dto) {
        Usuario u = new Usuario();
        u.setRut(dto.getRut());
        u.setNombres(dto.getNombres());
        u.setApellidos(dto.getApellidos());
        u.setCorreo(dto.getCorreo());
        u.setPassword(dto.getPassword());
        u.setComuna(dto.getComuna());
        u.setRegion(dto.getRegion());
        u.setActivo(true);
        return u;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarUsuarios() {
        logger.info("Consultando lista de usuarios...");
        List<Usuario> listaUsuarios = usuarioRepository.findAll();
        logger.debug("FindAll() retorno {} registros de la BD", listaUsuarios.size());
        return listaUsuarios.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioResponseDTO> buscarPorId(Long id) {
        logger.info("Consultando usuario por ID: {}", id);
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return Optional.of(mapToDTO(usuario));
    }

    @Transactional
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO dto) {
        logger.info("Intentando registrar usuario con correo: {}", dto.getCorreo());
        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        if (usuarioRepository.existsByRut(dto.getRut())) {
            throw new RuntimeException("El RUT ya se encuentra registrado");
        }

        RolUsuario rol;
        if (dto.getRolId() != null) {
            rol = rolUsuarioRepository.findById(dto.getRolId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + dto.getRolId()));
        } else {
            rol = rolUsuarioRepository.findByNombreRol("PACIENTE")
                    .orElseThrow(() -> new RuntimeException("Rol PACIENTE no encontrado en la base de datos"));
        }

        Usuario nuevoUsuario = mapToEntidad(dto);
        nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        nuevoUsuario.setRol(rol);

        Usuario guardado = usuarioRepository.save(nuevoUsuario);
        logger.info("Usuario creado exitosamente con ID: {}", guardado.getId());
        return mapToDTO(guardado);
    }

    @Transactional
    public Optional<UsuarioResponseDTO> actualizarUsuario(Long id, UsuarioRequestDTO dto) {
        logger.info("Actualizando usuario con ID: {}", id);
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        usuario.setNombres(dto.getNombres());
        usuario.setApellidos(dto.getApellidos());
        usuario.setCorreo(dto.getCorreo());
        usuario.setComuna(dto.getComuna());
        usuario.setRegion(dto.getRegion());

        if (dto.getRolId() != null) {
            RolUsuario rol = rolUsuarioRepository.findById(dto.getRolId())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + dto.getRolId()));
            usuario.setRol(rol);
        }
        return Optional.of(mapToDTO(usuarioRepository.save(usuario)));
    }

    @Transactional
    public UsuarioResponseDTO cambiarEstado(Long id, Boolean activo) {
        logger.info("Cambiando estado del usuario ID {} a activo={}", id, activo);
        Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuario.setActivo(activo);
        return mapToDTO(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO login(String correo, String password) {
        logger.info("Intento de inicio de sesión para: {}", correo);
        Usuario usuario = usuarioRepository.findByCorreo(correo)
        .orElseThrow(() -> new RuntimeException("Correo o contraseña incorrectos"));

        if (!usuario.getActivo()) {
            throw new RuntimeException("El usuario se encuentra desactivado");
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Correo o contraseña incorrectos");
        }

        return mapToDTO(usuario);
    }
}