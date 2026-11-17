import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioRegistro from "../components/organismos/FormularioRegistro";

export interface UsuarioRegistrado {
  rut: string;
  nombres: string;
  apellidos: string;
  correo: string;
  clave?: string;
  password?: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
  rol: "PACIENTE" | "NUTRICIONISTA" | "ADMIN";
}

const RegistroUsuario: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    rut: "",
    correo: "",
    clave: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
  });

  const [mensajeError, setMensajeError] = useState<string>("");
  const [mensajeExito, setMensajeExito] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "region") {
      setFormData((prev) => ({ ...prev, region: value, comuna: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const formatearRutConPuntosYGuion = (rutLimpio: string): string => {
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${cuerpoConPuntos}-${dv}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    const rutLimpio = formData.rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      setMensajeError("El RUT debe contener entre 8 y 9 caracteres sin puntos ni guión.");
      return;
    }

    const rutFormateado = formatearRutConPuntosYGuion(rutLimpio);

    const payloadBackend = {
      rut: rutFormateado,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      correo: formData.correo,
      password: formData.clave,
      fechaNacimiento: formData.fechaNacimiento,
      region: formData.region,
      comuna: formData.comuna,
      direccion: formData.direccion,
      rol: "PACIENTE",
    };

    try {
      const respuesta = await fetch("http://localhost:8081/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadBackend),
      });

      if (!respuesta.ok) {
        const errorResp = await respuesta.text();
        throw new Error(errorResp || "No se pudo registrar el usuario.");
      }

      const usuarioCreado = await respuesta.json();
      const { clave, password, ...usuarioSinClave } = usuarioCreado;
      localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(usuarioSinClave));

      setMensajeExito("El registro fue exitoso, redirigiendo a tu portal...");
      setTimeout(() => {
        navigate("/usuario");
      }, 1400);
    } catch (error: any) {
      console.error("Error al registrar: ", error);
      setMensajeError(error.message || "Error de conexión con el servidor de usuarios...");
    }
  };

  return (
    <main className="container my-4">
      <div className="section-registro">
        <FormularioRegistro
          formData={formData}
          mensajeError={mensajeError}
          mensajeExito={mensajeExito}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
};

export default RegistroUsuario;