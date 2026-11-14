package com.clinica.usuarios.service;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.clinica.usuarios.Dtos.RolUsuarioRequestDTO;
import com.clinica.usuarios.Dtos.RolUsuarioResponseDTO;
import com.clinica.usuarios.model.RolUsuario;
import com.clinica.usuarios.repository.RolUsuarioRepository;

@Service
public class RolUsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(RolUsuarioService.class);
    private final RolUsuarioRepository rolUsuarioRepository;

    public RolUsuarioService(RolUsuarioRepository rolUsuarioRepository) {
        this.rolUsuarioRepository = rolUsuarioRepository;
    }

    private RolUsuarioResponseDTO mapToDTO(RolUsuario rol) {
        return new RolUsuarioResponseDTO(
            rol.getId(),
            rol.getNombreRol(),
            rol.getDescripcion()
        );
    }

    @Transactional(readOnly = true)
    public List<RolUsuarioResponseDTO> listarRoles() {
        logger.info("Consultando lista de roles disponibles...");
        List<RolUsuario> roles = rolUsuarioRepository.findAll();
        logger.debug("FindAll() retornó {} roles desde la BD", roles.size());
        return roles.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RolUsuarioResponseDTO crearRol(RolUsuarioRequestDTO dto) {
        String nombreRol = dto.getNombreRol().trim().toUpperCase();
        logger.info("Intentando registrar nuevo rol: {}", nombreRol);

        if (rolUsuarioRepository.findByNombreRol(nombreRol).isPresent()) {
            logger.warn("Intento de crear rol duplicado: {}", nombreRol);
            throw new RuntimeException("El rol '" + nombreRol + "' ya existe en el sistema");
        }

        RolUsuario rol = new RolUsuario();
        rol.setNombreRol(nombreRol);
        rol.setDescripcion(dto.getDescripcion());

        RolUsuario guardado = rolUsuarioRepository.save(rol);
        logger.info("Rol creado exitosamente con ID: {}", guardado.getId());
        return mapToDTO(guardado);
    }
}