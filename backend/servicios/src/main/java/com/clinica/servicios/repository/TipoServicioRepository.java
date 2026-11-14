package com.clinica.servicios.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.clinica.servicios.model.TipoServicio;

public interface TipoServicioRepository extends JpaRepository<TipoServicio, Long> {
    Optional<TipoServicio> findByNombreTipoIgnoreCase(String nombreTipo);
}