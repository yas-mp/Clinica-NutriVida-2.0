import React from 'react';
import type { ServicioNutricional } from '../data/ListadoServicios';

interface CardResumenPagoProps {
  servicio: ServicioNutricional;
}

const CardResumenPago: React.FC<CardResumenPagoProps> = ({ servicio }) => {
  return (
    <div className="card shadow-sm border-0 p-4 h-100">
      <h4
        className="fw-bold mb-3 pb-2"
        style={{ color: '#2a492a', borderBottom: '3px solid #2a492a' }}
      >
        Resumen del Servicio
      </h4>

      <img
        src={servicio.imagen}
        alt={servicio.nombre}
        className="img-fluid rounded mb-3"
        style={{ maxHeight: '180px', objectFit: 'cover', width: '100%' }}
      />

      <span className="badge bg-success-subtle text-success align-self-start mb-2">
        Código: {servicio.codigo}
      </span>
      <h5 className="fw-bold text-dark">{servicio.nombre}</h5>
      <p className="text-muted small">{servicio.descripcion}</p>

      <ul className="list-unstyled small text-secondary mt-2 mb-4">
        <li className="mb-1">
          <strong>Tipo:</strong> {servicio.tipo}
        </li>
        <li className="mb-1">
          <strong>Modalidad:</strong> {servicio.modalidad}
        </li>
        <li className="mb-1">
          <strong>Duración:</strong> {servicio.duracion}
        </li>
        <li>
          <strong>Profesional:</strong> {servicio.profesional}
        </li>
      </ul>

      <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
        <span className="fw-bold text-secondary">Total a Pagar:</span>
        <span className="fs-3 fw-bold text-success">${servicio.precio} CLP</span>
      </div>
    </div>
  );
};

export default CardResumenPago;