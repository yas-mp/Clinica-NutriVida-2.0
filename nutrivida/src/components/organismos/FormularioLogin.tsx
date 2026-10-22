import React, { useState } from "react";
import CampoCorreo from "../moleculas/CampoCorreo";
import CampoContrasena from "../moleculas/CampoContrasena";
import Boton from "../atomos/Boton";
import { Link, useNavigate } from "react-router-dom";
import type { UsuarioRegistrado } from "../../pages/RegistroUsuario";
import { LISTADO_PROFESIONALES } from "../data/ListadoProfesionales";

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

    if (contrasena.length < 4 || contrasena.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres");
      return;
    }

    const correoLimpio = correo.trim().toLowerCase();

    if (
      correoLimpio === "prueba@admin.cl" ||
      (correoLimpio.includes("admin") && contrasena === "1234")
    ) {
      const sesionAdmin = {
        nombres: "Administrador",
        apellidos: "NutriVida",
        rut: "111111111",
        correo: correoLimpio,
        rol: "ADMINISTRADOR",
      };
      localStorage.setItem("usuario_sesion", JSON.stringify(sesionAdmin));
      localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(sesionAdmin));
      navigate("/admin");
      return;
    }

    const profesionalEncontrado = LISTADO_PROFESIONALES.find(
      (p) => p.correo.toLowerCase() === correoLimpio && p.clave === contrasena
    );

    if (profesionalEncontrado) {
      const sesionNutri = {
        nombres: profesionalEncontrado.nombre,
        apellidos: profesionalEncontrado.apellidos,
        rut: profesionalEncontrado.rut || "15432987K",
        correo: profesionalEncontrado.correo,
        especialidad: profesionalEncontrado.especialidad,
        rol: "NUTRICIONISTA",
      };
      localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(sesionNutri));
      navigate("/nutricionista");
      return;
    }

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
    alert("Correo o contraseña incorrectos. Por favor verifica tus datos.");
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