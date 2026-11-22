import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioRegistro from "../components/organismos/FormularioRegistro";
import { registrarUsuario } from "../services/usuarioService";

export interface UsuarioRegistrado {
  id?: number;
  rut: string;
  nombres: string;
  apellidos: string;
  correo: string;
  clave?: string;
  password?: string;
  fechaNacimiento?: string;
  region: string;
  comuna: string;
  direccion?: string;
  rol: "PACIENTE" | "NUTRICIONISTA" | "ADMIN" | "ADMINISTRADOR";
}

const RegistroUsuario: React.FC = () => {
  const navigate = useNavigate();

  const [datosFormulario, setDatosFormulario] = useState({
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

  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "region") {
      setDatosFormulario((anterior) => ({ ...anterior, region: value, comuna: "" }));
    } else {
      setDatosFormulario((anterior) => ({ ...anterior, [id]: value }));
    }
  };

  const formatearRut = (rutLimpio: string): string => {
    const numeros = rutLimpio.slice(0, -1);
    const digitoVerificador = rutLimpio.slice(-1);
    const numerosConPuntos = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${numerosConPuntos}-${digitoVerificador}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    const rutLimpio = datosFormulario.rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      setMensajeError("El RUT debe contener entre 8 y 9 caracteres sin puntos ni guión.");
      return;
    }

    const nuevoUsuario = {
      rut: formatearRut(rutLimpio),
      nombres: datosFormulario.nombres,
      apellidos: datosFormulario.apellidos,
      correo: datosFormulario.correo,
      password: datosFormulario.clave,
      region: datosFormulario.region,
      comuna: datosFormulario.comuna,
    };

    try {
      const usuarioCreado = await registrarUsuario(nuevoUsuario);
      localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(usuarioCreado));

      setMensajeExito("¡Registro exitoso! Redirigiendo a tu portal...");
      setTimeout(() => {
        navigate("/usuario");
      }, 1400);
    } catch (error: any) {
      console.error("Error al registrar:", error);
      setMensajeError(error.message || "Error de conexión con el servidor de usuarios.");
    }
  };

  return (
    <main className="container my-4">
      <div className="section-registro">
        <FormularioRegistro
          formData={datosFormulario}
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