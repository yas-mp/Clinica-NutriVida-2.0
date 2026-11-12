package com.clinica.servicios.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.clinica.servicios.model.Servicio;


public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    Optional<Servicio> findByCodigoIgnoreCase(String codigo);

    List<Servicio> findByTipo_NombreTipoIgnoreCase(String nombreTipo);

    List<Servicio> findByNombreContainingIgnoreCaseOrCodigoContainingIgnoreCase(
        String nombre,
        String codigo
    );
}