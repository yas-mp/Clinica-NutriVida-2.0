const URL_API = "http://localhost:8083/api/reservas";

export const obtenerReservas = async () => {
  const res = await fetch(URL_API);
  return await res.json();
};

export const crearReserva = async (reserva: any) => {
  const res = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const actualizarReserva = async (id: string, reserva: any) => {
  const res = await fetch(`${URL_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const cancelarReserva = async (id: string) => {
  const res = await fetch(`${URL_API}/${id}/estado?estado=Cancelada`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Error al cancelar la cita");
};

export const cambiarEstadoReserva = async (id: string, nuevoEstado: string) => {
  const res = await fetch(`${URL_API}/${id}/estado?estado=${nuevoEstado}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Error al actualizar el estado de la cita");
};