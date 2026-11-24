import React from "react";
import Boton from "../atomos/Boton";
import type { ServicioNutricional } from "../../services/servicioService";
import type { Pago } from "../../services/pagoService";

interface TablaUsuariosProps {
  listaUsuarios: any[];
  onCambiarRol: (index: number, nuevoRol: string) => void;
  onCambiarEstadoUsuario: (index: number) => void;
  onEliminarUsuario: (index: number) => void;
  onModificarUsuario: (index: number) => void;
}

export const TablaUsuariosAdmin: React.FC<TablaUsuariosProps> = ({
  listaUsuarios,
  onCambiarRol,
  onCambiarEstadoUsuario,
  onEliminarUsuario,
  onModificarUsuario,
}) => {
  const normalizarRol = (rol?: string): string => {
    const r = String(rol || "").toUpperCase();
    if (r.includes("ADMIN")) return "ADMIN";
    if (r.includes("NUTRI")) return "NUTRICIONISTA";
    return "PACIENTE";
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>RUN</th>
            <th>Nombre Completo</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {listaUsuarios.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-3">
                No hay usuarios registrados.
              </td>
            </tr>
          ) : (
            listaUsuarios.map((user, i) => {
              const nombreCompleto =
                `${user.nombre || user.nombres || ""} ${user.apellidos || ""}`.trim();
              const rolSeleccionado = normalizarRol(user.rol);
              const estaActivo = user.activo !== false;

              return (
                <tr
                  key={user.id ?? user.rut ?? i}
                  className={!estaActivo ? "table-secondary text-muted" : ""}
                >
                  <td>
                    <strong>{user.rut || user.run || "N/A"}</strong>
                  </td>
                  <td>{nombreCompleto || "Sin nombre"}</td>
                  <td>{user.correo || "N/A"}</td>
                  <td>
                    {user.direccion || "N/A"}, {user.comuna || ""}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm border-success fw-bold"
                      value={rolSeleccionado}
                      onChange={(e) => onCambiarRol(i, e.target.value)}
                    >
                      <option value="PACIENTE">Paciente</option>
                      <option value="NUTRICIONISTA">Nutricionista</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </td>
                  <td>
                    <span
                      className={`badge ${estaActivo ? "bg-success" : "bg-secondary"}`}
                    >
                      {estaActivo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <Boton
                      label={estaActivo ? "Desactivar" : "Reactivar"}
                      className={`btn btn-sm me-1 ${estaActivo ? "btn-outline-secondary" : "btn-success"}`}
                      onClick={() => onCambiarEstadoUsuario(i)}
                    />
                    <Boton
                      label="Modificar"
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => onModificarUsuario(i)}
                    />
                    <Boton
                      label="Eliminar"
                      className="btn btn-danger btn-sm"
                      onClick={() => onEliminarUsuario(i)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

interface TablaReservasProps {
  listaReservas: any[];
  onCancelarReserva: (index: number) => void;
}

export const TablaReservasAdmin: React.FC<TablaReservasProps> = ({
  listaReservas,
  onCancelarReserva,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>RUN</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {listaReservas.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-3">
                No hay horas reservadas.
              </td>
            </tr>
          ) : (
            listaReservas.map((reserva, i) => {
              const estado = reserva.estado || "Pendiente";
              const badgeClase =
                estado === "Confirmada"
                  ? "bg-success"
                  : estado === "Cancelada"
                  ? "bg-danger"
                  : "bg-warning text-dark";

              return (
                <tr key={reserva.id ?? i}>
                  <td>
                    <strong>
                      {reserva.rut || reserva.run || reserva.rutPaciente || "N/A"}
                    </strong>
                  </td>
                  <td>{reserva.servicio}</td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.hora} hrs</td>
                  <td>
                    <span className={`badge ${badgeClase}`}>{estado}</span>
                  </td>
                  <td>
                    {estado !== "Cancelada" && (
                      <Boton
                        label="Cancelar"
                        className="btn btn-danger btn-sm me-1"
                        onClick={() => onCancelarReserva(i)}
                      />
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

function formatearFechaPago(fecha: string | null): string {
  if (!fecha) {
    return "—";
  }

  const [anio, mes, dia] = fecha.split("T")[0].split("-");
  if (anio && mes && dia) {
    return `${dia}-${mes}-${anio}`;
  }

  return fecha;
}

function claseEstadoPago(estado: string): string {
  switch (estado) {
    case "Aprobado":
      return "badge bg-success";
    case "Pendiente":
      return "badge bg-warning text-dark";
    case "Rechazado":
      return "badge bg-danger";
    default:
      return "badge bg-secondary";
  }
}

interface TablaPagosProps {
  listaPagos: Pago[];
  onAnularPago?: (id: number) => void;
}

export const TablaPagosAdmin: React.FC<TablaPagosProps> = ({
  listaPagos,
  onAnularPago,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Comprobante</th>
            <th>Fecha</th>
            <th>Paciente</th>
            <th>Servicio</th>
            <th>Medio de Pago</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {listaPagos.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-3">
                No hay pagos registrados.
              </td>
            </tr>
          ) : (
            listaPagos.map((pago) => (
              <tr key={pago.id}>
                <td>
                  <strong>{pago.numeroComprobante}</strong>
                </td>
                <td className="text-nowrap">{formatearFechaPago(pago.fechaPago)}</td>
                <td>
                  <strong>{pago.titular}</strong>
                  <div className="small text-muted">{pago.rutPaciente}</div>
                </td>
                <td>
                  {pago.servicioNombre}
                  <div className="small text-muted">{pago.codigoServicio}</div>
                </td>
                <td>
                  {pago.metodoPago}
                  <div className="small text-muted">**** {pago.ultimos4Digitos}</div>
                </td>
                <td>${pago.monto.toLocaleString("es-CL")}</td>
                <td>
                  <span className={claseEstadoPago(pago.estado)}>{pago.estado}</span>
                </td>
                <td>
                  {onAnularPago && pago.estado !== "Anulado" ? (
                    <Boton
                      label="Anular"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onAnularPago(pago.id)}
                    />
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

interface TablaServiciosProps {
  servicios: ServicioNutricional[];
  onEliminarServicio: (id: number) => void;
  onModificarServicio: (id: number) => void;
}

export const TablaServiciosAdmin: React.FC<TablaServiciosProps> = ({
  servicios,
  onEliminarServicio,
  onModificarServicio,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Nombre del Servicio</th>
            <th>Tipo</th>
            <th>Profesional A Cargo</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-3">
                No hay servicios registrados.
              </td>
            </tr>
          ) : (
            servicios.map((servi) => (
              <tr key={servi.id}>
                <td>
                  <strong>{servi.codigo}</strong>
                </td>
                <td>{servi.nombre}</td>
                <td>
                  <span className="badge bg-success">{servi.tipo || "Sin tipo"}</span>
                </td>
                <td>{servi.profesional}</td>
                <td>${servi.precio}</td>
                <td>
                  <Boton
                    label="Eliminar"
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => onEliminarServicio(servi.id)}
                  />
                  <Boton
                    label="Modificar"
                    className="btn btn-warning btn-sm"
                    onClick={() => onModificarServicio(servi.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};