package com.clinica.reservas.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinica.reservas.model.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByRutPacienteOrderByFechaDescHoraDesc(String rutPaciente);
    List<Reserva> findByProfesionalOrderByFechaAscHoraAsc(String profesional);
    boolean existsByProfesionalAndFechaAndHoraAndEstadoNot(
        String profesional,
        LocalDate fecha,
        String hora,
        String estadoCancelado
    );

    boolean existsByProfesionalAndFechaAndHoraAndEstadoNotAndIdNot(
        String profesional,
        LocalDate fecha,
        String hora,
        String estadoCancelado,
        Long id
    );
}