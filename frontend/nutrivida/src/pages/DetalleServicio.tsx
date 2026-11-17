import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CardDetalleServicios from '../components/moleculas/CardDetalleServicios';
import { obtenerServicioPorId, obtenerMensajeError } from '../services/servicioService';
import type { ServicioNutricional } from '../services/servicioService';

const DetalleServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const idNumerico = Number(id);
  const idValido = Boolean(id) && Number.isInteger(idNumerico) && idNumerico > 0;

  const [servicio, setServicio] = useState<ServicioNutricional | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarServicio = useCallback(async () => {
    try {
      const servicioObtenido = await obtenerServicioPorId(idNumerico);
      setServicio(servicioObtenido);
      setError(null);
    } catch (err) {
      setServicio(null);
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [idNumerico]);

  useEffect(() => {
    if (!idValido) {
      return;
    }
    // Carga del detalle desde la API: el estado se actualiza después del fetch.
    void cargarServicio();
  }, [cargarServicio, idValido]);

  if (!idValido) {
    return (
      <main className="container my-auto py-5 text-center">
        <h2>Servicio no encontrado</h2>
        <p className="text-muted mt-2" role="alert">
          El identificador del servicio no es válido.
        </p>
        <Link to="/servicios" className="btn btn-success mt-3">
          Volver a Servicios
        </Link>
      </main>
    );
  }

  if (cargando) {
    return (
      <main className="container my-auto py-5 text-center" role="status" aria-live="polite">
        <div className="spinner-border text-success" aria-hidden="true"></div>
        <p className="text-muted mt-3 mb-0">Cargando el servicio...</p>
      </main>
    );
  }

  if (!servicio || error) {
    return (
      <main className="container my-auto py-5 text-center">
        <h2>Servicio no encontrado</h2>
        {error && (
          <p className="text-muted mt-2" role="alert">
            {error}
          </p>
        )}
        <Link to="/servicios" className="btn btn-success mt-3">
          Volver a Servicios
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-auto py-5 d-flex justify-content-center">
      <CardDetalleServicios servicio={servicio} />
    </main>
  );
};

export default DetalleServicio;
