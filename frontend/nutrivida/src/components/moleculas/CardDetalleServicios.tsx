import React from 'react';
import { Link } from 'react-router-dom';
import type { ServicioNutricional } from '../data/ListadoServicios';

interface CardDetalleServiciosProps {
  servicio: ServicioNutricional;
}

const CardDetalleServicios: React.FC<CardDetalleServiciosProps> = ({ servicio }) => {
  return (
    <div
      className="card shadow-lg border-0 overflow-hidden"
      style={{
        maxWidth: '650px',
        width: '100%',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <div
        className="text-center text-white py-3"
        style={{ backgroundColor: 'rgb(53, 90, 49)' }}
      >
        <h1 className="m-0 fs-4 fw-bold text-white">Vista Detallada del Servicio</h1>
      </div>

      <div className="text-center p-3 bg-light">
        <img
          id="imagen"
          src={servicio.imagen}
          alt={servicio.nombre}
          className="img-fluid rounded shadow-sm mx-auto"
          style={{ maxHeight: '250px', objectFit: 'cover' }}
        />
      </div>

      <div className="card-body p-4">
        <h2
          id="nombre"
          className="card-title text-success fw-bold text-center mb-3 fs-3"
        >
          {servicio.nombre}
        </h2>

        <p id="descripcion" className="text-muted text-center mb-4 lead fs-6">
          {servicio.descripcion}
        </p>

        <hr className="my-4" />

        <div className="row g-3 text-secondary text-center">
          <div className="col-6 col-md-4">
            <span className="d-block fw-bold text-dark">Código</span>
            <span id="codigo">{servicio.codigo}</span>
          </div>
          <div className="col-6 col-md-4">
            <span className="d-block fw-bold text-dark">Tipo</span>
            <span id="tipo">{servicio.tipo}</span>
          </div>
          <div className="col-6 col-md-4">
            <span className="d-block fw-bold text-dark">Duración</span>
            <span id="duracion">{servicio.duracion}</span>
          </div>
          <div className="col-6 col-md-4">
            <span className="d-block fw-bold text-dark">Modalidad</span>
            <span id="modalidad">{servicio.modalidad}</span>
          </div>
          <div className="col-6 col-md-4">
            <span className="d-block fw-bold text-dark">Profesional</span>
            <span id="profesional">{servicio.profesional}</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <span id="precio" className="fs-4 fw-bold text-success">
            Precio: ${servicio.precio} CLP
          </span>
          <Link to="/servicios" className="btn btn-outline-success fw-bold">
            Volver a Servicios
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardDetalleServicios;