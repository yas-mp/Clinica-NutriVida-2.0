import React, { useState, useEffect } from "react";
import { TablaReservasAdmin, TablaServiciosAdmin, TablaUsuariosAdmin } from "../components/organismos/TablasVistaAdmin";
import { useNavigate } from "react-router-dom";

export const Admin: React.FC = () => {
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [listaReservas, setListaReservas] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const navigate = useNavigate();

  const [servCodigo, setServCodigo] = useState("");
  const [servNombre, setServNombre] = useState("");
  const [servProfesional, setServProfesional] = useState("");
  const [servPrecio, setServPrecio] = useState("");

  useEffect(() => {
    const usuarioActivo = JSON.parse(
      localStorage.getItem("nutrivida_usuario_activo") ||
        localStorage.getItem("usuario_sesion") ||
        "null"
    );

    if (!usuarioActivo) {
      alert("Debes iniciar sesión para acceder al panel de administración.");
      navigate("/login");
      return;
    }

    const rolUpper = String(usuarioActivo.rol || "").toUpperCase();
    const esAdmin =
      rolUpper === "ADMIN" ||
      rolUpper === "ADMINISTRADOR" ||
      usuarioActivo.correo?.includes("admin");

    if (!esAdmin) {
      alert("No tienes permisos de administrador para acceder a esta vista.");
      navigate("/login");
      return;
    }

    const usuarios = JSON.parse(
      localStorage.getItem("nutrivida_usuarios") ||
        localStorage.getItem("usuarios") ||
        "[]"
    );

    const reservas = JSON.parse(
      localStorage.getItem("nutrivida_citas") ||
        localStorage.getItem("nutrivida_reservas") ||
        localStorage.getItem("reservas") ||
        "[]"
    );

    const serviciosGuardados = JSON.parse(
      localStorage.getItem("nutrivida_servicios") ||
        localStorage.getItem("servicios") ||
        "[]"
    );

    setListaUsuarios(usuarios);
    setListaReservas(reservas);
    setServicios(serviciosGuardados);
  }, [navigate]);

  const cancelarReserva = (index: number) => {
    if (confirm("¿Estás seguro de cancelar esta reserva?")) {
      const nuevaLista = [...listaReservas];
      nuevaLista.splice(index, 1);
      setListaReservas(nuevaLista);

      localStorage.setItem("nutrivida_citas", JSON.stringify(nuevaLista));
      localStorage.setItem("nutrivida_reservas", JSON.stringify(nuevaLista));
    }
  };

  const cambiarRolUsuario = (pos: number, nRol: string) => {
    const nuevaLista = [...listaUsuarios];
    if (nuevaLista[pos]) {
      nuevaLista[pos].rol = nRol;
      setListaUsuarios(nuevaLista);
      localStorage.setItem("nutrivida_usuarios", JSON.stringify(nuevaLista));

      const usuarioSesion = JSON.parse(
        localStorage.getItem("nutrivida_usuario_activo") || "null"
      );

      if (usuarioSesion && usuarioSesion.correo === nuevaLista[pos].correo) {
        usuarioSesion.rol = nRol;
        localStorage.setItem("nutrivida_usuario_activo", JSON.stringify(usuarioSesion));
      }

      alert("Rol cambiado a " + nRol + " exitosamente.");
    }
  };

  const eliminarUsuario = (index: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar a este usuario?")) {
      const nuevaLista = [...listaUsuarios];
      nuevaLista.splice(index, 1);
      setListaUsuarios(nuevaLista);
      localStorage.setItem("nutrivida_usuarios", JSON.stringify(nuevaLista));
    }
  };

  const modificarUsuario = (index: number) => {
    const user = listaUsuarios[index];
    const nuevoCorreo = prompt(
      "Ingrese el nuevo correo electrónico:",
      user.correo || ""
    );
    if (nuevoCorreo !== null && nuevoCorreo.trim() !== "") {
      const nuevaLista = [...listaUsuarios];
      nuevaLista[index].correo = nuevoCorreo.trim();
      setListaUsuarios(nuevaLista);
      localStorage.setItem("nutrivida_usuarios", JSON.stringify(nuevaLista));
    }
  };

  const agregarNuevoServicio = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoServicio = {
      id: Date.now(),
      codigo: servCodigo,
      nombre: servNombre,
      profesional: servProfesional,
      precio: parseInt(servPrecio) || 0,
    };

    const nuevaLista = [...servicios, nuevoServicio];
    setServicios(nuevaLista);
    localStorage.setItem("nutrivida_servicios", JSON.stringify(nuevaLista));

    setServCodigo("");
    setServNombre("");
    setServProfesional("");
    setServPrecio("");

    alert("Servicio guardado exitosamente.");
  };

  const modificarServicio = (id: number) => {
    const nuevoPrecio = prompt("Ingrese el nuevo precio para el servicio:");
    if (nuevoPrecio !== null && nuevoPrecio !== "") {
      const nuevaLista = servicios.map((servi) => {
        if (servi.id === id || String(servi.id) === String(id)) {
          return { ...servi, precio: parseInt(nuevoPrecio) };
        }
        return servi;
      });
      setServicios(nuevaLista);
      localStorage.setItem("nutrivida_servicios", JSON.stringify(nuevaLista));
    }
  };

  const eliminarServicio = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      const nuevaLista = servicios.filter((servi) => servi.id !== id && String(servi.id) !== String(id));
      setServicios(nuevaLista);
      localStorage.setItem("nutrivida_servicios", JSON.stringify(nuevaLista));
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("nutrivida_usuario_activo");
    localStorage.removeItem("usuario_sesion");
    alert("Has cerrado sesión correctamente.");
    navigate("/login");
  };

  return (
    <div className="bg-light bg-admin min-vh-100">
      <header>
        <nav
          className="navbar navbar-expand-lg navbar-dark navCustom px-3"
          style={{ backgroundColor: "rgb(49, 78, 34)" }}
        >
          <div className="container-fluid">
            <span className="navbar-brand fw-bold">Panel Administrativo</span>
            <div className="d-flex align-items-center">
              <span className="text-white me-3 d-none d-md-inline">
                Sesión: Admin
              </span>
              <button
                className="btn btn-outline-light btn-sm me-2"
                onClick={() => navigate("/")}
              >
                Ir al Sitio
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={cerrarSesion}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container my-4">
        <h2 className="mb-3">Vista administrativa</h2>

        <ul className="nav nav-tabs mb-4" id="adminTabs" role="tablist">
          <li className="nav-item">
            <button
              className="nav-link active fw-bold text-success"
              data-bs-toggle="tab"
              data-bs-target="#sec-usuarios"
            >
              Usuarios Registrados
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link fw-bold text-success"
              data-bs-toggle="tab"
              data-bs-target="#sec-servicios"
            >
              Catálogo de Servicios
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link fw-bold text-success"
              data-bs-toggle="tab"
              data-bs-target="#sec-reservas"
            >
              Reservas
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane fade show active" id="sec-usuarios">
            <div className="card p-3 shadow-sm">
              <h4 className="m-0 mb-3">Gestión de Usuarios</h4>
              <TablaUsuariosAdmin
                listaUsuarios={listaUsuarios}
                onCambiarRol={cambiarRolUsuario}
                onEliminarUsuario={eliminarUsuario}
                onModificarUsuario={modificarUsuario}
              />
            </div>
          </div>

          <div className="tab-pane fade" id="sec-reservas">
            <div className="card p-3 shadow-sm">
              <h4 className="m-0 mb-3">Gestión de Reservas</h4>
              <TablaReservasAdmin
                listaReservas={listaReservas}
                onCancelarReserva={cancelarReserva}
              />
            </div>
          </div>

          <div className="tab-pane fade" id="sec-servicios">
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">Servicios y Planes</h4>
                <button
                  className="btn btn-success btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#modalNuevoServicio"
                >
                  + Agregar Servicio
                </button>
              </div>
              <TablaServiciosAdmin
                servicios={servicios}
                onEliminarServicio={eliminarServicio}
                onModificarServicio={modificarServicio}
              />
            </div>
          </div>
        </div>
      </main>

      <div className="modal fade" id="modalNuevoServicio" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">Crear Nuevo Servicio</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={agregarNuevoServicio}>
                <div className="mb-2">
                  <label className="form-label">Código</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: CN002"
                    value={servCodigo}
                    onChange={(e) => setServCodigo(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Nombre del Servicio</label>
                  <input
                    type="text"
                    className="form-control"
                    value={servNombre}
                    onChange={(e) => setServNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Profesional</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Nut. Carolina Fuentes"
                    value={servProfesional}
                    onChange={(e) => setServProfesional(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={servPrecio}
                    onChange={(e) => setServPrecio(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  data-bs-dismiss="modal"
                >
                  Guardar Servicio
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;