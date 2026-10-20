import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface RegionesMap {
  [region: string]: string[];
}

const REGIONES_COMUNAS: RegionesMap = {
  'La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Lautaro', 'Victoria'],
  'Metropolitana de Santiago': ['Santiago', 'Conchalí', 'Providencia', 'Las Condes', 'Maipú', 'Ñuñoa', 'La Florida', 'Puente Alto'],
  'Biobío': ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Los Ángeles', 'Chiguayante'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
  'Los Ríos': ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli'],
  'Los Lagos': ['Puerto Montt', 'Osorno', 'Puerto Varas', 'Castro'],
};

export interface UsuarioRegistrado {
  rut: string;
  nombres: string;
  apellidos: string;
  correo: string;
  clave?: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
  rol: 'PACIENTE' | 'NUTRICIONISTA' | 'ADMIN';
}

const RegistroUsuario: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    rut: '',
    correo: '',
    clave: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
  });

  const [mensajeError, setMensajeError] = useState<string>('');
  const [mensajeExito, setMensajeExito] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'region') {
      setFormData((prev) => ({ ...prev, region: value, comuna: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    const rutLimpio = formData.rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      setMensajeError('El RUT debe contener entre 8 y 9 caracteres sin puntos ni guión.');
      return;
    }

    const nuevoUsuario: UsuarioRegistrado = {
      ...formData,
      rut: rutLimpio,
      rol: 'PACIENTE',
    };

    const usuariosGuardados: UsuarioRegistrado[] = JSON.parse(
      localStorage.getItem('nutrivida_usuarios') || '[]'
    );

    const existe = usuariosGuardados.some(
      (u) => u.rut === nuevoUsuario.rut || u.correo === nuevoUsuario.correo
    );

    if (existe) {
      setMensajeError('Ya existe un paciente registrado con este RUT o correo electrónico.');
      return;
    }

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('nutrivida_usuarios', JSON.stringify(usuariosGuardados));
    localStorage.setItem('nutrivida_usuario_activo', JSON.stringify(nuevoUsuario));

    setMensajeExito('¡Registro exitoso! Redirigiendo a tu portal...');
    setTimeout(() => {
      navigate('/usuario');
    }, 1400);
  };

  const comunasDisponibles = formData.region ? REGIONES_COMUNAS[formData.region] || [] : [];

  return (
    <main className="container my-4">
      <div className="section-registro">
        <form className="row g-3 w-100" id="formulario-registro" onSubmit={handleSubmit}>
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="col-12 mt-4">
            <button type="submit" className="btn nv-btn-primary w-100 py-2">
              Registrarse
            </button>
          </div>

          <div className="col-12 text-center mt-3">
            <small className="text-muted">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="fw-bold" style={{ color: '#2a492a' }}>
                Inicia sesión aquí
              </Link>
            </small>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegistroUsuario;