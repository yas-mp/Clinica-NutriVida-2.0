import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LISTADO_SERVICIOS } from '../components/data/ListadoServicios';
import type { ServicioNutricional } from '../components/data/ListadoServicios';
import {
  listarServicios,
  listarTiposServicio,
  obtenerMensajeError,
} from '../services/servicioService';
import type { TipoServicio } from '../services/servicioService';
import { resolverImagenServicio } from '../services/servicioImagenes';

/**
 * Catálogo heredado en localStorage para vistas que todavía no consumen la API
 * (por ejemplo ReservasHoras). El catálogo visible de esta página se obtiene
 * siempre desde el microservicio de Servicios.
 */
export const CATALOGO_SERVICIOS: ServicioNutricional[] = LISTADO_SERVICIOS;
export type { ServicioNutricional };

const Servicios: React.FC = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [servicios, setServicios] = useState<ServicioNutricional[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarCatalogo = useCallback(async () => {
    const [respuestaServicios, respuestaTipos] = await Promise.allSettled([
      listarServicios(),
      listarTiposServicio(),
    ]);

    if (respuestaServicios.status === 'fulfilled') {
      setServicios(respuestaServicios.value);
      setTiposServicio(respuestaTipos.status === 'fulfilled' ? respuestaTipos.value : []);
      setError(null);
    } else {
      setServicios([]);
      setTiposServicio([]);
      setError(obtenerMensajeError(respuestaServicios.reason));
    }

    setCargando(false);
  }, []);

  useEffect(() => {
    // Carga inicial del catálogo desde la API: el estado se actualiza después del fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarCatalogo();
  }, [cargarCatalogo]);

  const reintentarCarga = () => {
    setCargando(true);
    setError(null);
    void cargarCatalogo();
  };

  const verDetalle = (servicio: ServicioNutricional) => {
    localStorage.setItem('servicio', JSON.stringify(servicio));
    navigate(`/servicios/${servicio.id}`);
  };

  const opcionesTipo = useMemo(() => {
    const totalPorTipo = new Map<string, number>();

    servicios.forEach((servicio) => {
      const tipo = servicio.tipo?.trim();
      if (tipo) {
        totalPorTipo.set(tipo, (totalPorTipo.get(tipo) ?? 0) + 1);
      }
    });

    const nombres = tiposServicio
      .map((tipo) => tipo.nombreTipo)
      .filter((nombre) => totalPorTipo.has(nombre));

    totalPorTipo.forEach((_total, nombre) => {
      if (!nombres.includes(nombre)) {
        nombres.push(nombre);
      }
    });

    return nombres.map((nombre) => ({ nombre, total: totalPorTipo.get(nombre) ?? 0 }));
  }, [servicios, tiposServicio]);

  const serviciosFiltrados = useMemo(() => {
    const textoBuscado = busqueda.trim().toLowerCase();

    return servicios.filter((servicio) => {
      const coincideTexto =
        textoBuscado === '' ||
        servicio.nombre.toLowerCase().includes(textoBuscado) ||
        servicio.codigo.toLowerCase().includes(textoBuscado);

      const coincideTipo =
        filtroTipo === 'Todos' ||
        (servicio.tipo ?? '').toLowerCase() === filtroTipo.toLowerCase();

      return coincideTexto && coincideTipo;
    });
  }, [servicios, busqueda, filtroTipo]);

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
            disabled={cargando}
          >
            <option value="Todos">Todos los tipos ({servicios.length})</option>
            {opcionesTipo.map((opcion) => (
              <option key={opcion.nombre} value={opcion.nombre}>
                {opcion.nombre} ({opcion.total})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm align-self-start align-self-md-center"
            onClick={reintentarCarga}
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando ? (
        <div className="text-center py-5" role="status" aria-live="polite">
          <div className="spinner-border text-success" aria-hidden="true"></div>
          <p className="text-muted mt-3 mb-0">Cargando servicios...</p>
        </div>
      ) : (
        <>
          {!error && serviciosFiltrados.length === 0 && (
            <p className="text-center text-muted py-4">
              No encontramos servicios que coincidan con tu búsqueda.
            </p>
          )}

          <div
            id="listaServicios"
            className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
          >
            {serviciosFiltrados.map((serv) => (
              <div className="col" key={serv.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={resolverImagenServicio(serv.imagen)}
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
        </>
      )}
    </main>
  );
};

export default Servicios;
