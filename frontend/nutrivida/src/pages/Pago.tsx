import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LISTADO_SERVICIOS } from '../components/data/ListadoServicios';
import type { ServicioNutricional } from '../components/data/ListadoServicios';
import CardResumenPago from '../components/moleculas/CardResumenPago';
import CardComprobantePago from '../components/moleculas/CardComprobantePago';
import FormularioPago from '../components/organismos/FormularioPago';
import { obtenerUsuarioIdSesion } from '../services/pagoService';
import type { Pago as PagoRegistrado } from '../services/pagoService';

const Pago: React.FC = () => {
  const location = useLocation();

  const stateNav = location.state as {
    servicio?: ServicioNutricional;
    servicioNombre?: string;
    idCita?: string;
    rutPaciente?: string;
  } | null;

  const [servicioAPagar, setServicioAPagar] = useState<ServicioNutricional>(
    LISTADO_SERVICIOS[0]
  );
  const [comprobante, setComprobante] = useState<PagoRegistrado | null>(null);

  useEffect(() => {
    if (stateNav?.servicio) {
      setServicioAPagar(stateNav.servicio);
    } else if (stateNav?.servicioNombre) {
      const encontrado = LISTADO_SERVICIOS.find(
        (s) => s.nombre === stateNav.servicioNombre
      );
      if (encontrado) setServicioAPagar(encontrado);
    } else {
      const guardado = localStorage.getItem('servicio');
      if (guardado) {
        try {
          setServicioAPagar(JSON.parse(guardado));
        } catch {
          setServicioAPagar(LISTADO_SERVICIOS[0]);
        }
      }
    }
  }, [stateNav]);

  const registrarPagoExitoso = (nuevoPago: PagoRegistrado) => {
    const pagosPrevios: PagoRegistrado[] = JSON.parse(
      localStorage.getItem('nutrivida_pagos') || '[]'
    );
    localStorage.setItem(
      'nutrivida_pagos',
      JSON.stringify([...pagosPrevios, nuevoPago])
    );

    if (stateNav?.idCita) {
      const citas = JSON.parse(localStorage.getItem('nutrivida_citas') || '[]');
      const citasActualizadas = citas.map((c: { id: string; estado: string }) =>
        c.id === stateNav.idCita ? { ...c, estado: 'Confirmada' } : c
      );
      localStorage.setItem('nutrivida_citas', JSON.stringify(citasActualizadas));
    }

    setComprobante(nuevoPago);
  };

  return (
    <main className="container my-5">
      {!comprobante ? (
        <div className="row g-4 justify-content-center">
          <div className="col-lg-5">
            <CardResumenPago servicio={servicioAPagar} />
          </div>
          <div className="col-lg-7">
            <FormularioPago
              servicio={servicioAPagar}
              rutInicial={stateNav?.rutPaciente}
              idReserva={stateNav?.idCita}
              usuarioId={obtenerUsuarioIdSesion()}
              alConfirmarPago={registrarPagoExitoso}
            />
          </div>
        </div>
      ) : (
        <CardComprobantePago comprobante={comprobante} />
      )}
    </main>
  );
};

export default Pago;
