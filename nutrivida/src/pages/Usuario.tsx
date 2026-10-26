import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { CitaMedica } from './ReservasHoras';
import type { UsuarioRegistrado } from './RegistroUsuario';

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

    const citasCargadas: CitaMedica[] = JSON.parse(
      localStorage.getItem('nutrivida_citas') ||
        localStorage.getItem('nutrivida_reservas') ||
        '[]'
    );

    const citasFiltradas = citasCargadas.filter(
      (c: any) => c.rutPaciente === rutActual || c.rut === rutActual
    );
    setMisCitas(citasFiltradas);

    const todasLasFichas: MedicionClinica[] = JSON.parse(
      localStorage.getItem('nutrivida_fichas') || '[]'
    );
    const fichasPaciente = todasLasFichas.filter((f) => f.rutPaciente === rutActual);

    if (fichasPaciente.length === 0) {
      setMisMediciones([
        {
          id: 'MED-1',
          rutPaciente: rutActual,
          fecha: '2026-10-05',
          pesoKg: 74.5,
          tallaCm: 170,
          cinturaCm: 84,
          imc: 25.8,
          nutricionista: 'Carolina Fuentes M.',
          planAlimenticio:
            'Desayuno: Avena con chía y fruta. Almuerzo: 150g proteína magra + quínoa + ensalada verde. Cena: Tortilla de verduras. Agua: 2L diarios.',
          observaciones: 'Control en 15 días.',
        },
      ]);
    } else {
      setMisMediciones(fichasPaciente);
    }
  }, [navigate]);

  const handleCancelarCita = (idCita: string) => {
    const claveStorage = localStorage.getItem('nutrivida_citas')
      ? 'nutrivida_citas'
      : 'nutrivida_reservas';

    const todasLasCitas: any[] = JSON.parse(
      localStorage.getItem(claveStorage) || '[]'
    );

    const actualizadas = todasLasCitas.map((c) =>
      c.id === idCita ? { ...c, estado: 'Cancelada' } : c
    );

    localStorage.setItem(claveStorage, JSON.stringify(actualizadas));
    localStorage.setItem('nutrivida_reservas', JSON.stringify(actualizadas));

    // Actualizar pantalla en tiempo real
    if (paciente) {
      setMisCitas(actualizadas.filter((c) => c.rutPaciente === paciente.rut || c.rut === paciente.rut));
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
        </div>
      </section>
    </main>
  );
};

export default Usuario;