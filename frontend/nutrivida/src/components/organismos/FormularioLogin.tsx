import React, { useState } from "react";
import CampoCorreo from "../moleculas/CampoCorreo";
import CampoContrasena from "../moleculas/CampoContrasena";
import Boton from "../atomos/Boton";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../../services/usuarioService";

function FormularioLogin() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      const usuarioLogueado = await iniciarSesion(correoLimpio, contrasena);

      localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(usuarioLogueado));

      const rol = String(usuarioLogueado.rol || "").toUpperCase();

      if (rol.includes("ADMIN")) {
        localStorage.setItem("usuario_sesion", JSON.stringify(usuarioLogueado));
        navigate("/admin");
      } else if (rol.includes("NUTRI")) {
        navigate("/nutricionista");
      } else {
        navigate("/usuario");
      }
    } catch (error: any) {
      console.error("Error en inicio de sesión:", error);
      alert(error.message || "Correo o contraseña incorrectos. Por favor verifica tus datos.");
    }
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

export default FormularioLogin;