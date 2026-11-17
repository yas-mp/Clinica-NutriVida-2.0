/**
 * Capa de conexión con el microservicio de Contacto (backend/contacto, Spring Boot).
 *
 * Endpoints consumidos (contrato real de ContactoController):
 *   GET    /api/contactos
 *   GET    /api/contactos/{id}
 *   GET    /api/contactos/estado/{estado}
 *   GET    /api/contactos/no-leidos
 *   POST   /api/contactos
 *   PATCH  /api/contactos/{id}/leido?leido=
 *   PATCH  /api/contactos/{id}/estado?estado=
 *   PATCH  /api/contactos/{id}/respuesta
 *   DELETE /api/contactos/{id}
 *
 * La URL base se puede sobreescribir con la variable VITE_API_CONTACTO_URL
 * (por defecto http://localhost:8085, que es el puerto del microservicio).
 */

const URL_BASE_POR_DEFECTO = 'http://localhost:8085';

const API_BASE_URL = String(
  import.meta.env.VITE_API_CONTACTO_URL ?? URL_BASE_POR_DEFECTO,
).replace(/\/+$/, '');

export const CONTACTO_API_URL = API_BASE_URL;

/** Estados de gestión soportados por el backend. */
export type EstadoContacto = 'Pendiente' | 'Leído' | 'Respondido';

/** Espejo de ContactoResponseDTO. */
export interface ContactoMensaje {
  id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  leido: boolean;
  estado: string;
  respuesta: string | null;
  fechaEnvio: string;
  fechaRespuesta: string | null;
}

/** Espejo de ContactoRequestDTO. */
export interface ContactoRequest {
  nombre: string;
  correo: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

/** Espejo de ErrorResponseDTO (GlobalExceptionHandler). */
interface ErrorResponseDTO {
  status?: number;
  error?: string;
  mensaje?: string;
  detalles?: string[];
}

export class ApiError extends Error {
  status: number | null;
  detalles: string[];

  constructor(mensaje: string, status: number | null = null, detalles: string[] = []) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.detalles = detalles;
  }
}

const MENSAJE_SIN_CONEXION =
  `No se pudo conectar con el servicio de Contacto en ${API_BASE_URL}. ` +
  'Verifica que el backend de Spring Boot esté en ejecución.';

const MENSAJE_ERROR_GENERICO =
  'Ocurrió un error inesperado al comunicarse con el servicio de Contacto.';

async function leerCuerpo(respuesta: Response): Promise<unknown> {
  const texto = await respuesta.text();
  if (!texto) {
    return null;
  }
  try {
    return JSON.parse(texto) as unknown;
  } catch {
    return texto;
  }
}

async function peticion<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const headers = new Headers(opciones.headers);
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (opciones.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, { ...opciones, headers });
  } catch {
    throw new ApiError(MENSAJE_SIN_CONEXION);
  }

  if (!respuesta.ok) {
    const cuerpo = await leerCuerpo(respuesta);
    const error =
      typeof cuerpo === 'object' && cuerpo !== null ? (cuerpo as ErrorResponseDTO) : null;

    const detalles = Array.isArray(error?.detalles)
      ? error.detalles.filter(
          (detalle): detalle is string => typeof detalle === 'string' && detalle.trim() !== '',
        )
      : [];

    const mensaje =
      (detalles.length > 0 ? detalles.join(' · ') : '') ||
      error?.mensaje?.trim() ||
      error?.error?.trim() ||
      `Error ${respuesta.status}${respuesta.statusText ? ` (${respuesta.statusText})` : ''}.`;

    throw new ApiError(mensaje, respuesta.status, detalles);
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  return (await leerCuerpo(respuesta)) as T;
}

/** GET /api/contactos. */
export function listarMensajesContacto(): Promise<ContactoMensaje[]> {
  return peticion<ContactoMensaje[]>('/api/contactos');
}

/** GET /api/contactos/{id}. */
export function obtenerMensajeContactoPorId(id: number): Promise<ContactoMensaje> {
  return peticion<ContactoMensaje>(`/api/contactos/${id}`);
}

/** GET /api/contactos/estado/{estado}. */
export function listarMensajesPorEstado(estado: string): Promise<ContactoMensaje[]> {
  return peticion<ContactoMensaje[]>(
    `/api/contactos/estado/${encodeURIComponent(estado.trim())}`,
  );
}

/** GET /api/contactos/no-leidos. */
export function listarMensajesNoLeidos(): Promise<ContactoMensaje[]> {
  return peticion<ContactoMensaje[]>('/api/contactos/no-leidos');
}

/** POST /api/contactos. */
export function enviarMensajeContacto(dto: ContactoRequest): Promise<ContactoMensaje> {
  return peticion<ContactoMensaje>('/api/contactos', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

/** PATCH /api/contactos/{id}/leido?leido=. */
export function marcarMensajeLeido(id: number, leido: boolean): Promise<ContactoMensaje> {
  return peticion<ContactoMensaje>(`/api/contactos/${id}/leido?leido=${leido}`, {
    method: 'PATCH',
  });
}

/** PATCH /api/contactos/{id}/estado?estado=. */
export function cambiarEstadoMensaje(
  id: number,
  estado: EstadoContacto | string,
): Promise<ContactoMensaje> {
  return peticion<ContactoMensaje>(
    `/api/contactos/${id}/estado?estado=${encodeURIComponent(estado.trim())}`,
    { method: 'PATCH' },
  );
}

/** PATCH /api/contactos/{id}/respuesta. */
export function responderMensajeContacto(
  id: number,
  respuesta: string,
): Promise<ContactoMensaje> {
  return peticion<ContactoMensaje>(`/api/contactos/${id}/respuesta`, {
    method: 'PATCH',
    body: JSON.stringify({ respuesta }),
  });
}

/** DELETE /api/contactos/{id}. */
export function eliminarMensajeContacto(id: number): Promise<void> {
  return peticion<void>(`/api/contactos/${id}`, { method: 'DELETE' });
}

/** Normaliza cualquier error (red, validación o negocio) a un mensaje legible. */
export function obtenerMensajeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return MENSAJE_ERROR_GENERICO;
}
