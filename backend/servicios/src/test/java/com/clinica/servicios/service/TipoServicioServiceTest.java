package com.clinica.servicios.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.clinica.servicios.Dtos.TipoServicioRequestDTO;
import com.clinica.servicios.Dtos.TipoServicioResponseDTO;
import com.clinica.servicios.model.TipoServicio;
import com.clinica.servicios.repository.ServicioRepository;
import com.clinica.servicios.repository.TipoServicioRepository;

@ExtendWith(MockitoExtension.class)
class TipoServicioServiceTest {

    @Mock
    private TipoServicioRepository tipoServicioRepository;

    @Mock
    private ServicioRepository servicioRepository;

    @InjectMocks
    private TipoServicioService tipoServicioService;

    @Test
    void creaTipoRecortandoEspacios() {
        TipoServicioRequestDTO dto = new TipoServicioRequestDTO("  Consulta  ", "  Consultas  ");

        when(tipoServicioRepository.findByNombreTipoIgnoreCase("Consulta")).thenReturn(Optional.empty());
        when(tipoServicioRepository.save(any(TipoServicio.class))).thenAnswer(invocacion -> {
            TipoServicio tipo = invocacion.getArgument(0);
            tipo.setId(1L);
            return tipo;
        });

        TipoServicioResponseDTO resultado = tipoServicioService.crearTipo(dto);

        assertEquals(1L, resultado.getId());
        assertEquals("Consulta", resultado.getNombreTipo());
        assertEquals("Consultas", resultado.getDescripcion());
    }

    @Test
    void rechazaEliminarTipoConServiciosAsociados() {
        TipoServicio consulta = new TipoServicio(1L, "Consulta", "Consultas");

        when(tipoServicioRepository.findById(1L)).thenReturn(Optional.of(consulta));
        when(servicioRepository.existsByTipo_Id(1L)).thenReturn(true);

        RuntimeException excepcion = assertThrows(RuntimeException.class,
                () -> tipoServicioService.eliminarTipo(1L));

        assertTrue(excepcion.getMessage().contains("servicios asociados"));
        verify(tipoServicioRepository, never()).delete(any(TipoServicio.class));
    }
}
