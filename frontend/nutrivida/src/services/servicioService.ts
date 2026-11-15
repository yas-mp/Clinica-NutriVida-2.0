/**
 * Capa de conexión con el microservicio de Servicios (backend/servicios, Spring Boot).
 *
 * Endpoints consumidos (contrato real de ServicioController y TipoServicioController):
 *   GET    /api/servicios?busqueda=&tipo=
 *   GET    /api/servicios/{id}
 *   POST   /api/servicios
 *   PUT    /api/servicios/{id}
 *   DELETE /api/servicios/{id}
 *   GET    /api/tipos-servicio
 *   GET    /api/tipos-servicio/{id}
 *   POST   /api/tipos-servicio
 *   PUT    /api/tipos-servicio/{id}
 *   DELETE /api/tipos-servicio/{id}
 *
 * La URL base se puede sobreescribir con la variable VITE_API_SERVICIOS_URL
 * (por defecto http://localhost:8082, que es el puerto del microservicio).
 */

const URL_BASE_POR_DEFECTO = 'http://localhost:8082';

const API_BASE_URL = String(
  import.meta.env.VITE_API_SERVICIOS_URL ?? URL_BASE_POR_DEFECTO,
).replace(/\/+$/, '');

export const SERVICIOS_API_URL = API_BASE_URL;

/** Espejo de ServicioResponseDTO. */
export interface ServicioNutricional {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  tipoId?: number;
  duracion: string;
  modalidad: string;
  profesional: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

/** Espejo de ServicioRequestDTO. */
export interface ServicioRequest {
  codigo: string;
  nombre: string;
  duracion: string;
  modalidad: string;
  profesional: string;
  precio: number;
  descripcion: string;
  imagen: string;
  tipoId: number;
}

/** Espejo de TipoServicioResponseDTO. */
export interface TipoServicio {
  id: number;
  nombreTipo: string;
  descripcion: string;
}

/** Espejo de TipoServicioRequestDTO. */
export interface TipoServicioRequest {
  nombreTipo: string;
  descripcion: string;
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
  `No se pudo conectar con el servicio de Servicios en ${API_BASE_URL}. ` +
  'Verifica que el backend de Spring Boot esté en ejecución.';

const MENSAJE_ERROR_GENERICO =
  'Ocurrió un error inesperado al comunicarse con el servicio de Servicios.';

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

function construirQuery(parametros: Record<string, string | undefined>): string {
  const busqueda = new URLSearchParams();
  Object.entries(parametros).forEach(([clave, valor]) => {
    const limpio = valor?.trim();
    if (limpio) {
      busqueda.set(clave, limpio);
    }
  });
  const query = busqueda.toString();
  return query ? `?${query}` : '';
}

export interface FiltrosServicio {
  busqueda?: string;
  tipo?: string;
}

/** GET /api/servicios (con filtros opcionales por texto y tipo). */
export function listarServicios(filtros: FiltrosServicio = {}): Promise<ServicioNutricional[]> {
  const tipo = filtros.tipo?.trim();
  const ruta = `/api/servicios${construirQuery({
    busqueda: filtros.busqueda,
    tipo: tipo && tipo.toLowerCase() !== 'todos' ? tipo : undefined,
  })}`;
  return peticion<ServicioNutricional[]>(ruta);
}

/** GET /api/servicios/{id}. */
export function obtenerServicioPorId(id: number): Promise<ServicioNutricional> {
  return peticion<ServicioNutricional>(`/api/servicios/${id}`);
}

/** POST /api/servicios. */
export function crearServicio(dto: ServicioRequest): Promise<ServicioNutricional> {
  return peticion<ServicioNutricional>('/api/servicios', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

/** PUT /api/servicios/{id}. */
export function actualizarServicio(
  id: number,
  dto: ServicioRequest,
): Promise<ServicioNutricional> {
  return peticion<ServicioNutricional>(`/api/servicios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

/** DELETE /api/servicios/{id}. */
export function eliminarServicio(id: number): Promise<void> {
  return peticion<void>(`/api/servicios/${id}`, { method: 'DELETE' });
}

/** GET /api/tipos-servicio. */
export function listarTiposServicio(): Promise<TipoServicio[]> {
  return peticion<TipoServicio[]>('/api/tipos-servicio');
}

/** GET /api/tipos-servicio/{id}. */
export function obtenerTipoServicioPorId(id: number): Promise<TipoServicio> {
  return peticion<TipoServicio>(`/api/tipos-servicio/${id}`);
}

/** POST /api/tipos-servicio. */
export function crearTipoServicio(dto: TipoServicioRequest): Promise<TipoServicio> {
  return peticion<TipoServicio>('/api/tipos-servicio', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

/** PUT /api/tipos-servicio/{id}. */
export function actualizarTipoServicio(
  id: number,
  dto: TipoServicioRequest,
): Promise<TipoServicio> {
  return peticion<TipoServicio>(`/api/tipos-servicio/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

/** DELETE /api/tipos-servicio/{id}. */
export function eliminarTipoServicio(id: number): Promise<void> {
  return peticion<void>(`/api/tipos-servicio/${id}`, { method: 'DELETE' });
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
