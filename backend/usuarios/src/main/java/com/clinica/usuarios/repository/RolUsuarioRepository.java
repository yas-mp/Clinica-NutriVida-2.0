package com.clinica.usuarios.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.clinica.usuarios.model.RolUsuario;
import java.util.Optional;

@Repository 
public interface RolUsuarioRepository extends JpaRepository<RolUsuario, Long>{
    Optional<RolUsuario> findByNombreRol(String nombreRol);
}
