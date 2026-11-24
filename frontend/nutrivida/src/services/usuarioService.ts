const URL_API = "http://localhost:8081/api/usuarios";

export const obtenerUsuarios = async () => {
  const res = await fetch(URL_API);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
};

export const obtenerNutricionistas = async () => {
  const res = await fetch(URL_API);
  if (!res.ok) throw new Error("Error al obtener nutricionistas");
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

export const actualizarUsuario = async (id: number | string, usuario: any) => {
  const idsPorRol: Record<string, number> = {
    Administrador: 1,
    ADMIN: 1,
    Nutricionista: 2,
    NUTRICIONISTA: 2,
    Paciente: 3,
    PACIENTE: 3,
  };

  const rolTexto =
    typeof usuario.rol === "object" ? usuario.rol?.nombre : usuario.rol;

  const rolId =
    usuario.rolId ?? idsPorRol[rolTexto] ?? (Number(rolTexto) || 3);

  const palabrasNombre = (usuario.nombre || "").trim().split(" ");
  const nombres = usuario.nombres || palabrasNombre[0] || "Usuario";
  const apellidos =
    usuario.apellidos || palabrasNombre.slice(1).join(" ") || "NutriVida";

  const datosActualizar = {
    rut: usuario.rut,
    nombres,
    apellidos,
    correo: usuario.correo,
    region: usuario.region || "La Araucanía",
    comuna: usuario.comuna || "Temuco",
    direccion: usuario.direccion || "N/A",
    rolId: Number(rolId),
  };

  const res = await fetch(`${URL_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizar),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.mensaje || `Error HTTP ${res.status} al actualizar usuario`);
  }

  return await res.json();
};

export const cambiarRolUsuario = async (id: number | string, nuevoRol: string) => {
  const idsPorRol: Record<string, number> = {
    Administrador: 1,
    ADMIN: 1,
    Nutricionista: 2,
    NUTRICIONISTA: 2,
    Paciente: 3,
    PACIENTE: 3,
  };

  const rolId = idsPorRol[nuevoRol] ?? Number(nuevoRol);

  const res = await fetch(`${URL_API}/${id}/rol?rolId=${rolId}`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.mensaje || "Error al cambiar el rol del usuario");
  }

  return await res.json();
};

export const cambiarEstadoUsuario = async (id: number | string, activo: boolean) => {
  const res = await fetch(`${URL_API}/${id}/estado?activo=${activo}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Error al cambiar el estado del usuario");
  return await res.json();
};

export const eliminarUsuario = async (id: number | string) => {
  const res = await fetch(`${URL_API}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el usuario");
};
