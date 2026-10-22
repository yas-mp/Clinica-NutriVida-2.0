import React from "react";
import { Link } from "react-router-dom";
import Boton from "../atomos/Boton";

interface RegionesMap {
  [region: string]: string[];
}

const REGIONES_COMUNAS: RegionesMap = {
  "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Lautaro", "Victoria"],
  "Metropolitana de Santiago": ["Santiago", "Conchalí", "Providencia", "Las Condes", "Maipú", "Ñuñoa", "La Florida", "Puente Alto"],
  Biobío: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Los Ángeles", "Chiguayante"],
  Valparaíso: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"],
  "Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Puerto Varas", "Castro"],
};

interface FormularioRegistroProps {
  formData: {
    nombres: string;
    apellidos: string;
    rut: string;
    correo: string;
    clave: string;
    fechaNacimiento: string;
    region: string;
    comuna: string;
    direccion: string;
  };
  mensajeError: string;
  mensajeExito: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FormularioRegistro: React.FC<FormularioRegistroProps> = ({
  formData,
  mensajeError,
  mensajeExito,
  onChange,
  onSubmit,
}) => {
  const comunasDisponibles = formData.region ? REGIONES_COMUNAS[formData.region] || [] : [];

  return (
    <form className="row g-3 w-100" id="formulario-registro" onSubmit={onSubmit}>
      <h2 className="titulo-registro">Registro de Usuario</h2>

      {mensajeError && <div className="alert alert-danger py-2">{mensajeError}</div>}
      {mensajeExito && <div className="alert alert-success py-2">{mensajeExito}</div>}

      <div className="col-md-6">
        <label htmlFor="nombres" className="form-label fw-semibold">
          Nombres
        </label>
        <input
          type="text"
          className="form-control"
          id="nombres"
          value={formData.nombres}
          onChange={onChange}
          maxLength={50}
          required
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="apellidos" className="form-label fw-semibold">
          Apellidos
        </label>
        <input
          type="text"
          className="form-control"
          id="apellidos"
          value={formData.apellidos}
          onChange={onChange}
          maxLength={100}
          required
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="rut" className="form-label fw-semibold">
          RUT (sin puntos ni guión)
        </label>
        <input
          type="text"
          className="form-control"
          id="rut"
          value={formData.rut}
          onChange={onChange}
          placeholder="188663338"
          maxLength={9}
          required
        />
      </div>

      <div className="col-md-8">
        <label htmlFor="correo" className="form-label fw-semibold">
          Correo electrónico
        </label>
        <input
          type="email"
          className="form-control"
          id="correo"
          value={formData.correo}
          onChange={onChange}
          placeholder="ejemplo@gmail.com"
          maxLength={100}
          required
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="clave" className="form-label fw-semibold">
          Contraseña
        </label>
        <input
          type="password"
          className="form-control"
          id="clave"
          value={formData.clave}
          onChange={onChange}
          minLength={4}
          maxLength={10}
          required
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="fechaNacimiento" className="form-label fw-semibold">
          Fecha de nacimiento
        </label>
        <input
          type="date"
          className="form-control"
          id="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="region" className="form-label fw-semibold">
          Región
        </label>
        <select
          id="region"
          className="form-select"
          value={formData.region}
          onChange={onChange}
          required
        >
          <option value="" disabled>
            Selecciona región...
          </option>
          {Object.keys(REGIONES_COMUNAS).map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label htmlFor="comuna" className="form-label fw-semibold">
          Comuna
        </label>
        <select
          id="comuna"
          className="form-select"
          value={formData.comuna}
          onChange={onChange}
          disabled={!formData.region}
          required
        >
          <option value="" disabled>
            Selecciona comuna...
          </option>
          {comunasDisponibles.map((com) => (
            <option key={com} value={com}>
              {com}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12">
        <label htmlFor="direccion" className="form-label fw-semibold">
          Dirección
        </label>
        <input
          type="text"
          className="form-control"
          id="direccion"
          value={formData.direccion}
          onChange={onChange}
          maxLength={100}
          required
        />
      </div>

      <div className="col-12 mt-4">
        <Boton
          label="Registrarse"
          tipo="submit"
          className="btn btn-success mx-auto"
        />
      </div>

      <div className="col-12 text-center mt-3">
        <small className="text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="fw-bold" style={{ color: "#2a492a" }}>
            Inicia sesión aquí
          </Link>
        </small>
      </div>
    </form>
  );
};
export default FormularioRegistro