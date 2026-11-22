const URL_API = "http://localhost:8084/api/fichas";

export const obtenerFichas = async () => {
  const res = await fetch(URL_API);
  if (!res.ok) throw new Error("Error al cargar las fichas clínicas");
  return await res.json();
};

export const crearFicha = async (ficha: any) => {
  const res = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ficha),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const actualizarFicha = async (id: string, ficha: any) => {
  const res = await fetch(`${URL_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ficha),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
