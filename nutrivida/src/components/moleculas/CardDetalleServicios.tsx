import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ServicioNutricional } from '../data/ListadoServicios';

interface CardDetalleServiciosProps {
  servicio: ServicioNutricional;
}

const CardDetalleServicios: React.FC<CardDetalleServiciosProps> = ({ servicio }) => {
  const navigate = useNavigate();

  const formatearPrecio = (valor: number) =>
    valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  return (
    <div className="container my-4">
      <h1>Detalle del Servicio</h1>
      <img id="imagen" src={servicio.imagen} alt={servicio.nombre} />
      <h2 id="nombre">{servicio.nombre}</h2>
      <p id="descripcion">{servicio.descripcion}</p>

      <p id="codigo">
        <strong>Código:</strong> <span>{servicio.codigo}</span>
      </p>
      <p id="tipo">
        <strong>Categoría:</strong> <span>{servicio.categoria}</span>
      </p>
      <p id="duracion">
        <strong>Duración de la sesión:</strong> <span>{servicio.duracion}</span>
      </p>
      <p id="modalidad">
        <strong>Modalidad:</strong> <span>{servicio.modalidad}</span>
      </p>
      <p id="profesional">
        <strong>Especialista a cargo:</strong> <span>{servicio.profesional}</span>
      </p>

      <div id="precio">Valor: {formatearPrecio(servicio.precio)}</div>

      <div
        className="d-flex justify-content-center gap-3 mb-5 mx-auto"
        style={{ maxWidth: '700px', width: '100%' }}
      >
        <button
          type="button"
          className="btn btn-outline-secondary px-4 py-2 fw-semibold"
          onClick={() => navigate('/servicios')}
        >
          ← Volver a Servicios
        </button>

        <button
          type="button"
          className="nv-btn-primary px-4 py-2"
          onClick={() =>
            navigate('/reservas-horas', {
              state: {
                servicioPreseleccionado: servicio.nombre,
                profesionalPreseleccionado:
                  servicio.profesional !== 'Equipo NutriVida' ? servicio.profesional : '',
              },
            })
          }
        >
          Reservar este Servicio
        </button>
      </div>
    </div>
  );
};

export default CardDetalleServicios;