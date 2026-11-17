import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { CitaMedica } from './ReservasHoras';
import type { UsuarioRegistrado } from './RegistroUsuario';
import {
  listarPagosPorRut,
  listarPagosPorUsuario,
  obtenerMensajeError as obtenerMensajeErrorPago,
  obtenerUsuarioIdSesion,
} from '../services/pagoService';
import type { Pago } from '../services/pagoService';

function formatearFechaPago(fecha: string | null): string {
  if (!fecha) {
    return '—';
  }

  const [anio, mes, dia] = fecha.split('T')[0].split('-');
  if (anio && mes && dia) {
    return `${dia}-${mes}-${anio}`;
  }

  return fecha;
}

function claseEstadoPago(estado: string): string {
  switch (estado) {
    case 'Aprobado':
      return 'badge bg-success';
    case 'Pendiente':
      return 'badge bg-warning text-dark';
    case 'Rechazado':
      return 'badge bg-danger';
    default:
      return 'badge bg-secondary';
  }
}

export interface MedicionClinica {
  id: string;
  rutPaciente: string;
  fecha: string;
  pesoKg: number;
  tallaCm: number;
  cinturaCm: number;
  imc: number;
  planAlimenticio: string;
  observaciones: string;
  nutricionista: string;
}

const Usuario: React.FC = () => {
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<UsuarioRegistrado | null>(() => {
    const sesionActiva = localStorage.getItem('nutrivida_usuario_activo');
    return sesionActiva ? JSON.parse(sesionActiva) : null;
  });

  const [misCitas, setMisCitas] = useState<CitaMedica[]>([]);
  const [misMediciones, setMisMediciones] = useState<MedicionClinica[]>([]);
  const [misPagos, setMisPagos] = useState<Pago[]>([]);
  const [cargandoPagos, setCargandoPagos] = useState<boolean>(false);
  const [errorPagos, setErrorPagos] = useState<string | null>(null);

  useEffect(() => {
    const sesionStr = localStorage.getItem('nutrivida_usuario_activo');

    if (!sesionStr) {
      navigate('/login');
      return;
    }

    const userObj: UsuarioRegistrado = JSON.parse(sesionStr);
    setPaciente(userObj);
    const rutActual = userObj.rut;

    const rolUpper = String(userObj.rol || '').toUpperCase();
    if (rolUpper.includes('NUTRI') || rolUpper === 'NUTRICIONISTA') {
      navigate('/nutricionista');
      return;
    }

    const limpiarRut = (r: string) =>
      String(r || '')
        .replace(/[^0-9kK]/g, '')
        .toUpperCase();
    const rutActualLimpio = limpiarRut(rutActual);

    // 1. GET Citas desde ms-reservas (puerto 8083)
    fetch('http://localhost:8083/api/reservas')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar reservas');
        return res.json();
      })
      .then((todasLasCitas) => {
        const citasFiltradas = todasLasCitas.filter(
          (c: any) =>
            limpiarRut(c.rutPaciente) === rutActualLimpio ||
            limpiarRut(c.rut) === rutActualLimpio
        );
        setMisCitas(citasFiltradas);
      })
      .catch((error) => console.error('Error en citas:', error));

    // 2. GET Fichas Médicas desde ms-fichas (puerto 8084)
    fetch('http://localhost:8084/api/fichas')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar fichas');
        return res.json();
      })
      .then((todasLasFichas) => {
        const fichasPaciente = todasLasFichas.filter(
          (f: any) => limpiarRut(f.rutPaciente) === rutActualLimpio
        );
        setMisMediciones(fichasPaciente);
      })
      .catch((error) => console.error('Error en fichas:', error));
  }, [navigate]);

  useEffect(() => {
    if (!paciente) {
      return;
    }

    let activo = true;

    const cargarPagos = async () => {
      setCargandoPagos(true);
      setErrorPagos(null);

      try {
        const usuarioId = obtenerUsuarioIdSesion();
        const pagos = usuarioId
          ? await listarPagosPorUsuario(usuarioId)
          : await listarPagosPorRut(paciente.rut);

        if (activo) {
          setMisPagos(pagos);
        }
      } catch (err) {
        if (activo) {
          setMisPagos([]);
          setErrorPagos(obtenerMensajeErrorPago(err));
        }
      } finally {
        if (activo) {
          setCargandoPagos(false);
        }
      }
    };

    void cargarPagos();

    return () => {
      activo = false;
    };
  }, [paciente]);

  useEffect(() => {
    if (!paciente) {
      return;
    }

    let activo = true;

    const cargarPagos = async () => {
      setCargandoPagos(true);
      setErrorPagos(null);

      try {
        const usuarioId = obtenerUsuarioIdSesion();
        const pagos = usuarioId
          ? await listarPagosPorUsuario(usuarioId)
          : await listarPagosPorRut(paciente.rut);

        if (activo) {
          setMisPagos(pagos);
        }
      } catch (err) {
        if (activo) {
          setMisPagos([]);
          setErrorPagos(obtenerMensajeErrorPago(err));
        }
      } finally {
        if (activo) {
          setCargandoPagos(false);
        }
      }
    };

    void cargarPagos();

    return () => {
      activo = false;
    };
  }, [paciente]);

  // 3. PUT para cancelar cita en ms-reservas (puerto 8083)
  const handleCancelarCita = async (idCita: string) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta cita?')) return;

    try {
      const respuesta = await fetch(
        `http://localhost:8083/api/reservas/${idCita}/estado?estado=Cancelada`,
        {
          method: 'PUT',
        }
      );

      if (!respuesta.ok) {
        throw new Error('No se pudo cancelar la cita en el servidor');
      }

      setMisCitas((prevCitas) =>
        prevCitas.map((c) =>
          String(c.id) === String(idCita) ? { ...c, estado: 'Cancelada' } : c
        )
      );
      alert('Cita cancelada correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al cancelar la cita');
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('nutrivida_usuario_activo');
    navigate('/login');
  };

  const ultimaMedicion = misMediciones[misMediciones.length - 1];

  if (!paciente) return null;

  return (
    <main>
      <section className="section-usuario">
        <div className="w-100 p-2 p-md-4">
          <div
            className="d-flex justify-content-between align-items-center mb-4 pb-2"
            style={{ borderBottom: '3px solid #2a492a' }}
          >
            <h2 className="fw-bold m-0" style={{ color: '#2a492a' }} id="titulo-bienvenida">
              Bienvenido a tu Portal
            </h2>
            <button
              type="button"
              className="btn btn-danger btn-sm rounded-pill px-3"
              onClick={handleCerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>

          <div className="nv-info-box mb-4 p-3 rounded">
            <h4 className="fw-bold mb-3" style={{ color: '#2a492a' }}>
              Mis Datos Personales
            </h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nombre Completo:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-nombre"
                  value={`${paciente.nombres} ${paciente.apellidos}`.trim()}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">RUN:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-run"
                  value={paciente.rut}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Correo Electrónico:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-correo"
                  value={paciente.correo}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Comuna / Región:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-ubicacion"
                  value={paciente.comuna && paciente.region ? `${paciente.comuna}, ${paciente.region}` : ''}
                  readOnly
                />
              </div>
            </div>
          </div>

          {ultimaMedicion && (
            <div className="nv-info-box mb-4 p-3 rounded">
              <h4 className="fw-bold mb-2" style={{ color: '#2a492a' }}>
                Mi Plan Alimenticio y Progreso Clínico
              </h4>
              <p className="mb-2">
                <strong>Plan Vigente:</strong> {ultimaMedicion.planAlimenticio}
              </p>
              <div className="d-flex flex-wrap gap-3 small text-muted">
                <span><strong>Último Peso:</strong> {ultimaMedicion.pesoKg} kg</span>
                <span><strong>Talla:</strong> {ultimaMedicion.tallaCm} cm</span>
                <span><strong>Cintura:</strong> {ultimaMedicion.cinturaCm} cm</span>
                <span><strong>IMC:</strong> {ultimaMedicion.imc}</span>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="m-0 fw-bold" style={{ color: '#2a492a' }}>
              Mis Citas Médicas
            </h4>
            <Link to="/reservas-horas" className="btn btn-success btn-sm">
              + Reservar Cita
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle" id="tabla-citas">
              <thead className="nv-table-head">
                <tr>
                  <th>Servicio</th>
                  <th>Profesional</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {misCitas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-3">
                      No tienes citas registradas.
                    </td>
                  </tr>
                ) : (
                  misCitas.map((cita) => (
                    <tr key={cita.id}>
                      <td>{cita.servicio}</td>
                      <td>{cita.profesional}</td>
                      <td>{cita.fecha}</td>
                      <td>{cita.hora}</td>
                      <td>
                        <span
                          className={`badge ${
                            cita.estado === 'Confirmada'
                              ? 'bg-success'
                              : cita.estado === 'Cancelada'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {cita.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        {cita.estado !== 'Cancelada' && (
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                navigate('/reservas-horas', {
                                  state: { citaAReprogramar: cita },
                                })
                              }
                            >
                              Modificar
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelarCita(cita.id)}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
            <h4 className="m-0 fw-bold" style={{ color: '#2a492a' }}>
              Mis Pagos
            </h4>
            <span className="text-muted small">
              Historial registrado en el servicio de pagos
            </span>
          </div>

          {errorPagos && (
            <div className="alert alert-danger" role="alert">
              {errorPagos}
            </div>
          )}

          {cargandoPagos ? (
            <div className="text-center py-4" role="status" aria-live="polite">
              <div className="spinner-border text-success" aria-hidden="true"></div>
              <p className="text-muted mt-3 mb-0">Cargando tus pagos...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle" id="tabla-pagos">
                <thead className="nv-table-head">
                  <tr>
                    <th>Comprobante</th>
                    <th>Fecha</th>
                    <th>Servicio</th>
                    <th>Monto</th>
                    <th>Medio de Pago</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {misPagos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-3">
                        No tienes pagos registrados.
                      </td>
                    </tr>
                  ) : (
                    misPagos.map((pago) => (
                      <tr key={pago.id}>
                        <td>
                          <strong>{pago.numeroComprobante}</strong>
                        </td>
                        <td className="text-nowrap">
                          {formatearFechaPago(pago.fechaPago)}
                        </td>
                        <td>
                          {pago.servicioNombre}
                          <div className="small text-muted">{pago.codigoServicio}</div>
                        </td>
                        <td>${pago.monto.toLocaleString('es-CL')}</td>
                        <td>
                          {pago.metodoPago}
                          <div className="small text-muted">**** {pago.ultimos4Digitos}</div>
                        </td>
                        <td>
                          <span className={claseEstadoPago(pago.estado)}>{pago.estado}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Usuario;