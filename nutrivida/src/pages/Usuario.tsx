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

  const [paciente, setPaciente] = useState<UsuarioRegistrado>({
    nombres: 'Paciente',
    apellidos: 'NutriVida',
    rut: '188663338',
    correo: 'paciente@nutrivida.cl',
    fechaNacimiento: '1998-05-14',
    region: 'La Araucanía',
    comuna: 'Temuco',
    direccion: 'Av. Alemania 0850',
    rol: 'PACIENTE',
  });

  const [misCitas, setMisCitas] = useState<CitaMedica[]>([]);
  const [misMediciones, setMisMediciones] = useState<MedicionClinica[]>([]);

  useEffect(() => {
    const sesionStr = localStorage.getItem('nutrivida_usuario_activo');
    let rutActual = '188663338';

    if (sesionStr) {
      const userObj: UsuarioRegistrado = JSON.parse(sesionStr);
      setPaciente(userObj);
      rutActual = userObj.rut;
    }

    const todasLasCitas: CitaMedica[] = JSON.parse(
      localStorage.getItem('nutrivida_citas') || '[]'
    );
    setMisCitas(
      todasLasCitas.filter((c) => !sesionStr || c.rutPaciente === rutActual)
    );

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
  }, []);

  const handleCancelarCita = (idCita: string) => {
    const todasLasCitas: CitaMedica[] = JSON.parse(
      localStorage.getItem('nutrivida_citas') || '[]'
    );
    const actualizadas = todasLasCitas.map((c) =>
      c.id === idCita ? { ...c, estado: 'Cancelada' as const } : c
    );
    localStorage.setItem('nutrivida_citas', JSON.stringify(actualizadas));
    setMisCitas(actualizadas);
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('nutrivida_usuario_activo');
    navigate('/login');
  };

  const ultimaMedicion = misMediciones[misMediciones.length - 1];

  return (
    <main>
      <section className="section-usuario">
        <div className="w-100 p-2 p-md-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '3px solid #2a492a' }}>
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
                  value={`${paciente.nombres} ${paciente.apellidos}`}
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
                  value={`${paciente.comuna}, ${paciente.region}`}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Plan Alimenticio y Mediciones */}
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
            <Link to="/reservas-horas" className="btn nv-btn-primary btn-sm">
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
                              Reprogramar
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