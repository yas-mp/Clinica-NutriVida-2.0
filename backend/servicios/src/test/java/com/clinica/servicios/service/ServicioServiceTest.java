package com.clinica.servicios.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import com.clinica.servicios.Dtos.ServicioRequestDTO;
import com.clinica.servicios.Dtos.ServicioResponseDTO;
import com.clinica.servicios.model.Servicio;
import com.clinica.servicios.model.TipoServicio;
import com.clinica.servicios.repository.ServicioRepository;
import com.clinica.servicios.repository.TipoServicioRepository;

@ExtendWith(MockitoExtension.class)
class ServicioServiceTest {

    @Mock
    private ServicioRepository servicioRepository;

    @Mock
    private TipoServicioRepository tipoServicioRepository;

    @InjectMocks
    private ServicioService servicioService;

    @Test
    void listaYFiltraPorTextoYTipo() {
        TipoServicio consulta = new TipoServicio(1L, "Consulta", "Consultas");
        TipoServicio taller = new TipoServicio(4L, "Taller grupal", "Talleres");

        when(servicioRepository.findAll(any(Sort.class))).thenReturn(List.of(
                new Servicio(1L, "CN001", "Primera Consulta Nutricional", "50 minutos", "Presencial",
                        "Nutricionista", 35000, "Evaluación inicial", "primera-consulta.jpg", consulta),
                new Servicio(16L, "TG001", "Taller de alimentación saludable", "90 minutos",
                        "Presencial (grupo)", "Nutricionista", 15000, "Taller grupal",
                        "taller.jpg", taller)));

        List<ServicioResponseDTO> resultado = servicioService.listarServicios("consulta", "consulta");

        assertEquals(1, resultado.size());
        assertEquals("CN001", resultado.get(0).getCodigo());
        assertEquals("Consulta", resultado.get(0).getTipo());
        assertEquals(1L, resultado.get(0).getTipoId());
    }

    @Test
    void rechazaCodigoDuplicadoAlCrear() {
        when(servicioRepository.findByCodigoIgnoreCase("CN001"))
                .thenReturn(Optional.of(new Servicio()));

        ServicioRequestDTO dto = new ServicioRequestDTO(
                "cn001", "Primera Consulta", "50 minutos", "Presencial", "Nutricionista",
                35000, "Evaluación inicial", "primera-consulta.jpg", 1L);

        RuntimeException excepcion = assertThrows(RuntimeException.class,
                () -> servicioService.crearServicio(dto));

        assertTrue(excepcion.getMessage().contains("CN001"));
    }

    @Test
    void creaServicioConTipoExistente() {
        TipoServicio consulta = new TipoServicio(1L, "Consulta", "Consultas");
        ServicioRequestDTO dto = new ServicioRequestDTO(
                "cn001", "Primera Consulta", "50 minutos", "Presencial", "Nutricionista",
                35000, "Evaluación inicial", "primera-consulta.jpg", 1L);

        when(servicioRepository.findByCodigoIgnoreCase("CN001")).thenReturn(Optional.empty());
        when(tipoServicioRepository.findById(1L)).thenReturn(Optional.of(consulta));
        when(servicioRepository.save(any(Servicio.class))).thenAnswer(invocacion -> {
            Servicio servicio = invocacion.getArgument(0);
            servicio.setId(10L);
            return servicio;
        });

        ServicioResponseDTO resultado = servicioService.crearServicio(dto);

        assertEquals(10L, resultado.getId());
        assertEquals("CN001", resultado.getCodigo());
        assertEquals("Consulta", resultado.getTipo());
        assertEquals(1L, resultado.getTipoId());
        verify(servicioRepository).save(any(Servicio.class));
    }
}
