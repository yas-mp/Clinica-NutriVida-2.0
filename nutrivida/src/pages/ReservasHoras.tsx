import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LISTA_PROFESIONALES } from './Profesionales';
import { CATALOGO_SERVICIOS } from './Servicios';

export interface CitaMedica {
  id: string;
  rutPaciente: string;
  servicio: string;
  profesional: string;
  motivo: string;
  fecha: string;
  hora: string;
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Realizada';
  recordatorioEnviado: boolean;
}

const HORARIOS_DISPONIBLES = ['09:00', '10:00', '11:00', '15:00', '16:00'];

const ReservasHoras: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const statePreseleccion = location.state as {
    profesionalPreseleccionado?: string;
    servicioPreseleccionado?: string;
    citaAReprogramar?: CitaMedica;
  } | null;

  const [rut, setRut] = useState('');
  const [servicio, setServicio] = useState('');
  const [profesional, setProfesional] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState<string>('');
  const [errorReserva, setErrorReserva] = useState<string>('');

  useEffect(() => {
    const sesionActiva = localStorage.getItem('nutrivida_usuario_activo');
    if (sesionActiva) {
      const usuario = JSON.parse(sesionActiva);
      if (usuario.rut) setRut(usuario.rut);
    }

    if (statePreseleccion?.profesionalPreseleccionado) {
      setProfesional(statePreseleccion.profesionalPreseleccionado);
    }
    if (statePreseleccion?.servicioPreseleccionado) {
      setServicio(statePreseleccion.servicioPreseleccionado);
    }
    if (statePreseleccion?.citaAReprogramar) {
      const c = statePreseleccion.citaAReprogramar;
      setRut(c.rutPaciente);
      setServicio(c.servicio);
      setProfesional(c.profesional);
      setMotivo(c.motivo || '');
      setFecha(c.fecha);
      setHora(c.hora);
    }
  }, [statePreseleccion]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorReserva('');
    setMensajeConfirmacion('');

    const citasExistentes: CitaMedica[] = JSON.parse(
      localStorage.getItem('nutrivida_citas') || '[]'
    );

    const horarioOcupado = citasExistentes.some(
      (c) =>
        c.profesional === profesional &&
        c.fecha === fecha &&
        c.hora === hora &&
        c.estado !== 'Cancelada' &&
        c.id !== statePreseleccion?.citaAReprogramar?.id
    );

    if (horarioOcupado) {
      setErrorReserva(
        `El profesional ${profesional} ya tiene una cita reservada en esa fecha y hora.`
      );
      return;
    }

    const nuevaCita: CitaMedica = {
      id: statePreseleccion?.citaAReprogramar?.id || `CITA-${Date.now()}`,
      rutPaciente: rut.replace(/[^0-9kK]/g, '').toUpperCase(),
      servicio,
      profesional,
      motivo,
      fecha,
      hora,
      estado: 'Pendiente',
      recordatorioEnviado: true,
    };

    const nuevasCitas = statePreseleccion?.citaAReprogramar
      ? citasExistentes.map((c) => (c.id === nuevaCita.id ? nuevaCita : c))
      : [...citasExistentes, nuevaCita];

    localStorage.setItem('nutrivida_citas', JSON.stringify(nuevasCitas));

    setMensajeConfirmacion('¡Reserva confirmada! Redirigiendo a tu portal de paciente...');
    setTimeout(() => {
      navigate('/usuario');
    }, 1500);
  };

  const fechaMinima = new Date().toISOString().split('T')[0];

  return (
    <main className="container my-5">
      <form
        id="formulario-reserva"
        onSubmit={handleSubmit}
        className="nv-form-container p-4 mx-auto"
        style={{ maxWidth: '600px' }}
      >
        <h3 className="mb-3 text-center pb-2" style={{ borderBottom: '3px solid #2a492a' }}>
          {statePreseleccion?.citaAReprogramar ? 'Reprogramar Hora' : 'Agendar Hora'}
        </h3>

        {errorReserva && <div className="alert alert-danger py-2">{errorReserva}</div>}
        {mensajeConfirmacion && (
          <div className="alert alert-success py-2">{mensajeConfirmacion}</div>
        )}

        <div className="mb-3">
          <label className="form-label fw-bold">RUT del Paciente</label>
          <input
            type="text"
            id="reserva-rut"
            className="form-control"
            placeholder="12345678K"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            maxLength={9}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Servicio</label>
          <select
            id="reserva-servicio"
            className="form-select"
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            required
          >
            <option value="">Seleccione un Servicio...</option>
            {CATALOGO_SERVICIOS.map((s) => (
              <option key={s.id} value={s.nombre}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Profesional</label>
          <select
            id="reserva-profesional"
            className="form-select"
            value={profesional}
            onChange={(e) => setProfesional(e.target.value)}
            required
          >
            <option value="">Seleccione un Profesional...</option>
            {LISTA_PROFESIONALES.map((p) => (
              <option key={p.id} value={p.nombre}>
                {p.nombre} — ({p.especialidad})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Motivo de la consulta</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: Control nutricional, pérdida de peso, plan vegetariano..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Fecha</label>
            <input
              type="date"
              id="reserva-fecha"
              className="form-control"
              min={fechaMinima}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Hora</label>
            <select
              id="reserva-hora"
              className="form-select"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            >
              <option value="">Seleccione una hora...</option>
              {HORARIOS_DISPONIBLES.map((h) => (
                <option key={h} value={h}>
                  {h} hrs
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn nv-btn-primary w-100 fw-bold mt-2">
          Confirmar Reserva
        </button>
      </form>
    </main>
  );
};

export default ReservasHoras;