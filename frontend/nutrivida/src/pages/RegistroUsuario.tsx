import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioRegistro from "../components/organismos/FormularioRegistro";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    const rutLimpio = formData.rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      setMensajeError("El RUT debe contener entre 8 y 9 caracteres sin puntos ni guión.");
      return;
    }

    const nuevoUsuario: UsuarioRegistrado = {
      ...formData,
      rut: rutLimpio,
      rol: "PACIENTE",
    };

    const usuariosGuardados: UsuarioRegistrado[] = JSON.parse(
      localStorage.getItem("nutrivida_usuarios") || "[]"
    );

    const existe = usuariosGuardados.some(
      (u) => u.rut === nuevoUsuario.rut || u.correo === nuevoUsuario.correo
    );

    if (existe) {
      setMensajeError("Ya existe un paciente registrado con este RUT o correo electrónico.");
      return;
    }

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("nutrivida_usuarios", JSON.stringify(usuariosGuardados));
    localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(nuevoUsuario));

    setMensajeExito("¡Registro exitoso! Redirigiendo a tu portal...");
    setTimeout(() => {
      navigate("/usuario");
    }, 1400);
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