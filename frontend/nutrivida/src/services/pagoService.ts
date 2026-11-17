/**
 * Capa de conexión con el microservicio de Pagos (backend/pago, Spring Boot).
 *
 * Endpoints consumidos (contrato real de PagoController):
 *   GET    /api/pagos
 *   GET    /api/pagos/{id}
 *   GET    /api/pagos/comprobante/{numeroComprobante}
 *   GET    /api/pagos/usuario/{usuarioId}
 *   GET    /api/pagos/rut/{rut}
 *   GET    /api/pagos/estado/{estado}
 *   POST   /api/pagos
 *   PATCH  /api/pagos/{id}/estado?estado=
 *   PATCH  /api/pagos/{id}/anular
 *
 * La URL base se puede sobreescribir con la variable VITE_API_PAGO_URL
 * (por defecto http://localhost:8086, que es el puerto del microservicio).
 */

const URL_BASE_POR_DEFECTO = 'http://localhost:8086';

const API_BASE_URL = String(
  import.meta.env.VITE_API_PAGO_URL ?? URL_BASE_POR_DEFECTO,
).replace(/\/+$/, '');

export const PAGOS_API_URL = API_BASE_URL;

/** Estados soportados por el backend. */
export type EstadoPago = 'Aprobado' | 'Pendiente' | 'Rechazado' | 'Anulado';

/** Métodos de pago soportados por el backend. */
export type MetodoPago = 'Debito' | 'Credito' | 'Prepago';

/** Espejo de PagoResponseDTO. */
export interface Pago {
  id: number;
  numeroComprobante: string;
  usuarioId: number | null;
  rutPaciente: string;
  titular: string;
  correo: string;
  idReserva: string | null;
  idServicio: number | null;
  codigoServicio: string;
  servicioNombre: string;
  metodoPago: string;
  ultimos4Digitos: string;
  monto: number;
  estado: string;
  observacion: string | null;
  fechaPago: string;
  fechaCreacion: string | null;
}

/** Espejo de PagoRequestDTO. */
export interface PagoRequest {
  usuarioId?: number;
  numeroComprobante?: string;
  rutPaciente: string;
  titular: string;
  correo: string;
  idReserva?: string;
  idServicio?: number;
  codigoServicio: string;
  servicioNombre: string;
  metodoPago: string;
  ultimos4Digitos: string;
  monto: number;
  estado?: string;
  observacion?: string;
  fechaPago?: string;
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
  `No se pudo conectar con el servicio de Pagos en ${API_BASE_URL}. ` +
  'Verifica que el backend de Spring Boot esté en ejecución.';

const MENSAJE_ERROR_GENERICO =
  'Ocurrió un error inesperado al comunicarse con el servicio de Pagos.';

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

/** POST /api/pagos: registra la simulación de pago y devuelve el comprobante real. */
export function registrarPago(dto: PagoRequest): Promise<Pago> {
  return peticion<Pago>('/api/pagos', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

/** GET /api/pagos: historial completo (más reciente primero). */
export function listarPagos(): Promise<Pago[]> {
  return peticion<Pago[]>('/api/pagos');
}

/** GET /api/pagos/{id}. */
export function obtenerPagoPorId(id: number): Promise<Pago> {
  return peticion<Pago>(`/api/pagos/${id}`);
}

/** GET /api/pagos/comprobante/{numeroComprobante}. */
export function obtenerPagoPorComprobante(numeroComprobante: string): Promise<Pago> {
  return peticion<Pago>(
    `/api/pagos/comprobante/${encodeURIComponent(numeroComprobante.trim())}`,
  );
}

/** GET /api/pagos/usuario/{usuarioId}. */
export function listarPagosPorUsuario(usuarioId: number): Promise<Pago[]> {
  return peticion<Pago[]>(`/api/pagos/usuario/${usuarioId}`);
}

/** GET /api/pagos/rut/{rut}: alternativa cuando no hay usuarioId numérico en sesión. */
export function listarPagosPorRut(rut: string): Promise<Pago[]> {
  return peticion<Pago[]>(`/api/pagos/rut/${encodeURIComponent(rut.trim())}`);
}

/** GET /api/pagos/estado/{estado}. */
export function listarPagosPorEstado(estado: EstadoPago): Promise<Pago[]> {
  return peticion<Pago[]>(`/api/pagos/estado/${encodeURIComponent(estado)}`);
}

/** PATCH /api/pagos/{id}/estado?estado=. */
export function cambiarEstadoPago(id: number, estado: EstadoPago): Promise<Pago> {
  return peticion<Pago>(
    `/api/pagos/${id}/estado?estado=${encodeURIComponent(estado)}`,
    { method: 'PATCH' },
  );
}

/** PATCH /api/pagos/{id}/anular. */
export function anularPago(id: number): Promise<Pago> {
  return peticion<Pago>(`/api/pagos/${id}/anular`, { method: 'PATCH' });
}

/**
 * Resuelve el ID numérico del usuario logueado, si la sesión lo expone.
 *
 * El frontend guarda la sesión en localStorage sin un `id` garantizado (los
 * usuarios se registran localmente). Cuando no existe un ID válido se devuelve
 * `undefined` y el pago se registra como invitado, tal como permite el backend.
 */
export function obtenerUsuarioIdSesion(): number | undefined {
  const sesion = localStorage.getItem('nutrivida_usuario_activo');
  if (!sesion) {
    return undefined;
  }

  try {
    const usuario = JSON.parse(sesion) as Record<string, unknown> | null;
    if (!usuario) {
      return undefined;
    }

    const candidato = Number(
      usuario.id ?? usuario.usuarioId ?? usuario.idUsuario,
    );

    return Number.isInteger(candidato) && candidato > 0 ? candidato : undefined;
  } catch {
    return undefined;
  }
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
