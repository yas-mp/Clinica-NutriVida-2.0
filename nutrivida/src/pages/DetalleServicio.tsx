import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LISTADO_SERVICIOS } from '../components/data/ListadoServicios';
import CardDetalleServicios from '../components/moleculas/CardDetalleServicios';

const DetalleServicio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const servicioEncontrado = LISTADO_SERVICIOS.find(
    (item) => item.id === Number(id)
  );

  if (!servicioEncontrado) {
    return (
      <main className="detalle-servicio container text-center my-5">
        <h1>Servicio no encontrado</h1>
        <p className="text-muted">No existe un servicio asociado al identificador {id}.</p>
        <div className="mt-3">
          <button
            type="button"
            className="nv-btn-primary px-4 py-2"
            onClick={() => navigate('/servicios')}
          >
            Volver a Servicios
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="detalle-servicio">
      <CardDetalleServicios servicio={servicioEncontrado} />
    </main>
  );
};

export default DetalleServicio;