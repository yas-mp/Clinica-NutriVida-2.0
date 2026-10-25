import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LISTADO_SERVICIOS } from '../components/data/ListadoServicios';
import type { ServicioNutricional } from '../components/data/ListadoServicios';


export const CATALOGO_SERVICIOS: ServicioNutricional[] = LISTADO_SERVICIOS;
export type { ServicioNutricional };

const Servicios: React.FC = () => {
  const navigate = useNavigate();

  const formatearPrecio = (valor: number) =>
    valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  return (
    <div className="servicios">
      <main className="container my-5">
        <div className="text-center mb-4">
          <h1
            className="fw-bold"
            style={{ borderBottom: '3px solid #2a492a', paddingBottom: '12px' }}
          >
            Nuestros Servicios
          </h1>
          <p className="text-muted">Conoce los planes y consultas que tenemos para ti</p>
        </div>

        <div id="listaServicios" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {LISTADO_SERVICIOS.map((serv) => (
            <div className="col" key={serv.id}>
              <article className="card-servicio">
                <div>
                  <img src={serv.imagen} alt={serv.nombre} />
                  <span className="badge-tipo d-inline-block">{serv.categoria}</span>
                  <h3>{serv.nombre}</h3>
                  <p className="text-muted small mb-3">{serv.descripcion}</p>
                </div>
                <div>
                  <div className="precio">{formatearPrecio(serv.precio)}</div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn-detalle"
                      onClick={() => navigate(`/servicios/${serv.id}`)}
                    >
                      Ver Detalle
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success w-100 fw-semibold"
                      style={{ borderRadius: '10px' }}
                      onClick={() =>
                        navigate('/reservas-horas', {
                          state: {
                            servicioPreseleccionado: serv.nombre,
                            profesionalPreseleccionado:
                              serv.profesional !== 'Equipo NutriVida' ? serv.profesional : '',
                          },
                        })
                      }
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Servicios;