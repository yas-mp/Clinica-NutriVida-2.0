import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listarServicios } from "../services/servicioService";
import { obtenerNutricionistas } from "../services/usuarioService";
import {
  obtenerReservas,
  crearReserva,
  actualizarReserva,
} from "../services/reservaService";

export interface CitaMedica {
  id: string;
  rutPaciente: string;
  servicio: string;
  profesional: string;
  motivo: string;
  fecha: string;
  hora: string;
  estado: "Pendiente" | "Confirmada" | "Cancelada" | "Realizada";
  recordatorioEnviado: boolean;
}

const HORARIOS = ["09:00", "10:00", "11:00", "15:00", "16:00"];

const ReservasHoras: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const datosPrevios = location.state as any;

  const [rut, setRut] = useState("");
  const [servicio, setServicio] = useState("");
  const [profesional, setProfesional] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const [servicios, setServicios] = useState<any[]>([]);
  const [nutricionistas, setNutricionistas] = useState<any[]>([]);

  const limpiarRut = (valor: string) =>
    String(valor || "").replace(/[^0-9kK]/g, "").toUpperCase();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const listaServicios = await listarServicios();
        setServicios(listaServicios);

        const listaNutris = await obtenerNutricionistas();
        setNutricionistas(listaNutris);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const sesion = localStorage.getItem("nutrivida_usuario_activo");
    if (sesion) {
      const usuario = JSON.parse(sesion);
      if (usuario.rut) setRut(limpiarRut(usuario.rut));
    }

    if (datosPrevios?.profesionalPreseleccionado) {
      const nombre = datosPrevios.profesionalPreseleccionado;
      setProfesional(nombre.startsWith("Nut.") ? nombre : `Nut. ${nombre}`);
    }

    if (datosPrevios?.servicioPreseleccionado) {
      setServicio(datosPrevios.servicioPreseleccionado);
    }

    if (datosPrevios?.citaAReprogramar) {
      const cita = datosPrevios.citaAReprogramar;
      setRut(limpiarRut(cita.rutPaciente));
      setServicio(cita.servicio);
      setProfesional(cita.profesional);
      setMotivo(cita.motivo || "");
      setFecha(cita.fecha);
      setHora(cita.hora);
    }
  }, [datosPrevios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeOk("");

    const citaEditar = datosPrevios?.citaAReprogramar;

    try {
      const citas = await obtenerReservas();
      const ocupado = citas.some(
        (c: any) =>
          c.profesional === profesional &&
          c.fecha === fecha &&
          c.hora === hora &&
          c.estado !== "Cancelada" &&
          String(c.id) !== String(citaEditar?.id)
      );

      if (ocupado) {
        setMensajeError(`El profesional ${profesional} ya tiene una hora reservada en ese horario.`);
        return;
      }

      const nuevaCita = {
        rutPaciente: limpiarRut(rut),
        servicio,
        profesional,
        motivo,
        fecha,
        hora,
        estado: "Pendiente",
        recordatorioEnviado: true,
      };

      if (citaEditar) {
        await actualizarReserva(citaEditar.id, nuevaCita);
        setMensajeOk("¡Cita reprogramada con éxito! Volviendo a tu portal...");
        setTimeout(() => navigate("/usuario"), 1200);
      } else {
        const citaGuardada = await crearReserva(nuevaCita);
        setMensajeOk("¡Reserva confirmada! Redirigiendo al pago...");
        setTimeout(() => {
          navigate("/pago", {
            state: {
              servicioNombre: servicio,
              idCita: citaGuardada.id,
              rutPaciente: citaGuardada.rutPaciente,
            },
          });
        }, 1200);
      }
    } catch (error: any) {
      setMensajeError(error.message || "Error al conectar con el servidor.");
    }
  };

  const fechaMinima = new Date().toISOString().split("T")[0];

  return (
    <main className="container my-5">
      <form
        id="formulario-reserva"
        onSubmit={handleSubmit}
        className="nv-form-container p-4 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <h3
          className="mb-3 text-center pb-2"
          style={{ borderBottom: "3px solid #2a492a" }}
        >
          {datosPrevios?.citaAReprogramar ? "Reprogramar Hora" : "Agendar Hora"}
        </h3>

        {mensajeError && <div className="alert alert-danger py-2">{mensajeError}</div>}
        {mensajeOk && <div className="alert alert-success py-2">{mensajeOk}</div>}

        <div className="mb-3">
          <label className="form-label fw-bold">RUT del Paciente</label>
          <input
            type="text"
            id="reserva-rut"
            className="form-control"
            placeholder="12345678K"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            maxLength={12}
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
            {servicios.map((s) => (
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
            {nutricionistas.map((n) => (
              <option key={n.id} value={`${n.nombres} ${n.apellidos}`}>
                {n.nombres} {n.apellidos}
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
              {HORARIOS.map((h) => (
                <option key={h} value={h}>
                  {h} hrs
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 fw-bold mb-3">
          Confirmar Reserva
        </button>
      </form>
    </main>
  );
};

export default ReservasHoras;