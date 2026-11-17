import React, { useCallback, useEffect, useState } from "react";
import {
  TablaReservasAdmin,
  TablaServiciosAdmin,
  TablaUsuariosAdmin,
} from "../components/organismos/TablasVistaAdmin";
import { TablaContactosAdmin } from "../components/organismos/TablaContactosAdmin";
import { useNavigate } from "react-router-dom";
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
import { resolverImagenServicio } from "../services/servicioImagenes";
import {
  eliminarMensajeContacto,
  listarMensajesContacto,
  marcarMensajeLeido,
  obtenerMensajeError as obtenerMensajeErrorContacto,
  responderMensajeContacto,
} from "../services/contactoService";
import type { ContactoMensaje } from "../services/contactoService";

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

const FORMULARIO_SERVICIO_VACIO: FormularioServicio = {
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
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [listaReservas, setListaReservas] = useState<any[]>([]);
  const navigate = useNavigate();

  const [servicios, setServicios] = useState<ServicioNutricional[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [cargandoServicios, setCargandoServicios] = useState<boolean>(false);
  const [cargandoTipos, setCargandoTipos] = useState<boolean>(false);
  const [errorServicios, setErrorServicios] = useState<string | null>(null);
  const [mensajeServicios, setMensajeServicios] = useState<string | null>(null);

  const [listaContactos, setListaContactos] = useState<ContactoMensaje[]>([]);
  const [cargandoContactos, setCargandoContactos] = useState<boolean>(false);
  const [errorContactos, setErrorContactos] = useState<string | null>(null);
  const [mensajeContactos, setMensajeContactos] = useState<string | null>(null);

  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [servicioEnEdicion, setServicioEnEdicion] = useState<ServicioNutricional | null>(
    null,
  );
  const [formulario, setFormulario] = useState<FormularioServicio>(
    FORMULARIO_SERVICIO_VACIO,
  );
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);

  const cargarServicios = useCallback(async () => {
    setCargandoServicios(true);
    setErrorServicios(null);

    try {
      setServicios(await listarServicios());
    } catch (err) {
      setServicios([]);
      setErrorServicios(obtenerMensajeError(err));
    } finally {
      setCargandoServicios(false);
    }
  }, []);

  const cargarTiposServicio = useCallback(async () => {
    setCargandoTipos(true);

    try {
      setTiposServicio(await listarTiposServicio());
    } catch (err) {
      setTiposServicio([]);
      setErrorServicios((previo) => previo ?? obtenerMensajeError(err));
    } finally {
      setCargandoTipos(false);
    }
  }, []);

  const cargarContactos = useCallback(async () => {
    setCargandoContactos(true);
    setErrorContactos(null);

    try {
      setListaContactos(await listarMensajesContacto());
    } catch (err) {
      setListaContactos([]);
      setErrorContactos(obtenerMensajeErrorContacto(err));
    } finally {
      setCargandoContactos(false);
    }
  }, []);

  useEffect(() => {
    const usuarioActivo = JSON.parse(
      localStorage.getItem("nutrivida_usuario_activo") ||
        localStorage.getItem("usuario_sesion") ||
        "null",
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
        "[]",
    );

    const reservas = JSON.parse(
      localStorage.getItem("nutrivida_citas") ||
        localStorage.getItem("nutrivida_reservas") ||
        localStorage.getItem("reservas") ||
        "[]",
    );

    setListaUsuarios(usuarios);
    setListaReservas(reservas);

    void cargarServicios();
    void cargarTiposServicio();
    void cargarContactos();
  }, [navigate, cargarServicios, cargarTiposServicio, cargarContactos]);

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
        localStorage.getItem("nutrivida_usuario_activo") || "null",
      );

      if (usuarioSesion && usuarioSesion.correo === nuevaLista[pos].correo) {
        usuarioSesion.rol = nRol;
        localStorage.setItem(
          "nutrivida_usuario_activo",
          JSON.stringify(usuarioSesion),
        );
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
      user.correo || "",
    );
    if (nuevoCorreo !== null && nuevoCorreo.trim() !== "") {
      const nuevaLista = [...listaUsuarios];
      nuevaLista[index].correo = nuevoCorreo.trim();
      setListaUsuarios(nuevaLista);
      localStorage.setItem("nutrivida_usuarios", JSON.stringify(nuevaLista));
    }
  };

  const cambiarCampo = (campo: keyof FormularioServicio, valor: string) => {
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
  };

  const abrirModalCrear = () => {
    setServicioEnEdicion(null);
    setFormulario(FORMULARIO_SERVICIO_VACIO);
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (id: number) => {
    const encontrado = servicios.find((servicio) => servicio.id === id);

    if (!encontrado) {
      setErrorServicios("No se encontró el servicio seleccionado en el catálogo.");
      return;
    }

    setServicioEnEdicion(encontrado);
    setFormulario({
      codigo: encontrado.codigo ?? "",
      nombre: encontrado.nombre ?? "",
      tipoId: encontrado.tipoId ? String(encontrado.tipoId) : "",
      duracion: encontrado.duracion ?? "",
      modalidad: encontrado.modalidad ?? MODALIDADES[0],
      profesional: encontrado.profesional ?? "",
      precio: encontrado.precio != null ? String(encontrado.precio) : "",
      descripcion: encontrado.descripcion ?? "",
      imagen: encontrado.imagen ?? "",
    });
    setErrorFormulario(null);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setServicioEnEdicion(null);
    setFormulario(FORMULARIO_SERVICIO_VACIO);
    setErrorFormulario(null);
  };

  const guardarServicio = async (e: React.FormEvent) => {
    e.preventDefault();

    const tipoId = Number(formulario.tipoId);
    const precio = Number(formulario.precio);

    if (!formulario.tipoId || !Number.isInteger(tipoId) || tipoId <= 0) {
      setErrorFormulario("Debes seleccionar un tipo de servicio.");
      return;
    }

    if (!Number.isFinite(precio) || precio < 1000) {
      setErrorFormulario("El precio debe ser un número mayor o igual a 1000 CLP.");
      return;
    }

    const dto: ServicioRequest = {
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
        await actualizarServicio(servicioEnEdicion.id, dto);
        setMensajeServicios(`Servicio "${dto.nombre}" actualizado correctamente.`);
      } else {
        await crearServicio(dto);
        setMensajeServicios(`Servicio "${dto.nombre}" creado correctamente.`);
      }

      setErrorServicios(null);
      cerrarModal();
      await cargarServicios();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const eliminarServicioAdmin = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      return;
    }

    setErrorServicios(null);

    try {
      await eliminarServicio(id);
      setMensajeServicios("Servicio eliminado correctamente.");
      await cargarServicios();
    } catch (err) {
      setErrorServicios(obtenerMensajeError(err));
    }
  };

  const marcarLeidoContacto = async (id: number, leido: boolean) => {
    setErrorContactos(null);
    setMensajeContactos(null);

    try {
      await marcarMensajeLeido(id, leido);
      setMensajeContactos(
        leido ? "Mensaje marcado como leído." : "Mensaje marcado como no leído.",
      );
      await cargarContactos();
    } catch (err) {
      setErrorContactos(obtenerMensajeErrorContacto(err));
    }
  };

  const responderContacto = async (contacto: ContactoMensaje) => {
    const respuesta = prompt(
      `Respuesta para ${contacto.nombre} (${contacto.correo}):`,
      contacto.respuesta ?? "",
    );

    if (respuesta === null) {
      return;
    }

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
    } catch (err) {
      setErrorContactos(obtenerMensajeErrorContacto(err));
    }
  };

  const eliminarContacto = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este mensaje de contacto?")) {
      return;
    }

    setErrorContactos(null);
    setMensajeContactos(null);

    try {
      await eliminarMensajeContacto(id);
      setMensajeContactos("Mensaje de contacto eliminado correctamente.");
      await cargarContactos();
    } catch (err) {
      setErrorContactos(obtenerMensajeErrorContacto(err));
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
              data-bs-target="#sec-contactos"
            >
              Mensajes de Contacto
              {listaContactos.filter((contacto) => !contacto.leido).length > 0 && (
                <span className="badge bg-danger ms-2">
                  {listaContactos.filter((contacto) => !contacto.leido).length}
                </span>
              )}
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
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() => void cargarServicios()}
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
                <div className="alert alert-danger" role="alert">
                  {errorServicios}
                </div>
              )}

              {mensajeServicios && (
                <div
                  className="alert alert-success d-flex justify-content-between align-items-center"
                  role="status"
                >
                  <span>{mensajeServicios}</span>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar mensaje"
                    onClick={() => setMensajeServicios(null)}
                  ></button>
                </div>
              )}

              {cargandoServicios ? (
                <div className="text-center py-4" role="status" aria-live="polite">
                  <div className="spinner-border text-success" aria-hidden="true"></div>
                  <p className="text-muted mt-3 mb-0">Cargando servicios...</p>
                </div>
              ) : (
                <TablaServiciosAdmin
                  servicios={servicios}
                  onEliminarServicio={eliminarServicioAdmin}
                  onModificarServicio={abrirModalEditar}
                />
              )}
            </div>
          </div>

          <div className="tab-pane fade" id="sec-contactos">
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">Mensajes de Contacto</h4>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={() => void cargarContactos()}
                  disabled={cargandoContactos}
                >
                  {cargandoContactos ? "Actualizando..." : "Actualizar"}
                </button>
              </div>

              {errorContactos && (
                <div className="alert alert-danger" role="alert">
                  {errorContactos}
                </div>
              )}

              {mensajeContactos && (
                <div
                  className="alert alert-success d-flex justify-content-between align-items-center"
                  role="status"
                >
                  <span>{mensajeContactos}</span>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar mensaje"
                    onClick={() => setMensajeContactos(null)}
                  ></button>
                </div>
              )}

              {cargandoContactos ? (
                <div className="text-center py-4" role="status" aria-live="polite">
                  <div className="spinner-border text-success" aria-hidden="true"></div>
                  <p className="text-muted mt-3 mb-0">Cargando mensajes de contacto...</p>
                </div>
              ) : (
                <TablaContactosAdmin
                  listaContactos={listaContactos}
                  onMarcarLeido={(id, leido) => void marcarLeidoContacto(id, leido)}
                  onResponder={(contacto) => void responderContacto(contacto)}
                  onEliminar={(id) => void eliminarContacto(id)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloModalServicio"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title" id="tituloModalServicio">
                    {servicioEnEdicion ? "Editar Servicio" : "Crear Nuevo Servicio"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Cerrar"
                    onClick={cerrarModal}
                  ></button>
                </div>
                <form onSubmit={guardarServicio}>
                  <div className="modal-body">
                    {errorFormulario && (
                      <div className="alert alert-danger" role="alert">
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
                          onChange={(e) => cambiarCampo("codigo", e.target.value)}
                          minLength={5}
                          maxLength={10}
                          required
                        />
                        <div className="form-text">Entre 5 y 10 caracteres.</div>
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
                          onChange={(e) => cambiarCampo("nombre", e.target.value)}
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
                          onChange={(e) => cambiarCampo("tipoId", e.target.value)}
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
                        <label className="form-label" htmlFor="servicioDuracion">
                          Duración
                        </label>
                        <input
                          id="servicioDuracion"
                          type="text"
                          className="form-control"
                          placeholder="Ej: 50 minutos"
                          value={formulario.duracion}
                          onChange={(e) => cambiarCampo("duracion", e.target.value)}
                          maxLength={30}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <label className="form-label" htmlFor="servicioModalidad">
                          Modalidad
                        </label>
                        <select
                          id="servicioModalidad"
                          className="form-select"
                          value={formulario.modalidad}
                          onChange={(e) => cambiarCampo("modalidad", e.target.value)}
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
                        <label className="form-label" htmlFor="servicioProfesional">
                          Profesional
                        </label>
                        <input
                          id="servicioProfesional"
                          type="text"
                          className="form-control"
                          placeholder="Ej: Nut. Carolina Fuentes"
                          value={formulario.profesional}
                          onChange={(e) => cambiarCampo("profesional", e.target.value)}
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
                          onChange={(e) => cambiarCampo("precio", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label" htmlFor="servicioDescripcion">
                        Descripción
                      </label>
                      <textarea
                        id="servicioDescripcion"
                        className="form-control"
                        rows={3}
                        value={formulario.descripcion}
                        onChange={(e) => cambiarCampo("descripcion", e.target.value)}
                        maxLength={300}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-2">
                      <label className="form-label" htmlFor="servicioImagen">
                        Imagen
                      </label>
                      <input
                        id="servicioImagen"
                        type="text"
                        className="form-control"
                        placeholder="../images/primera-consulta.jpg"
                        value={formulario.imagen}
                        onChange={(e) => cambiarCampo("imagen", e.target.value)}
                        maxLength={255}
                        required
                      />
                      <div className="form-text">
                        Ruta relativa a las imágenes del catálogo o URL completa.
                      </div>
                      <img
                        src={resolverImagenServicio(formulario.imagen)}
                        alt="Vista previa del servicio"
                        className="rounded border mt-2"
                        style={{ height: "80px", objectFit: "cover" }}
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
          <div className="modal-backdrop fade show" onClick={cerrarModal}></div>
        </>
      )}
    </div>
  );
};

export default Admin;
