import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { CitaMedica } from './ReservasHoras';
import type { UsuarioRegistrado } from './RegistroUsuario';
import { obtenerReservas, cancelarReserva } from '../services/reservaService';
import {
  listarPagosPorRut,
  listarPagosPorUsuario,
  obtenerMensajeError as obtenerMensajeErrorPago,
  obtenerUsuarioIdSesion,
} from '../services/pagoService';
import type { Pago } from '../services/pagoService';

function formatearFecha(fecha: string | null): string {
  if (!fecha) return '—';
  const [anio, mes, dia] = fecha.split('T')[0].split('-');
  return anio && mes && dia ? `${dia}-${mes}-${anio}` : fecha;
}

function obtenerColorEstadoPago(estado: string): string {
  if (estado === 'Aprobado') return 'badge bg-success';
  if (estado === 'Pendiente') return 'badge bg-warning text-dark';
  if (estado === 'Rechazado') return 'badge bg-danger';
  return 'badge bg-secondary';
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

  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioRegistrado | null>(() => {
    const sesionGuardada = localStorage.getItem('nutrivida_usuario_activo');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [fichasClinicas, setFichasClinicas] = useState<MedicionClinica[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargandoPagos, setCargandoPagos] = useState(false);
  const [errorPagos, setErrorPagos] = useState<string | null>(null);

  useEffect(() => {
    const sesionGuardada = localStorage.getItem('nutrivida_usuario_activo');

    if (!sesionGuardada) {
      navigate('/login');
      return;
    }

    const datosUsuario: UsuarioRegistrado = JSON.parse(sesionGuardada);
    setUsuarioActivo(datosUsuario);

    const rol = String(datosUsuario.rol || '').toUpperCase();
    if (rol.includes('NUTRI') || rol === 'NUTRICIONISTA') {
      navigate('/nutricionista');
      return;
    }

    const limpiarRut = (rut: string) =>
      String(rut || '').replace(/[^0-9kK]/g, '').toUpperCase();

    const rutPaciente = limpiarRut(datosUsuario.rut);

    // Cargar las citas del paciente
    obtenerReservas()
      .then((todasLasCitas) => {
        const citasDelPaciente = todasLasCitas.filter(
          (cita: any) =>
            limpiarRut(cita.rutPaciente) === rutPaciente ||
            limpiarRut(cita.rut) === rutPaciente
        );
        setCitas(citasDelPaciente);
      })
      .catch((error) => console.error('Error al cargar citas:', error));

    // Cargar las fichas médicas del paciente
    fetch('http://localhost:8084/api/fichas')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar fichas');
        return res.json();
      })
      .then((todasLasFichas) => {
        const fichasDelPaciente = todasLasFichas.filter(
          (ficha: any) => limpiarRut(ficha.rutPaciente) === rutPaciente
        );
        setFichasClinicas(fichasDelPaciente);
      })
      .catch((error) => console.error('Error al cargar fichas:', error));
  }, [navigate]);

  useEffect(() => {
    if (!usuarioActivo) return;

    let componenteMontado = true;

    const cargarHistorialPagos = async () => {
      setCargandoPagos(true);
      setErrorPagos(null);

      try {
        const idUsuario = obtenerUsuarioIdSesion();
        const listaPagos = idUsuario
          ? await listarPagosPorUsuario(idUsuario)
          : await listarPagosPorRut(usuarioActivo.rut);

        if (componenteMontado) {
          setPagos(listaPagos);
        }
      } catch (error) {
        if (componenteMontado) {
          setPagos([]);
          setErrorPagos(obtenerMensajeErrorPago(error));
        }
      } finally {
        if (componenteMontado) {
          setCargandoPagos(false);
        }
      }
    };

    cargarHistorialPagos();

    return () => {
      componenteMontado = false;
    };
  }, [usuarioActivo]);

  const anularCita = async (idCita: string) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta cita?')) return;

    try {
      await cancelarReserva(idCita);

      setCitas((listaActual) =>
        listaActual.map((cita) =>
          String(cita.id) === String(idCita) ? { ...cita, estado: 'Cancelada' } : cita
        )
      );
      alert('Cita cancelada correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al cancelar la cita');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('nutrivida_usuario_activo');
    navigate('/login');
  };

  const ultimaFicha = fichasClinicas[fichasClinicas.length - 1];

  if (!usuarioActivo) return null;

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
              onClick={cerrarSesion}
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
                  value={`${usuarioActivo.nombres} ${usuarioActivo.apellidos}`.trim()}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">RUN:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-run"
                  value={usuarioActivo.rut}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Correo Electrónico:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-correo"
                  value={usuarioActivo.correo}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Comuna / Región:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-ubicacion"
                  value={
                    usuarioActivo.comuna && usuarioActivo.region
                      ? `${usuarioActivo.comuna}, ${usuarioActivo.region}`
                      : ''
                  }
                  readOnly
                />
              </div>
            </div>
          </div>

          {ultimaFicha && (
            <div className="nv-info-box mb-4 p-3 rounded">
              <h4 className="fw-bold mb-2" style={{ color: '#2a492a' }}>
                Mi Plan Alimenticio y Progreso Clínico
              </h4>
              <p className="mb-2">
                <strong>Plan Vigente:</strong> {ultimaFicha.planAlimenticio}
              </p>
              <div className="d-flex flex-wrap gap-3 small text-muted">
                <span><strong>Último Peso:</strong> {ultimaFicha.pesoKg} kg</span>
                <span><strong>Talla:</strong> {ultimaFicha.tallaCm} cm</span>
                <span><strong>Cintura:</strong> {ultimaFicha.cinturaCm} cm</span>
                <span><strong>IMC:</strong> {ultimaFicha.imc}</span>
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
                {citas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-3">
                      No tienes citas registradas.
                    </td>
                  </tr>
                ) : (
                  citas.map((cita) => (
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
                              onClick={() => anularCita(cita.id)}
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
                  {pagos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-3">
                        No tienes pagos registrados.
                      </td>
                    </tr>
                  ) : (
                    pagos.map((pago) => (
                      <tr key={pago.id}>
                        <td>
                          <strong>{pago.numeroComprobante}</strong>
                        </td>
                        <td className="text-nowrap">
                          {formatearFecha(pago.fechaPago)}
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
                          <span className={obtenerColorEstadoPago(pago.estado)}>
                            {pago.estado}
                          </span>
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