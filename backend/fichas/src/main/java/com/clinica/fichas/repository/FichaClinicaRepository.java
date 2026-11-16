package com.clinica.fichas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.fichas.model.FichaClinica;

public interface FichaClinicaRepository extends JpaRepository<FichaClinica, Long>{
    List<FichaClinica> findByRutPacienteOrderByFechaDesc(String rutPaciente);
    List<FichaClinica> findByNutricionistaOrderByFechaDesc(String nutricionista);
    
}
