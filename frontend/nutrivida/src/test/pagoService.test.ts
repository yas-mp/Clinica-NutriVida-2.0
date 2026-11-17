//@vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import {
  ApiError,
  anularPago,
  cambiarEstadoPago,
  listarPagos,
  listarPagosPorRut,
  listarPagosPorUsuario,
  obtenerMensajeError,
  obtenerPagoPorComprobante,
  obtenerPagoPorId,
  obtenerUsuarioIdSesion,
  registrarPago,
} from "../services/pagoService";
import type { PagoRequest } from "../services/pagoService";

const PAGO = {
  id: 1,
  numeroComprobante: "PAY-100001",
  usuarioId: 1,
  rutPaciente: "188663338",
  titular: "Diego Rivas",
  correo: "diego@gmail.com",
  idReserva: "CITA-1700000000001",
  idServicio: 1,
  codigoServicio: "CN001",
  servicioNombre: "Primera Consulta Nutricional",
  metodoPago: "Debito",
  ultimos4Digitos: "6512",
  monto: 35000,
  estado: "Aprobado",
  observacion: "Pago aprobado en portal de simulación",
  fechaPago: "2026-11-17",
  fechaCreacion: "2026-11-17T10:15:00",
};

const PAGO_REQUEST: PagoRequest = {
  usuarioId: 1,
  rutPaciente: "188663338",
  titular: "Diego Rivas",
  correo: "diego@gmail.com",
  idReserva: "CITA-1700000000001",
  idServicio: 1,
  codigoServicio: "CN001",
  servicioNombre: "Primera Consulta Nutricional",
  metodoPago: "Debito",
  ultimos4Digitos: "6512",
  monto: 35000,
  estado: "Aprobado",
};

function respuestaJson(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

test("registrarPago hace POST a /api/pagos con el PagoRequestDTO completo", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(PAGO, 201));
  vi.stubGlobal("fetch", fetchMock);

  const pago = await registrarPago(PAGO_REQUEST);

  expect(pago).toEqual(PAGO);

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8086/api/pagos");
  expect(opciones.method).toBe("POST");
  expect(opciones.body).toBe(JSON.stringify(PAGO_REQUEST));
  expect(new Headers(opciones.headers).get("Content-Type")).toBe("application/json");
});

test("listarPagos consulta /api/pagos", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([PAGO]));
  vi.stubGlobal("fetch", fetchMock);

  const pagos = await listarPagos();

  expect(pagos).toEqual([PAGO]);
  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8086/api/pagos");
});

test("obtenerPagoPorId consulta /api/pagos/{id}", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(PAGO));
  vi.stubGlobal("fetch", fetchMock);

  await expect(obtenerPagoPorId(7)).resolves.toEqual(PAGO);
  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8086/api/pagos/7");
});

test("listarPagosPorUsuario consulta /api/pagos/usuario/{id}", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([PAGO]));
  vi.stubGlobal("fetch", fetchMock);

  await expect(listarPagosPorUsuario(5)).resolves.toEqual([PAGO]);
  expect(fetchMock.mock.calls[0][0]).toBe(
    "http://localhost:8086/api/pagos/usuario/5",
  );
});

test("listarPagosPorRut codifica el RUT en la ruta", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([PAGO]));
  vi.stubGlobal("fetch", fetchMock);

  await listarPagosPorRut("18.866.333-8");

  expect(fetchMock.mock.calls[0][0]).toBe(
    `http://localhost:8086/api/pagos/rut/${encodeURIComponent("18.866.333-8")}`,
  );
});

test("obtenerPagoPorComprobante codifica el número de comprobante", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(PAGO));
  vi.stubGlobal("fetch", fetchMock);

  await obtenerPagoPorComprobante(" PAY-100001 ");

  expect(fetchMock.mock.calls[0][0]).toBe(
    "http://localhost:8086/api/pagos/comprobante/PAY-100001",
  );
});

test("cambiarEstadoPago hace PATCH con el estado como query", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(PAGO));
  vi.stubGlobal("fetch", fetchMock);

  await cambiarEstadoPago(3, "Pendiente");

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8086/api/pagos/3/estado?estado=Pendiente");
  expect(opciones.method).toBe("PATCH");
});

test("anularPago hace PATCH a /api/pagos/{id}/anular", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(respuestaJson({ ...PAGO, estado: "Anulado" }));
  vi.stubGlobal("fetch", fetchMock);

  const pago = await anularPago(9);

  expect(pago.estado).toBe("Anulado");
  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8086/api/pagos/9/anular");
  expect(opciones.method).toBe("PATCH");
});

test("propaga los detalles de validación del backend en un ApiError", async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    respuestaJson(
      {
        status: 400,
        error: "Bad Request",
        mensaje: "Error de validación en los datos enviados",
        detalles: ["monto: El monto total debe ser mayor a 0"],
      },
      400,
    ),
  );
  vi.stubGlobal("fetch", fetchMock);

  await expect(registrarPago(PAGO_REQUEST)).rejects.toMatchObject({
    name: "ApiError",
    status: 400,
    message: "monto: El monto total debe ser mayor a 0",
  });
});

test("informa un mensaje claro cuando el microservicio no responde", async () => {
  const fetchMock = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
  vi.stubGlobal("fetch", fetchMock);

  await expect(listarPagos()).rejects.toThrow(
    /No se pudo conectar con el servicio de Pagos/,
  );
});

test("obtenerMensajeError normaliza ApiError y errores desconocidos", () => {
  expect(obtenerMensajeError(new ApiError("Pago no encontrado", 400))).toBe(
    "Pago no encontrado",
  );
  expect(obtenerMensajeError(new Error("Fallo de red"))).toBe("Fallo de red");
  expect(obtenerMensajeError(null)).toContain("error inesperado");
});

test("obtenerUsuarioIdSesion devuelve el ID numérico cuando existe", () => {
  localStorage.setItem(
    "nutrivida_usuario_activo",
    JSON.stringify({ id: 4, rut: "188663338", nombres: "Diego" }),
  );

  expect(obtenerUsuarioIdSesion()).toBe(4);
});

test("obtenerUsuarioIdSesion devuelve undefined para sesiones sin ID", () => {
  localStorage.setItem(
    "nutrivida_usuario_activo",
    JSON.stringify({ rut: "188663338", nombres: "Diego" }),
  );

  expect(obtenerUsuarioIdSesion()).toBeUndefined();
});
