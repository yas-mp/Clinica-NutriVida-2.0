//@vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import {
  ApiError,
  cambiarEstadoMensaje,
  eliminarMensajeContacto,
  enviarMensajeContacto,
  listarMensajesContacto,
  listarMensajesNoLeidos,
  listarMensajesPorEstado,
  marcarMensajeLeido,
  obtenerMensajeContactoPorId,
  obtenerMensajeError,
  responderMensajeContacto,
} from "../services/contactoService";
import type { ContactoRequest } from "../services/contactoService";

const MENSAJE = {
  id: 1,
  nombre: "Juan Pérez",
  correo: "juan.perez@correo.cl",
  telefono: "+56912345678",
  asunto: "Consulta por planes",
  mensaje: "Quisiera información sobre planes vegetarianos.",
  leido: false,
  estado: "Pendiente",
  respuesta: null,
  fechaEnvio: "2026-11-16T10:30:00",
  fechaRespuesta: null,
};

const MENSAJE_REQUEST: ContactoRequest = {
  nombre: "Juan Pérez",
  correo: "juan.perez@correo.cl",
  mensaje: "Quisiera información sobre planes vegetarianos.",
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

test("listarMensajesContacto consulta /api/contactos", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([MENSAJE]));
  vi.stubGlobal("fetch", fetchMock);

  const mensajes = await listarMensajesContacto();

  expect(mensajes).toEqual([MENSAJE]);
  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8085/api/contactos");
});

test("obtenerMensajeContactoPorId consulta /api/contactos/{id}", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(MENSAJE));
  vi.stubGlobal("fetch", fetchMock);

  await expect(obtenerMensajeContactoPorId(7)).resolves.toEqual(MENSAJE);
  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8085/api/contactos/7");
});

test("listarMensajesPorEstado codifica el estado en la ruta", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([MENSAJE]));
  vi.stubGlobal("fetch", fetchMock);

  await listarMensajesPorEstado("Leído");

  expect(fetchMock.mock.calls[0][0]).toBe(
    `http://localhost:8085/api/contactos/estado/${encodeURIComponent("Leído")}`,
  );
});

test("listarMensajesNoLeidos consulta /api/contactos/no-leidos", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson([MENSAJE]));
  vi.stubGlobal("fetch", fetchMock);

  await listarMensajesNoLeidos();

  expect(fetchMock.mock.calls[0][0]).toBe(
    "http://localhost:8085/api/contactos/no-leidos",
  );
});

test("enviarMensajeContacto hace POST con el ContactoRequestDTO", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson(MENSAJE, 201));
  vi.stubGlobal("fetch", fetchMock);

  await enviarMensajeContacto(MENSAJE_REQUEST);

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8085/api/contactos");
  expect(opciones.method).toBe("POST");
  expect(opciones.body).toBe(JSON.stringify(MENSAJE_REQUEST));
  expect(new Headers(opciones.headers).get("Content-Type")).toBe("application/json");
});

test("marcarMensajeLeido hace PATCH con el parámetro leido", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson({ ...MENSAJE, leido: true }));
  vi.stubGlobal("fetch", fetchMock);

  await marcarMensajeLeido(3, true);

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8085/api/contactos/3/leido?leido=true");
  expect(opciones.method).toBe("PATCH");
});

test("cambiarEstadoMensaje hace PATCH con el estado codificado", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson({ ...MENSAJE, estado: "Respondido" }));
  vi.stubGlobal("fetch", fetchMock);

  await cambiarEstadoMensaje(4, "Respondido");

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8085/api/contactos/4/estado?estado=Respondido");
  expect(opciones.method).toBe("PATCH");
});

test("responderMensajeContacto hace PATCH enviando la respuesta", async () => {
  const fetchMock = vi.fn().mockResolvedValue(respuestaJson({ ...MENSAJE, estado: "Respondido" }));
  vi.stubGlobal("fetch", fetchMock);

  await responderMensajeContacto(8, "Te contactaremos a la brevedad.");

  const [url, opciones] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(url).toBe("http://localhost:8085/api/contactos/8/respuesta");
  expect(opciones.method).toBe("PATCH");
  expect(opciones.body).toBe(
    JSON.stringify({ respuesta: "Te contactaremos a la brevedad." }),
  );
});

test("eliminarMensajeContacto hace DELETE y acepta 204 sin cuerpo", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", fetchMock);

  await expect(eliminarMensajeContacto(5)).resolves.toBeUndefined();
  expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8085/api/contactos/5");
  expect((fetchMock.mock.calls[0][1] as RequestInit).method).toBe("DELETE");
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
          detalles: ["correo: El correo electrónico debe tener un formato válido"],
        },
        400,
      ),
    ),
  );

  const error = await enviarMensajeContacto({
    ...MENSAJE_REQUEST,
    correo: "correo-invalido",
  }).catch((err: unknown) => err);

  expect(error).toBeInstanceOf(ApiError);
  expect((error as ApiError).status).toBe(400);
  expect(obtenerMensajeError(error)).toBe(
    "correo: El correo electrónico debe tener un formato válido",
  );
});

test("informa un mensaje claro cuando el backend no está disponible", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

  const error = await listarMensajesContacto().catch((err: unknown) => err);

  expect(obtenerMensajeError(error)).toContain(
    "No se pudo conectar con el servicio de Contacto en http://localhost:8085",
  );
});
