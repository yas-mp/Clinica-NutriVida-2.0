const URL_API = "http://localhost:8081/api/usuarios";

export const obtenerUsuarios = async () => {
  const res = await fetch(URL_API);
  return await res.json();
};

export const obtenerNutricionistas = async () => {
  const res = await fetch(URL_API);
  const usuarios = await res.json();
  return usuarios.filter((u: any) => u.rol === "NUTRICIONISTA" && u.activo);
};

export const iniciarSesion = async (correo: string, password: string) => {
  const res = await fetch(`${URL_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.mensaje || "Correo o contraseña incorrectos");
  }

  const usuario = await res.json();
  const { clave, password: pwd, ...usuarioSinClave } = usuario;
  return usuarioSinClave;
};

export const registrarUsuario = async (usuario: any) => {
  const res = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.mensaje || "Error al registrar el usuario");
  }

  return await res.json();
};

export const actualizarUsuario = async (id: number, usuario: any) => {
  const res = await fetch(`${URL_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.mensaje || "Error al actualizar el usuario");
  }

  return await res.json();
};

export const cambiarEstadoUsuario = async (id: number, activo: boolean) => {
  const res = await fetch(`${URL_API}/${id}/estado?activo=${activo}`, {
    method: "PATCH",
  });
  return await res.json();
};

export const eliminarUsuario = async (id: number | string) => {
  const res = await fetch(`${URL_API}/${id}/estado?activo=false`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Error al desactivar el usuario");
};