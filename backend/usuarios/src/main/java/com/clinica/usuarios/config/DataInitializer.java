package com.clinica.usuarios.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.clinica.usuarios.model.RolUsuario;
import com.clinica.usuarios.model.Usuario;
import com.clinica.usuarios.repository.RolUsuarioRepository;
import com.clinica.usuarios.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolUsuarioRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           RolUsuarioRepository rolRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }

        RolUsuario rolAdmin = rolRepository.findById(1L).orElseThrow();
        RolUsuario rolNutri = rolRepository.findById(2L).orElseThrow();
        RolUsuario rolUser = rolRepository.findById(3L).orElseThrow();

        crearUsuario("11.111.111-1", "Administrador", "NutriVida", "admin@nutrivida.cl", "Temuco", "La Araucanía", rolAdmin);
        crearUsuario("15.432.987-K", "Nut. Carolina", "Fuentes M.", "cfuentes@nutrivida.cl", "Temuco", "La Araucanía", rolNutri);
        crearUsuario("16.789.432-K", "Nut. Rodrigo", "Sepúlveda A.", "rsepulveda@nutrivida.cl", "Temuco", "La Araucanía", rolNutri);
        crearUsuario("17.890.123-K", "Nut. Daniela", "Morales C.", "dmorales@nutrivida.cl", "Temuco", "La Araucanía", rolNutri);
        crearUsuario("14.567.890-K", "Nut. Felipe", "Araya R.", "faraya@nutrivida.cl", "Temuco", "La Araucanía", rolNutri);
        crearUsuario("12.879.469-7", "Yasna", "Paciente", "yasnita@gmail.com", "Temuco", "La Araucanía", rolUser);
    }

    private void crearUsuario(String rut, String nombres, String apellidos, String correo,
                              String comuna, String region, RolUsuario rol) {
        Usuario u = new Usuario();
        u.setRut(rut);
        u.setNombres(nombres);
        u.setApellidos(apellidos);
        u.setCorreo(correo);
        u.setPassword(passwordEncoder.encode("1234"));
        u.setComuna(comuna);
        u.setRegion(region);
        u.setActivo(true);
        u.setRol(rol);
        usuarioRepository.save(u);
    }
}

