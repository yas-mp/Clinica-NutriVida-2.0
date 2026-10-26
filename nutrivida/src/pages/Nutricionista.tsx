import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CitaMedica } from './ReservasHoras';
import type { UsuarioRegistrado } from './RegistroUsuario';
import type { MedicionClinica } from './Usuario';

const Nutricionista: React.FC = () => {
  const navigate = useNavigate();

  // 1. Obtener directamente los datos del profesional en sesión activa
  const sesionActiva = localStorage.getItem('nutrivida_usuario_activo');
  const usuarioLogueado = sesionActiva ? JSON.parse(sesionActiva) : null;

  const nutricionista = usuarioLogueado
    ? {
        nombre: `${usuarioLogueado.nombres || ''} ${usuarioLogueado.apellidos || ''}`.trim() || usuarioLogueado.nombre || 'Profesional NutriVida',
        run: usuarioLogueado.rut || usuarioLogueado.run || 'Sin RUT',
        correo: usuarioLogueado.correo || '',
        rol: usuarioLogueado.especialidad || usuarioLogueado.rol || 'Nutricionista Clínico',
      }
    : null;

  const [citasAgenda, setCitasAgenda] = useState<CitaMedica[]>([]);
  const [pacientes, setPacientes] = useState<UsuarioRegistrado[]>([]);

  const [rutFicha, setRutFicha] = useState('');
  const [pesoKg, setPesoKg] = useState('');
  const [tallaCm, setTallaCm] = useState('');
  const [cinturaCm, setCinturaCm] = useState('');
  const [planAlimenticio, setPlanAlimenticio] = useState('');
  const [mensajeFicha, setMensajeFicha] = useState('');

  useEffect(() => {
    if (!sesionActiva) {
      navigate('/login');
      return;
    }
    
    const rolUpper = String(usuarioLogueado.rol || '').toUpperCase();
    const esNutri = rolUpper.includes('NUTRI') || rolUpper === 'NUTRICIONISTA';
    
    if (!esNutri) {
      alert("No tienes permisos de Nutricionista para acceder a esta vista.");
      navigate('/login');
      return;
    }

    const nombreCompleto = `${usuarioLogueado.nombres || ''} ${usuarioLogueado.apellidos || ''}`.trim();

    const todasLasCitas: any[] = JSON.parse(
      localStorage.getItem('nutrivida_citas') ||
        localStorage.getItem('nutrivida_reservas') ||
        '[]'
    );

    const misCitas = todasLasCitas.filter((c: any) => {
      if (!c.profesional) return true;

      const profCita = c.profesional.toLowerCase();
      const profActual = nombreCompleto.toLowerCase();
      const primerNombre = (usuarioLogueado.nombres || '').toLowerCase();

      return (
        profCita.includes(profActual) ||
        profActual.includes(profCita) ||
        (primerNombre && profCita.includes(primerNombre))
      );
    });

    setCitasAgenda(misCitas);

    const todosLosUsuarios: UsuarioRegistrado[] = JSON.parse(
      localStorage.getItem('nutrivida_usuarios') || '[]'
    );
    const soloPacientes = todosLosUsuarios.filter((u) => u.rol === 'PACIENTE' || !u.rol);
    setPacientes(soloPacientes);
  }, [navigate, sesionActiva]);

  const cambiarEstadoCita = (idCita: string, nuevoEstado: CitaMedica['estado']) => {
    const todasLasCitas: any[] = JSON.parse(
      localStorage.getItem('nutrivida_citas') ||
        localStorage.getItem('nutrivida_reservas') ||
        '[]'
    );

    const actualizadasGlobales = todasLasCitas.map((c) =>
      c.id === idCita ? { ...c, estado: nuevoEstado } : c
    );

    localStorage.setItem('nutrivida_citas', JSON.stringify(actualizadasGlobales));
    localStorage.setItem('nutrivida_reservas', JSON.stringify(actualizadasGlobales));

    setCitasAgenda((prev) =>
      prev.map((c) => (c.id === idCita ? { ...c, estado: nuevoEstado } : c))
    );
  };

  const handleGuardarFicha = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const peso = parseFloat(pesoKg);
    const tallaM = parseFloat(tallaCm) / 100;
    const imc = Number((peso / (tallaM * tallaM)).toFixed(1));

    const nuevaFicha: MedicionClinica = {
      id: `MED-${Date.now()}`,
      rutPaciente: rutFicha.replace(/[^0-9kK]/g, '').toUpperCase(),
      fecha: new Date().toISOString().split('T')[0],
      pesoKg: peso,
      tallaCm: parseFloat(tallaCm),
      cinturaCm: parseFloat(cinturaCm),
      imc,
      planAlimenticio,
      observaciones: 'Control registrado digitalmente',
      nutricionista: nutricionista?.nombre || 'Nutricionista',
    };

    const fichas: MedicionClinica[] = JSON.parse(
      localStorage.getItem('nutrivida_fichas') || '[]'
    );
    localStorage.setItem('nutrivida_fichas', JSON.stringify([...fichas, nuevaFicha]));

    setMensajeFicha(`Mediciones y plan guardados para RUT ${nuevaFicha.rutPaciente}`);
    setPesoKg('');
    setTallaCm('');
    setCinturaCm('');
    setPlanAlimenticio('');
    setRutFicha('');
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('nutrivida_usuario_activo');
    navigate('/login');
  };

  if (!nutricionista) return null;

  return (
    <main>
      <section className="section-usuario">
        <div className="w-100 p-2 p-md-4">
          <div
            className="d-flex justify-content-between align-items-center mb-4 pb-2"
            style={{ borderBottom: '3px solid #2a492a' }}
          >
            <h2 className="fw-bold m-0" style={{ color: '#2a492a' }} id="titulo-bienvenida-nutri">
              Panel del Nutricionista
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
              Mis Datos Profesionales
            </h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nombre Profesional:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-nombre"
                  value={nutricionista.nombre}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">RUN:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-run"
                  value={nutricionista.run}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Correo Electrónico:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-correo"
                  value={nutricionista.correo}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Especialidad / Rol:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-rol"
                  value={nutricionista.rol}
                  readOnly
                />
              </div>
            </div>
          </div>

          <h4 className="fw-bold mb-3" style={{ color: '#2a492a' }}>
            Mi Agenda de Pacientes Agendados
          </h4>
          <div className="table-responsive mb-5">
            <table className="table table-hover align-middle">
              <thead className="nv-table-head">
                <tr>
                  <th>RUT Paciente</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody id="tabla-citas-nutri">
                {citasAgenda.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-3">
                      No tienes citas agendadas a tu nombre.
                    </td>
                  </tr>
                ) : (
                  citasAgenda.map((cita: any) => (
                    <tr key={cita.id}>
                      <td>{cita.rutPaciente || cita.rut}</td>
                      <td>{cita.servicio}</td>
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
                          {cita.estado || 'Pendiente'}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => cambiarEstadoCita(cita.id, 'Confirmada')}
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => cambiarEstadoCita(cita.id, 'Cancelada')}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Registro de Ficha Clínica Digital */}
          <div className="nv-info-box p-3 rounded mb-5">
            <h4 className="fw-bold mb-3" style={{ color: '#2a492a' }}>
              Registrar Progreso y Plan Alimenticio del Paciente
            </h4>
            {mensajeFicha && <div className="alert alert-success py-2">{mensajeFicha}</div>}
            <form className="row g-3" onSubmit={handleGuardarFicha}>
              <div className="col-md-3">
                <label className="form-label fw-bold">RUT Paciente</label>
                <input
                  type="text"
                  className="form-control"
                  value={rutFicha}
                  onChange={(e) => setRutFicha(e.target.value)}
                  placeholder="188663338"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={pesoKg}
                  onChange={(e) => setPesoKg(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Talla (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  value={tallaCm}
                  onChange={(e) => setTallaCm(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-control"
                  value={cinturaCm}
                  onChange={(e) => setCinturaCm(e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Plan Alimenticio Digital</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={planAlimenticio}
                  onChange={(e) => setPlanAlimenticio(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-success ">
                  Guardar Ficha Clínica
                </button>
              </div>
            </form>
          </div>

          <h4 className="fw-bold mb-3" style={{ color: '#2a492a' }}>
            Lista de Pacientes Registrados
          </h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="nv-table-head">
                <tr>
                  <th>RUT</th>
                  <th>Nombre Paciente</th>
                  <th>Correo</th>
                  <th>Ubicación</th>
                </tr>
              </thead>
              <tbody id="tabla-pacientes-nutri">
                {pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-3">
                      No hay pacientes registrados aún.
                    </td>
                  </tr>
                ) : (
                  pacientes.map((pac) => (
                    <tr key={pac.rut}>
                      <td>{pac.rut}</td>
                      <td>
                        {pac.nombres} {pac.apellidos}
                      </td>
                      <td>{pac.correo}</td>
                      <td>
                        {pac.comuna && pac.region ? `${pac.comuna}, ${pac.region}` : 'Sin ubicación'}
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

export default Nutricionista;