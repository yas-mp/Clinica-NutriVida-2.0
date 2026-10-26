import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LISTADO_SERVICIOS } from '../components/data/ListadoServicios';
import CardDetalleServicios from '../components/moleculas/CardDetalleServicios';

const DetalleServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Buscamos el servicio por ID desde la URL
  const servicioPorUrl = LISTADO_SERVICIOS.find((s) => s.id === Number(id));
  const servicioLocalStorage = localStorage.getItem('servicio')
    ? JSON.parse(localStorage.getItem('servicio')!)
    : null;

  const servicio = servicioPorUrl || servicioLocalStorage;

  if (!servicio) {
    return (
      <main className="container my-auto py-5 text-center">
        <h2>Servicio no encontrado</h2>
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