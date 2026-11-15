//@vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import {
  ApiError,
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  listarServicios,
  listarTiposServicio,
  obtenerMensajeError,
  obtenerServicioPorId,
} from "../services/servicioService";
import type { ServicioRequest } from "../services/servicioService";

const SERVICIO = {
  id: 1,
  codigo: "CN001",
  nombre: "Primera Consulta Nutricional",
  tipo: "Consulta",
  tipoId: 1,
  duracion: "50 minutos",
  modalidad: "Presencial",
  profesional: "Nutricionista",
  precio: 35000,
  descripcion: "Evaluación inicial",
  imagen: "../images/primera-consulta.jpg",
};

const SERVICIO_REQUEST: ServicioRequest = {
  codigo: "CN001",
  nombre: "Primera Consulta Nutricional",
  duracion: "50 minutos",
  modalidad: "Presencial",
  profesional: "Nutricionista",
  precio: 35000,
  descripcion: "Evaluación inicial",
  imagen: "../images/primera-consulta.jpg",
  tipoId: 1,
};

function respuestaJson(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("listarServicios consulta /api/servicios propagando los filtros", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([SERVICIO]));
  vi.stubGlobal("fetch", fetchMock);

  const servicios = await listarServicios({ busqueda: "  CN001 ", tipo: "Consulta" });

  expect(servicios).toEqual([SERVICIO]);
  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe(
    "http://localhost:8082/api/servicios?busqueda=CN001&tipo=Consulta"
  );
  expect(opciones.method).toBeUndefined();
});

test("listarServicios ignora el filtro 'Todos'", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([SERVICIO]));
  vi.stubGlobal("fetch", fetchMock);

  await listarServicios({ tipo: "Todos" });

  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8082/api/servicios");
});

test("obtenerServicioPorId consulta /api/servicios/{id}", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(SERVICIO));
  vi.stubGlobal("fetch", fetchMock);

  await expect(obtenerServicioPorId(7)).resolves.toEqual(SERVICIO);
  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8082/api/servicios/7");
});

test("crearServicio hace POST con el ServicioRequestDTO completo", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(SERVICIO, 201));
  vi.stubGlobal("fetch", fetchMock);

  await crearServicio(SERVICIO_REQUEST);

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8082/api/servicios");
  expect(opciones.method).toBe("POST");
  expect(opciones.body).toBe(JSON.stringify(SERVICIO_REQUEST));
  expect(new Headers(opciones.headers).get("Content-Type")).toBe("application/json");
});

test("actualizarServicio hace PUT a /api/servicios/{id}", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(SERVICIO));
  vi.stubGlobal("fetch", fetchMock);

  await actualizarServicio(1, SERVICIO_REQUEST);

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8082/api/servicios/1");
  expect(opciones.method).toBe("PUT");
});

test("eliminarServicio hace DELETE y acepta 204 sin cuerpo", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", fetchMock);

  await expect(eliminarServicio(5)).resolves.toBeUndefined();
  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8082/api/servicios/5");
  expect((fetchMock.mock.calls[0][1] as RequestInit).method).toBe("DELETE");
});

test("listarTiposServicio consulta /api/tipos-servicio", async () => {
  const tipos = [{ id: 1, nombreTipo: "Consulta", descripcion: "Consultas" }];
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(tipos));
  vi.stubGlobal("fetch", fetchMock);

  await expect(listarTiposServicio()).resolves.toEqual(tipos);
  expect(fetchMock.mock.calls[0][0]).toBe(
    "http://localhost:8082/api/tipos-servicio"
  );
});

test("expone el mensaje de negocio del backend cuando el código está duplicado (400)", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      respuestaJson(
        {
          timestamp: "2026-11-15 10:00:00",
          status: 400,
          error: "Bad Request",
          mensaje: "Ya existe un servicio con el código: CN001",
          path: "/api/servicios",
          detalles: ["Ya existe un servicio con el código: CN001"],
        },
        400
      )
    )
  );

  const error = await crearServicio(SERVICIO_REQUEST).catch((err: unknown) => err);

  expect(error).toBeInstanceOf(ApiError);
  expect((error as ApiError).status).toBe(400);
  expect(obtenerMensajeError(error)).toBe(
    "Ya existe un servicio con el código: CN001"
  );
});

test("expone los detalles de validación devueltos por el GlobalExceptionHandler", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      respuestaJson(
        {
          status: 400,
          error: "Bad Request",
          mensaje: "Error de validación en los datos enviados",
          detalles: ["precio: El precio mínimo debe ser 1000 CLP"],
        },
        400
      )
    )
  );

  const error = await crearServicio({ ...SERVICIO_REQUEST, precio: 500 }).catch(
    (err: unknown) => err
  );

  expect(obtenerMensajeError(error)).toBe("precio: El precio mínimo debe ser 1000 CLP");
});

test("informa un mensaje claro cuando el backend no está disponible", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

  const error = await listarServicios().catch((err: unknown) => err);

  expect(obtenerMensajeError(error)).toContain(
    "No se pudo conectar con el servicio de Servicios en http://localhost:8082"
  );
});
