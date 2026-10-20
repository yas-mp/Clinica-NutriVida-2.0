import React, { useState } from "react";
import CampoCorreo from "../moleculas/CampoCorreo";
import CampoContrasena from "../moleculas/CampoContrasena";
import Boton from "../atomos/Boton";
import { Link, useNavigate } from "react-router-dom";
import type { UsuarioRegistrado } from "../../pages/RegistroUsuario";

function FormularioInicioSesion() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (correo.trim() === "") {
      alert("Debe ingresar un correo");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert("Ingresa un correo válido");
      return;
    }

    if (contrasena.trim() === "") {
      alert("Debe ingresar una contraseña");
      return;
    }

    // Validación del formulario de registro
    if (contrasena.length < 4 || contrasena.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres");
      return;
    }

    const correoLimpio = correo.trim().toLowerCase();

    // 1. Acceso para rol Nutricionista (cualquier correo @nutrivida.cl
    if (
      correoLimpio === "nutri@nutrivida.cl" ||
      correoLimpio === "c.fuentes@nutrivida.cl" ||
      correoLimpio.endsWith("@nutrivida.cl")
    ) {
      const sesionNutri = {
        nombres: "Carolina",
        apellidos: "Fuentes M.",
        rut: "15432987K",
        correo: correoLimpio,
        rol: "NUTRICIONISTA",
      };
      localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(sesionNutri));
      navigate("/nutricionista");
      return;
    }

    // 2. Buscar en los pacientes registrados en localStorage
    const usuariosRegistrados: UsuarioRegistrado[] = JSON.parse(
      localStorage.getItem("nutrivida_usuarios") || "[]"
    );

    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.correo.toLowerCase() === correoLimpio && u.clave === contrasena
    );

    if (usuarioEncontrado) {
      localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(usuarioEncontrado));
      navigate("/usuario");
      return;
    }

    // 3. Acceso rápido de prueba para Paciente si aún no se ha registrado manualmente
    const pacienteDemo: UsuarioRegistrado = {
      nombres: "Paciente",
      apellidos: "NutriVida",
      rut: "188663338",
      correo: correoLimpio,
      fechaNacimiento: "1999-04-15",
      region: "La Araucanía",
      comuna: "Temuco",
      direccion: "Av. Alemania 0850",
      rol: "PACIENTE",
    };

    localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(pacienteDemo));
    navigate("/usuario");
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <div className="inicioSesion">
        <div className="login">
          <h1>Iniciar sesión</h1>

          <CampoCorreo
            etiqueta="Correo electrónico"
            tipo="email"
            nombre="correo"
            valor={correo}
            alCambiar={setCorreo}
          />

          <CampoContrasena
            etiqueta="Contraseña"
            tipo="password"
            nombre="clave"
            valor={contrasena}
            alCambiar={setContrasena}
          />

          <Boton
            label="Ingresar"
            tipo="submit"
            className="btn btn-success w-100 fw-bold mb-3"
          />

          <div className="text-center mt-3">
            <span
              className="text-muted"
              style={{ marginTop: "10px", textAlign: "center" }}
            >
              ¿No tienes una cuenta?
            </span>
            <br />
            <Link
              to="/registro-usuario"
              className="fw-bold text-decoration-none"
              style={{ color: "#2a492a" }}
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default FormularioInicioSesion;