package com.clinica.pago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinica.pago.model.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findAllByOrderByFechaCreacionDesc();

    List<Pago> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);

    List<Pago> findByRutPacienteOrderByFechaCreacionDesc(String rutPaciente);

    List<Pago> findByEstadoIgnoreCaseOrderByFechaCreacionDesc(String estado);

    Optional<Pago> findByNumeroComprobante(String numeroComprobante);

    boolean existsByNumeroComprobante(String numeroComprobante);
}
