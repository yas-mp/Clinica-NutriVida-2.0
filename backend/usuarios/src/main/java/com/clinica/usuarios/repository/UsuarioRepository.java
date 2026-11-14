package com.clinica.usuarios.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.clinica.usuarios.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
    boolean existsByRut(String rut);
}
