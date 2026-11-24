import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CitaMedica } from './ReservasHoras';
import type { UsuarioRegistrado } from './RegistroUsuario';
import { obtenerReservas, cambiarEstadoReserva } from '../services/reservaService';
import { obtenerUsuarios } from '../services/usuarioService';
import { crearFicha } from '../services/fichaService';

const Nutricionista: React.FC = () => {
  const navigate = useNavigate();

  const sesionGuardada = localStorage.getItem('nutrivida_usuario_activo');
  const usuarioActivo = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  const datosNutricionista = usuarioActivo
    ? {
        nombre: `${usuarioActivo.nombres || ''} ${usuarioActivo.apellidos || ''}`.trim() || 'Profesional NutriVida',
        rut: usuarioActivo.rut || 'Sin RUT',
        correo: usuarioActivo.correo || '',
        rol: usuarioActivo.rol || 'NUTRICIONISTA',
      }
    : null;

  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [pacientes, setPacientes] = useState<UsuarioRegistrado[]>([]);

  const [rutPaciente, setRutPaciente] = useState('');
  const [pesoKg, setPesoKg] = useState('');
  const [tallaCm, setTallaCm] = useState('');
  const [cinturaCm, setCinturaCm] = useState('');
  const [planAlimenticio, setPlanAlimenticio] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    if (!sesionGuardada) {
      navigate('/login');
      return;
    }

    const rol = String(usuarioActivo.rol || '').toUpperCase();
    if (!rol.includes('NUTRI') && rol !== 'NUTRICIONISTA') {
      alert('No tienes permisos de Nutricionista para acceder a esta vista.');
      navigate('/login');
      return;
    }

    const limpiarPrefijoNut = (texto: string) =>
      texto.replace(/^Nut\.\s*/i, '').trim().toLowerCase();

    const nombreNutriSinPrefijo = limpiarPrefijoNut(
      `${usuarioActivo.nombres || ''} ${usuarioActivo.apellidos || ''}`
    );

    obtenerReservas()
      .then((todasLasCitas) => {
        const citasDelNutri = todasLasCitas.filter((cita: any) => {
          if (!cita.profesional) return false;
          const profesionalCita = limpiarPrefijoNut(cita.profesional);
          return (
            profesionalCita.includes(nombreNutriSinPrefijo) ||
            nombreNutriSinPrefijo.includes(profesionalCita)
          );
        });
        setCitas(citasDelNutri);
      })
      .catch((error) => console.error('Error al cargar citas:', error));

    obtenerUsuarios()
      .then((todosLosUsuarios: UsuarioRegistrado[]) => {
        const listaPacientes = todosLosUsuarios.filter(
          (usuario) => String(usuario.rol || '').toUpperCase() === 'PACIENTE'
        );
        setPacientes(listaPacientes);
      })
      .catch((error) => console.error('Error al cargar pacientes:', error));
  }, [navigate, sesionGuardada]);

  const actualizarEstadoCita = async (idCita: string, nuevoEstado: CitaMedica['estado']) => {
    try {
      await cambiarEstadoReserva(idCita, nuevoEstado);

      setCitas((listaActual) =>
        listaActual.map((cita) =>
          String(cita.id) === String(idCita) ? { ...cita, estado: nuevoEstado } : cita
        )
      );
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al actualizar el estado de la cita en el servidor.');
    }
  };

  const guardarFichaClinica = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeExito('');

    const peso = parseFloat(pesoKg);
    const tallaMetros = parseFloat(tallaCm) / 100;
    const imc = Number((peso / (tallaMetros * tallaMetros)).toFixed(1));

    const nuevaFicha = {
      rutPaciente: rutPaciente.replace(/[^0-9kK]/g, '').toUpperCase(),
      fecha: new Date().toISOString().split('T')[0],
      pesoKg: peso,
      tallaCm: parseFloat(tallaCm),
      cinturaCm: parseFloat(cinturaCm),
      imc,
      planAlimenticio,
      observaciones: 'Control registrado digitalmente',
      nutricionista: datosNutricionista?.nombre || 'Nutricionista',
    };

    try {
      await crearFicha(nuevaFicha);

      setMensajeExito(`Mediciones y plan guardados para RUT ${nuevaFicha.rutPaciente}`);
      setPesoKg('');
      setTallaCm('');
      setCinturaCm('');
      setPlanAlimenticio('');
      setRutPaciente('');
    } catch (error: any) {
      console.error('Error al guardar ficha:', error);
      alert(error.message || 'Error al guardar la ficha clínica.');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('nutrivida_usuario_activo');
    navigate('/login');
  };

  if (!datosNutricionista) return null;

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
              onClick={cerrarSesion}
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
                  value={datosNutricionista.nombre}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">RUN:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-run"
                  value={datosNutricionista.rut}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Correo Electrónico:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-correo"
                  value={datosNutricionista.correo}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Especialidad / Rol:</label>
                <input
                  type="text"
                  className="form-control"
                  id="perfil-rol"
                  value={datosNutricionista.rol}
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
                {citas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-3">
                      No tienes citas agendadas a tu nombre.
                    </td>
                  </tr>
                ) : (
                  citas.map((cita: any) => (
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
                            onClick={() => actualizarEstadoCita(cita.id, 'Confirmada')}
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => actualizarEstadoCita(cita.id, 'Cancelada')}
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

          <div className="nv-info-box p-3 rounded mb-5">
            <h4 className="fw-bold mb-3" style={{ color: '#2a492a' }}>
              Registrar Progreso y Plan Alimenticio del Paciente
            </h4>
            {mensajeExito && <div className="alert alert-success py-2">{mensajeExito}</div>}
            <form className="row g-3" onSubmit={guardarFichaClinica}>
              <div className="col-md-3">
                <label className="form-label fw-bold">RUT Paciente</label>
                <input
                  type="text"
                  className="form-control"
                  value={rutPaciente}
                  onChange={(e) => setRutPaciente(e.target.value)}
                  placeholder="128794697"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="350"
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
                  step="0.1"
                  min="50"
                  max="250"
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
                  step="0.1"
                  min="30"
                  max="250"
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
                <button type="submit" className="btn btn-success">
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
                  pacientes.map((paciente) => (
                    <tr key={paciente.rut}>
                      <td>{paciente.rut}</td>
                      <td>
                        {paciente.nombres} {paciente.apellidos}
                      </td>
                      <td>{paciente.correo}</td>
                      <td>
                        {paciente.comuna && paciente.region
                          ? `${paciente.comuna}, ${paciente.region}`
                          : 'Sin ubicación'}
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