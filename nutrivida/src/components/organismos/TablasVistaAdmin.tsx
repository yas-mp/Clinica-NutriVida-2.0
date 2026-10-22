import React from "react";
import Boton from "../atomos/Boton";

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
              const rolActual = user.rol || "Cliente";

              return (
                <tr key={i}>
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
                      value={rolActual === "Paciente" ? "Cliente" : rolActual}
                      onChange={(e) => onCambiarRol(i, e.target.value)}
                    >
                      <option value="Cliente">Paciente</option>
                      <option value="Nutricionista">Nutricionista</option>
                      <option value="Administrador">Administrador</option>
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
            listaReservas.map((reserva, i) => (
              <tr key={i}>
                <td>
                  <strong>
                    {reserva.rut || reserva.run || reserva.rutPaciente || "N/A"}
                  </strong>
                </td>
                <td>{reserva.servicio}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora} hrs</td>
                <td>
                  <span className="badge bg-success">
                    {reserva.estado || "Confirmada"}
                  </span>
                </td>
                <td>
                  <Boton
                    label="Cancelar"
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => onCancelarReserva(i)}
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

interface TablaServiciosProps {
  servicios: any[];
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
            <th>Profesional A Cargo</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-3">
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