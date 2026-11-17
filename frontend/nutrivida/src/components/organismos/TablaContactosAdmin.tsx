import React from "react";
import Boton from "../atomos/Boton";
import type { ContactoMensaje } from "../../services/contactoService";

interface TablaContactosAdminProps {
  listaContactos: ContactoMensaje[];
  onMarcarLeido: (id: number, leido: boolean) => void;
  onResponder: (contacto: ContactoMensaje) => void;
  onEliminar: (id: number) => void;
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) {
    return "—";
  }

  const parseada = new Date(fecha);
  if (Number.isNaN(parseada.getTime())) {
    return fecha;
  }

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parseada);
}

function claseEstado(estado: string): string {
  switch (estado) {
    case "Pendiente":
      return "badge bg-warning text-dark";
    case "Leído":
      return "badge bg-info text-dark";
    case "Respondido":
      return "badge bg-success";
    default:
      return "badge bg-secondary";
  }
}

export const TablaContactosAdmin: React.FC<TablaContactosAdminProps> = ({
  listaContactos,
  onMarcarLeido,
  onResponder,
  onEliminar,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Asunto</th>
            <th>Mensaje</th>
            <th>Estado</th>
            <th>Leído</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {listaContactos.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-3">
                No hay mensajes de contacto registrados.
              </td>
            </tr>
          ) : (
            listaContactos.map((contacto) => (
              <tr key={contacto.id}>
                <td className="text-nowrap">{formatearFecha(contacto.fechaEnvio)}</td>
                <td>
                  <strong>{contacto.nombre}</strong>
                  {contacto.telefono && (
                    <div className="small text-muted">{contacto.telefono}</div>
                  )}
                </td>
                <td>{contacto.correo}</td>
                <td>{contacto.asunto || "Consulta general"}</td>
                <td style={{ minWidth: "220px" }}>
                  <span className="d-inline-block text-truncate" style={{ maxWidth: "260px" }}>
                    {contacto.mensaje}
                  </span>
                  {contacto.respuesta && (
                    <div className="small text-success mt-1">
                      <strong>Respuesta:</strong> {contacto.respuesta}
                    </div>
                  )}
                </td>
                <td>
                  <span className={claseEstado(contacto.estado)}>
                    {contacto.estado || "Pendiente"}
                  </span>
                </td>
                <td>{contacto.leido ? "Sí" : "No"}</td>
                <td className="text-nowrap">
                  <Boton
                    label={contacto.leido ? "Marcar no leído" : "Marcar leído"}
                    className="btn btn-outline-success btn-sm me-1 mb-1"
                    onClick={() => onMarcarLeido(contacto.id, !contacto.leido)}
                  />
                  <Boton
                    label="Responder"
                    className="btn btn-warning btn-sm me-1 mb-1"
                    onClick={() => onResponder(contacto)}
                  />
                  <Boton
                    label="Eliminar"
                    className="btn btn-danger btn-sm mb-1"
                    onClick={() => onEliminar(contacto.id)}
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
