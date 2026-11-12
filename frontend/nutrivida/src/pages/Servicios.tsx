import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LISTADO_SERVICIOS } from '../components/data/ListadoServicios';
import type { ServicioNutricional } from '../components/data/ListadoServicios';

export const CATALOGO_SERVICIOS: ServicioNutricional[] = LISTADO_SERVICIOS;
export type { ServicioNutricional };

const Servicios: React.FC = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');

  const verDetalle = (servicio: ServicioNutricional) => {
    localStorage.setItem('servicio', JSON.stringify(servicio));
    navigate(`/servicios/${servicio.id}`);
  };

  const serviciosFiltrados = LISTADO_SERVICIOS.filter((serv) => {
    const coincideTexto =
      serv.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      serv.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo =
      filtroTipo === 'Todos' ||
      serv.tipo.toLowerCase() === filtroTipo.toLowerCase();
    return coincideTexto && coincideTipo;
  });

  return (
    <main className="container my-5">
      <div className="text-center mb-4">
        <h1
          className="fw-bold"
          style={{ borderBottom: '3px solid #2a492a', color: '#2a492a', paddingBottom: '10px' }}
        >
          Nuestros Servicios
        </h1>
        <p className="text-muted">Conoce los planes y consultas que tenemos para ti</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar servicio por nombre o código (ej: Primera Consulta, CN001)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            aria-label="Filtrar por tipo de servicio"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">Todos los tipos (18)</option>
            <option value="Consulta">Consulta</option>
            <option value="Plan especializado">Plan especializado</option>
            <option value="Evaluación">Evaluación</option>
            <option value="Taller grupal">Taller grupal</option>
          </select>
        </div>
      </div>

      <div
        id="listaServicios"
        className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
      >
        {serviciosFiltrados.map((serv) => (
          <div className="col" key={serv.id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={serv.imagen}
                className="card-img-top"
                alt={serv.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-success fw-bold">{serv.nombre}</h5>
                <p className="card-text text-muted mb-2">
                  <strong>Profesional:</strong> {serv.profesional}
                </p>
                <p className="card-text fw-bold text-dark mt-auto fs-5">
                  ${serv.precio}
                </p>
                <button
                  type="button"
                  className="btn btn-success w-100 mt-2"
                  onClick={() => verDetalle(serv)}
                >
                  Más información
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Servicios;