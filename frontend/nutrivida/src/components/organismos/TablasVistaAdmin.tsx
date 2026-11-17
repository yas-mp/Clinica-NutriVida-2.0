import React from "react";
import Boton from "../atomos/Boton";
import type { ServicioNutricional } from "../../services/servicioService";

interface TablaUsuariosProps {
  listaUsuarios: any[];
  onCambiarRol: (index: number, nuevoRol: string) => void;
  onEliminarUsuario: (index: number) => void;
  onModificarUsuario: (index: number) => void;
}

export const TablaUsuariosAdmin: React.FC<TablaUsuariosProps> = ({
  listaUsuarios,
  onCambiarRol,
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
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {listaUsuarios.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-3">
                No hay usuarios registrados.
              </td>
            </tr>
          ) : (
            listaUsuarios.map((user, i) => {
              const nombreCompleto =
                `${user.nombre || user.nombres || ""} ${user.apellidos || ""}`.trim();
              const rolSeleccionado = normalizarRol(user.rol);

              return (
                <tr key={user.id ?? user.rut ?? i}>
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
                    <Boton
                      label="Eliminar"
                      className="btn btn-danger btn-sm me-1"
                      onClick={() => onEliminarUsuario(i)}
                    />
                    <Boton
                      label="Modificar"
                      className="btn btn-warning btn-sm"
                      onClick={() => onModificarUsuario(i)}
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