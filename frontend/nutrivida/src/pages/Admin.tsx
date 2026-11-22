import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TablaPagosAdmin,
  TablaReservasAdmin,
  TablaServiciosAdmin,
  TablaUsuariosAdmin,
} from "../components/organismos/TablasVistaAdmin";
import { TablaContactosAdmin } from "../components/organismos/TablaContactosAdmin";

import {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuarioService";
import { obtenerReservas, cancelarReserva } from "../services/reservaService";
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  listarServicios,
  listarTiposServicio,
  obtenerMensajeError,
} from "../services/servicioService";
import type {
  ServicioNutricional,
  ServicioRequest,
  TipoServicio,
} from "../services/servicioService";
import {
  eliminarMensajeContacto,
  listarMensajesContacto,
  marcarMensajeLeido,
  obtenerMensajeError as obtenerMensajeErrorContacto,
  responderMensajeContacto,
} from "../services/contactoService";
import type { ContactoMensaje } from "../services/contactoService";
import {
  anularPago,
  listarPagos,
  obtenerMensajeError as obtenerMensajeErrorPago,
} from "../services/pagoService";
import type { Pago } from "../services/pagoService";

interface FormularioServicio {
  codigo: string;
  nombre: string;
  tipoId: string;
  duracion: string;
  modalidad: string;
  profesional: string;
  precio: string;
  descripcion: string;
  imagen: string;
}

const FORMULARIO_VACIO: FormularioServicio = {
  codigo: "",
  nombre: "",
  tipoId: "",
  duracion: "",
  modalidad: "Presencial",
  profesional: "Nutricionista",
  precio: "",
  descripcion: "",
  imagen: "../images/consulta-nutri.jpg",
};

const MODALIDADES = ["Presencial", "Online", "Presencial (grupo)"];

export const Admin: React.FC = () => {
  const navigate = useNavigate();

  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [listaReservas, setListaReservas] = useState<any[]>([]);
  const [listaServicios, setListaServicios] = useState<ServicioNutricional[]>(
    [],
  );
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [listaContactos, setListaContactos] = useState<ContactoMensaje[]>([]);
  const [listaPagos, setListaPagos] = useState<Pago[]>([]);

  const [cargandoServicios, setCargandoServicios] = useState(false);
  const [cargandoTipos, setCargandoTipos] = useState(false);
  const [errorServicios, setErrorServicios] = useState<string | null>(null);
  const [mensajeServicios, setMensajeServicios] = useState<string | null>(null);

  const [cargandoContactos, setCargandoContactos] = useState(false);
  const [errorContactos, setErrorContactos] = useState<string | null>(null);
  const [mensajeContactos, setMensajeContactos] = useState<string | null>(null);

  const [cargandoPagos, setCargandoPagos] = useState(false);
  const [errorPagos, setErrorPagos] = useState<string | null>(null);
  const [mensajePagos, setMensajePagos] = useState<string | null>(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [servicioEnEdicion, setServicioEnEdicion] =
    useState<ServicioNutricional | null>(null);
  const [formulario, setFormulario] =
    useState<FormularioServicio>(FORMULARIO_VACIO);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargarUsuarios = async () => {
    try {
      const usuarios = await obtenerUsuarios();
      setListaUsuarios(usuarios);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const cargarReservas = async () => {
    try {
      const reservas = await obtenerReservas();
      setListaReservas(reservas);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    }
  };

  const cargarServicios = async () => {
    setCargandoServicios(true);
    setErrorServicios(null);
    try {
      const servicios = await listarServicios();
      setListaServicios(servicios);
    } catch (error) {
      setListaServicios([]);
      setErrorServicios(obtenerMensajeError(error));
    } finally {
      setCargandoServicios(false);
    }
  };

  const cargarTiposServicio = async () => {
    setCargandoTipos(true);
    try {
      const tipos = await listarTiposServicio();
      setTiposServicio(tipos);
    } catch (error) {
      setTiposServicio([]);
      setErrorServicios((anterior) => anterior ?? obtenerMensajeError(error));
    } finally {
      setCargandoTipos(false);
    }
  };

  const cargarContactos = async () => {
    setCargandoContactos(true);
    setErrorContactos(null);
    try {
      const mensajes = await listarMensajesContacto();
      setListaContactos(mensajes);
    } catch (error) {
      setListaContactos([]);
      setErrorContactos(obtenerMensajeErrorContacto(error));
    } finally {
      setCargandoContactos(false);
    }
  };

  const cargarPagos = async () => {
    setCargandoPagos(true);
    setErrorPagos(null);
    try {
      const pagos = await listarPagos();
      setListaPagos(pagos);
    } catch (error) {
      setListaPagos([]);
      setErrorPagos(obtenerMensajeErrorPago(error));
    } finally {
      setCargandoPagos(false);
    }
  };

  useEffect(() => {
    const sesionGuardada =
      localStorage.getItem("nutrivida_usuario_activo") ||
      localStorage.getItem("usuario_sesion");

    const usuarioActivo = sesionGuardada ? JSON.parse(sesionGuardada) : null;

    if (!usuarioActivo) {
      alert("Debes iniciar sesión para acceder al panel de administración.");
      navigate("/login");
      return;
    }

    const rol = String(usuarioActivo.rol || "").toUpperCase();
    if (rol !== "ADMIN" && rol !== "ADMINISTRADOR") {
      alert("No tienes permisos de administrador para acceder a esta vista.");
      navigate("/login");
      return;
    }

    cargarUsuarios();
    cargarReservas();
    cargarServicios();
    cargarTiposServicio();
    cargarContactos();
    cargarPagos();
  }, [navigate]);

  const manejarCambioRol = async (posicion: number, nuevoRol: string) => {
    const usuario = listaUsuarios[posicion];
    if (!usuario) return;

    const idUsuario = usuario.id ?? usuario.rut;
    const usuarioActualizado = { ...usuario, rol: nuevoRol };

    try {
      await actualizarUsuario(idUsuario, usuarioActualizado);

      const sesionGuardada = localStorage.getItem("nutrivida_usuario_activo");
      if (sesionGuardada) {
        const usuarioSesion = JSON.parse(sesionGuardada);
        if (usuarioSesion.correo === usuario.correo) {
          usuarioSesion.rol = nuevoRol;
          localStorage.setItem(
            "nutrivida_usuario_activo",
            JSON.stringify(usuarioSesion),
          );
        }
      }

      await cargarUsuarios();
      alert("Rol cambiado a " + nuevoRol + " exitosamente.");
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      alert("Error al cambiar el rol en el servidor.");
    }
  };

  const manejarEliminarUsuario = async (posicion: number) => {
    const usuario = listaUsuarios[posicion];
    if (!usuario) return;

    if (!window.confirm("¿Estás seguro de que deseas eliminar a este usuario?"))
      return;

    const idUsuario = usuario.id ?? usuario.rut;

    try {
      await eliminarUsuario(idUsuario);
      await cargarUsuarios();
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar el usuario en el servidor.");
    }
  };

  const manejarModificarUsuario = async (posicion: number) => {
    const usuario = listaUsuarios[posicion];
    if (!usuario) return;

    const nuevoCorreo = window.prompt(
      "Ingrese el nuevo correo electrónico:",
      usuario.correo || "",
    );

    if (nuevoCorreo === null || nuevoCorreo.trim() === "") return;

    const idUsuario = usuario.id ?? usuario.rut;
    const usuarioActualizado = { ...usuario, correo: nuevoCorreo.trim() };

    try {
      await actualizarUsuario(idUsuario, usuarioActualizado);
      await cargarUsuarios();
      alert("Correo actualizado correctamente.");
    } catch (error) {
      console.error("Error al modificar usuario:", error);
      alert("Error al modificar el usuario en el servidor.");
    }
  };

  const manejarCancelarReserva = async (posicion: number) => {
    const reserva = listaReservas[posicion];
    if (!reserva) return;

    if (!window.confirm("¿Estás seguro de cancelar esta reserva?")) return;

    try {
      await cancelarReserva(reserva.id);
      await cargarReservas();
      alert("Reserva cancelada correctamente.");
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert("Error al cancelar la reserva en el servidor.");
    }
  };

  const cambiarCampoFormulario = (
    campo: keyof FormularioServicio,
    valor: string,
  ) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const abrirModalCrear = () => {
    setServicioEnEdicion(null);
    setFormulario(FORMULARIO_VACIO);
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (idServicio: number) => {
    const servicioEncontrado = listaServicios.find((s) => s.id === idServicio);

    if (!servicioEncontrado) {
      setErrorServicios(
        "No se encontró el servicio seleccionado en el catálogo.",
      );
      return;
    }

    setServicioEnEdicion(servicioEncontrado);
    setFormulario({
      codigo: servicioEncontrado.codigo || "",
      nombre: servicioEncontrado.nombre || "",
      tipoId: servicioEncontrado.tipoId
        ? String(servicioEncontrado.tipoId)
        : "",
      duracion: servicioEncontrado.duracion || "",
      modalidad: servicioEncontrado.modalidad || MODALIDADES[0],
      profesional: servicioEncontrado.profesional || "",
      precio:
        servicioEncontrado.precio != null
          ? String(servicioEncontrado.precio)
          : "",
      descripcion: servicioEncontrado.descripcion || "",
      imagen: servicioEncontrado.imagen || "",
    });
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setServicioEnEdicion(null);
    setFormulario(FORMULARIO_VACIO);
    setErrorFormulario(null);
  };

  const manejarGuardarServicio = async (e: React.FormEvent) => {
    e.preventDefault();

    const tipoId = Number(formulario.tipoId);
    const precio = Number(formulario.precio);

    if (!formulario.tipoId || tipoId <= 0) {
      setErrorFormulario("Debes seleccionar un tipo de servicio.");
      return;
    }

    if (isNaN(precio) || precio < 1000) {
      setErrorFormulario(
        "El precio debe ser un número mayor o igual a 1000 CLP.",
      );
      return;
    }

    const datosServicio: ServicioRequest = {
      codigo: formulario.codigo.trim().toUpperCase(),
      nombre: formulario.nombre.trim(),
      duracion: formulario.duracion.trim(),
      modalidad: formulario.modalidad.trim(),
      profesional: formulario.profesional.trim(),
      precio,
      descripcion: formulario.descripcion.trim(),
      imagen: formulario.imagen.trim(),
      tipoId,
    };

    setGuardando(true);
    setErrorFormulario(null);

    try {
      if (servicioEnEdicion) {
        await actualizarServicio(servicioEnEdicion.id, datosServicio);
        setMensajeServicios(
          `Servicio "${datosServicio.nombre}" actualizado correctamente.`,
        );
      } else {
        await crearServicio(datosServicio);
        setMensajeServicios(
          `Servicio "${datosServicio.nombre}" creado correctamente.`,
        );
      }

      setErrorServicios(null);
      cerrarModal();
      await cargarServicios();
    } catch (error) {
      setErrorFormulario(obtenerMensajeError(error));
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminarServicio = async (idServicio: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este servicio?"))
      return;

    setErrorServicios(null);
    try {
      await eliminarServicio(idServicio);
      setMensajeServicios("Servicio eliminado correctamente.");
      await cargarServicios();
    } catch (error) {
      setErrorServicios(obtenerMensajeError(error));
    }
  };

  const manejarMarcarLeido = async (idContacto: number, leido: boolean) => {
    setErrorContactos(null);
    setMensajeContactos(null);
    try {
      await marcarMensajeLeido(idContacto, leido);
      setMensajeContactos(
        leido
          ? "Mensaje marcado como leído."
          : "Mensaje marcado como no leído.",
      );
      await cargarContactos();
    } catch (error) {
      setErrorContactos(obtenerMensajeErrorContacto(error));
    }
  };

  const manejarResponderContacto = async (contacto: ContactoMensaje) => {
    const respuesta = window.prompt(
      `Respuesta para ${contacto.nombre} (${contacto.correo}):`,
      contacto.respuesta || "",
    );

    if (respuesta === null) return;
    if (!respuesta.trim()) {
      alert("La respuesta no puede estar vacía.");
      return;
    }

    setErrorContactos(null);
    setMensajeContactos(null);

    try {
      await responderMensajeContacto(contacto.id, respuesta.trim());
      setMensajeContactos(`Respuesta registrada para ${contacto.nombre}.`);
      await cargarContactos();
    } catch (error) {
      setErrorContactos(obtenerMensajeErrorContacto(error));
    }
  };

  const manejarEliminarContacto = async (idContacto: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este mensaje de contacto?",
      )
    )
      return;

    setErrorContactos(null);
    setMensajeContactos(null);

    try {
      await eliminarMensajeContacto(idContacto);
      setMensajeContactos("Mensaje de contacto eliminado correctamente.");
      await cargarContactos();
    } catch (error) {
      setErrorContactos(obtenerMensajeErrorContacto(error));
    }
  };

  const manejarAnularPago = async (idPago: number) => {
    if (!window.confirm("¿Estás seguro de anular este pago?")) return;

    setErrorPagos(null);
    setMensajePagos(null);

    try {
      await anularPago(idPago);
      setMensajePagos("Pago anulado correctamente.");
      await cargarPagos();
    } catch (error) {
      setErrorPagos(obtenerMensajeErrorPago(error));
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("nutrivida_usuario_activo");
    localStorage.removeItem("usuario_sesion");
    alert("Has cerrado sesión correctamente.");
    navigate("/login");
  };

  const mensajesNoLeidos = listaContactos.filter((c) => !c.leido).length;

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
              <button className="btn btn-danger btn-sm" onClick={cerrarSesion}>
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
          <li className="nav-item">
            <button
              className="nav-link fw-bold text-success"
              data-bs-toggle="tab"
              data-bs-target="#sec-pagos"
            >
              Pagos Registrados
              {listaPagos.length > 0 && (
                <span className="badge bg-success ms-2">
                  {listaPagos.length}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link fw-bold text-success"
              data-bs-toggle="tab"
              data-bs-target="#sec-contactos"
            >
              Mensajes de Contacto
              {mensajesNoLeidos > 0 && (
                <span className="badge bg-danger ms-2">{mensajesNoLeidos}</span>
              )}
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {/* Pestaña Usuarios */}
          <div className="tab-pane fade show active" id="sec-usuarios">
            <div className="card p-3 shadow-sm">
              <h4 className="m-0 mb-3">Gestión de Usuarios</h4>
              <TablaUsuariosAdmin
                listaUsuarios={listaUsuarios}
                onCambiarRol={manejarCambioRol}
                onEliminarUsuario={manejarEliminarUsuario}
                onModificarUsuario={manejarModificarUsuario}
              />
            </div>
          </div>

          {/* Pestaña Reservas */}
          <div className="tab-pane fade" id="sec-reservas">
            <div className="card p-3 shadow-sm">
              <h4 className="m-0 mb-3">Gestión de Reservas</h4>
              <TablaReservasAdmin
                listaReservas={listaReservas}
                onCancelarReserva={manejarCancelarReserva}
              />
            </div>
          </div>

          {/* Pestaña Pagos */}
          <div className="tab-pane fade" id="sec-pagos">
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">Historial de Pagos</h4>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={cargarPagos}
                  disabled={cargandoPagos}
                >
                  {cargandoPagos ? "Actualizando..." : "Actualizar"}
                </button>
              </div>

              {errorPagos && (
                <div className="alert alert-danger">{errorPagos}</div>
              )}

              {mensajePagos && (
                <div className="alert alert-success d-flex justify-content-between align-items-center">
                  <span>{mensajePagos}</span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMensajePagos(null)}
                  ></button>
                </div>
              )}

              {cargandoPagos ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success"></div>
                  <p className="text-muted mt-3 mb-0">
                    Cargando pagos registrados...
                  </p>
                </div>
              ) : (
                <TablaPagosAdmin
                  listaPagos={listaPagos}
                  onAnularPago={manejarAnularPago}
                />
              )}
            </div>
          </div>

          {/* Pestaña Servicios */}
          <div className="tab-pane fade" id="sec-servicios">
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">Servicios y Planes</h4>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={cargarServicios}
                    disabled={cargandoServicios}
                  >
                    {cargandoServicios ? "Actualizando..." : "Actualizar"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={abrirModalCrear}
                    disabled={cargandoTipos}
                  >
                    + Agregar Servicio
                  </button>
                </div>
              </div>

              {errorServicios && (
                <div className="alert alert-danger">{errorServicios}</div>
              )}

              {mensajeServicios && (
                <div className="alert alert-success d-flex justify-content-between align-items-center">
                  <span>{mensajeServicios}</span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMensajeServicios(null)}
                  ></button>
                </div>
              )}

              {cargandoServicios ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success"></div>
                  <p className="text-muted mt-3 mb-0">Cargando servicios...</p>
                </div>
              ) : (
                <TablaServiciosAdmin
                  servicios={listaServicios}
                  onEliminarServicio={manejarEliminarServicio}
                  onModificarServicio={abrirModalEditar}
                />
              )}
            </div>
          </div>

          {/* Pestaña Contactos */}
          <div className="tab-pane fade" id="sec-contactos">
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">Mensajes de Contacto</h4>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={cargarContactos}
                  disabled={cargandoContactos}
                >
                  {cargandoContactos ? "Actualizando..." : "Actualizar"}
                </button>
              </div>

              {errorContactos && (
                <div className="alert alert-danger">{errorContactos}</div>
              )}

              {mensajeContactos && (
                <div className="alert alert-success d-flex justify-content-between align-items-center">
                  <span>{mensajeContactos}</span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMensajeContactos(null)}
                  ></button>
                </div>
              )}

              {cargandoContactos ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success"></div>
                  <p className="text-muted mt-3 mb-0">
                    Cargando mensajes de contacto...
                  </p>
                </div>
              ) : (
                <TablaContactosAdmin
                  listaContactos={listaContactos}
                  onMarcarLeido={manejarMarcarLeido}
                  onResponder={manejarResponderContacto}
                  onEliminar={manejarEliminarContacto}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Crear / Editar Servicio */}
      {mostrarModal && (
        <>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">
                    {servicioEnEdicion
                      ? "Editar Servicio"
                      : "Crear Nuevo Servicio"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cerrarModal}
                  ></button>
                </div>
                <form onSubmit={manejarGuardarServicio}>
                  <div className="modal-body">
                    {errorFormulario && (
                      <div className="alert alert-danger">
                        {errorFormulario}
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-4 mb-2">
                        <label className="form-label" htmlFor="servicioCodigo">
                          Código
                        </label>
                        <input
                          id="servicioCodigo"
                          type="text"
                          className="form-control"
                          placeholder="Ej: CN006"
                          value={formulario.codigo}
                          onChange={(e) =>
                            cambiarCampoFormulario("codigo", e.target.value)
                          }
                          minLength={5}
                          maxLength={10}
                          required
                        />
                        <div className="form-text">
                          Entre 5 y 10 caracteres.
                        </div>
                      </div>
                      <div className="col-md-8 mb-2">
                        <label className="form-label" htmlFor="servicioNombre">
                          Nombre del Servicio
                        </label>
                        <input
                          id="servicioNombre"
                          type="text"
                          className="form-control"
                          value={formulario.nombre}
                          onChange={(e) =>
                            cambiarCampoFormulario("nombre", e.target.value)
                          }
                          maxLength={100}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label" htmlFor="servicioTipo">
                          Tipo de Servicio
                        </label>
                        <select
                          id="servicioTipo"
                          className="form-select"
                          value={formulario.tipoId}
                          onChange={(e) =>
                            cambiarCampoFormulario("tipoId", e.target.value)
                          }
                          required
                        >
                          <option value="">Seleccione un tipo...</option>
                          {tiposServicio.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nombreTipo}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3 mb-2">
                        <label
                          className="form-label"
                          htmlFor="servicioDuracion"
                        >
                          Duración
                        </label>
                        <input
                          id="servicioDuracion"
                          type="text"
                          className="form-control"
                          placeholder="Ej: 50 minutos"
                          value={formulario.duracion}
                          onChange={(e) =>
                            cambiarCampoFormulario("duracion", e.target.value)
                          }
                          maxLength={30}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label
                          className="form-label"
                          htmlFor="servicioModalidad"
                        >
                          Modalidad
                        </label>
                        <select
                          id="servicioModalidad"
                          className="form-select"
                          value={formulario.modalidad}
                          onChange={(e) =>
                            cambiarCampoFormulario("modalidad", e.target.value)
                          }
                          required
                        >
                          {MODALIDADES.map((modalidad) => (
                            <option key={modalidad} value={modalidad}>
                              {modalidad}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-8 mb-2">
                        <label
                          className="form-label"
                          htmlFor="servicioProfesional"
                        >
                          Profesional
                        </label>
                        <input
                          id="servicioProfesional"
                          type="text"
                          className="form-control"
                          placeholder="Ej: Nut. Carolina Fuentes"
                          value={formulario.profesional}
                          onChange={(e) =>
                            cambiarCampoFormulario(
                              "profesional",
                              e.target.value,
                            )
                          }
                          maxLength={50}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-2">
                        <label className="form-label" htmlFor="servicioPrecio">
                          Precio (CLP)
                        </label>
                        <input
                          id="servicioPrecio"
                          type="number"
                          className="form-control"
                          min={1000}
                          step={1}
                          value={formulario.precio}
                          onChange={(e) =>
                            cambiarCampoFormulario("precio", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label
                        className="form-label"
                        htmlFor="servicioDescripcion"
                      >
                        Descripción
                      </label>
                      <textarea
                        id="servicioDescripcion"
                        className="form-control"
                        rows={2}
                        value={formulario.descripcion}
                        onChange={(e) =>
                          cambiarCampoFormulario("descripcion", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label" htmlFor="servicioImagen">
                        Ruta de Imagen
                      </label>
                      <input
                        id="servicioImagen"
                        type="text"
                        className="form-control"
                        value={formulario.imagen}
                        onChange={(e) =>
                          cambiarCampoFormulario("imagen", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cerrarModal}
                      disabled={guardando}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={guardando}
                    >
                      {guardando ? "Guardando..." : "Guardar Servicio"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default Admin;
