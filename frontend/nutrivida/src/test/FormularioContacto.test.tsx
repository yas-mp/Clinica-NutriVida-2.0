// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import FormularioContacto from "../components/organismos/FormularioContacto";
import {
  enviarMensajeContacto,
  obtenerMensajeError,
} from "../services/contactoService";
import type { ContactoMensaje } from "../services/contactoService";

vi.mock("../services/contactoService", () => ({
  enviarMensajeContacto: vi.fn(),
  obtenerMensajeError: vi.fn((error: unknown) =>
    error instanceof Error && error.message.trim()
      ? error.message
      : "Ocurrió un error inesperado al comunicarse con el servicio de Contacto.",
  ),
}));

const MENSAJE_GUARDADO = {
  id: 1,
  nombre: "Yasna Mora",
  correo: "yasna@gmail.com",
  telefono: null,
  asunto: "Consulta general",
  mensaje: "Tengo dudas acerca de cómo reservar una hora",
  leido: false,
  estado: "Pendiente",
  respuesta: null,
  fechaEnvio: "2026-11-16T10:30:00",
  fechaRespuesta: null,
};

function completarFormulario() {
  fireEvent.change(screen.getByLabelText(/nombre completo/i), {
    target: { value: "  Yasna Mora " },
  });
  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: " Yasna@Gmail.com " },
  });
  fireEvent.change(screen.getByLabelText(/comentarios/i), {
    target: { value: " Tengo dudas acerca de cómo reservar una hora " },
  });
}

beforeEach(() => {
  vi.mocked(enviarMensajeContacto).mockReset();
  vi.mocked(obtenerMensajeError).mockClear();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

test("envía el mensaje a la API y muestra la confirmación limpiando el formulario", async () => {
  vi.mocked(enviarMensajeContacto).mockResolvedValue(MENSAJE_GUARDADO);

  render(<FormularioContacto />);
  completarFormulario();

  fireEvent.click(screen.getByRole("button", { name: /enviar formulario/i }));

  await waitFor(() => expect(enviarMensajeContacto).toHaveBeenCalledTimes(1));
  expect(enviarMensajeContacto).toHaveBeenCalledWith({
    nombre: "Yasna Mora",
    correo: "yasna@gmail.com",
    mensaje: "Tengo dudas acerca de cómo reservar una hora",
  });

  const alertaExito = await screen.findByRole("status");
  expect(alertaExito.textContent).toContain("Mensaje enviado correctamente");

  expect((screen.getByLabelText(/nombre completo/i) as HTMLInputElement).value).toBe("");
  expect((screen.getByLabelText(/correo/i) as HTMLInputElement).value).toBe("");
  expect((screen.getByLabelText(/comentarios/i) as HTMLInputElement).value).toBe("");
  expect(screen.getByRole("button", { name: /enviar formulario/i })).toBeTruthy();
});

test("muestra los errores de validación sin llamar a la API", () => {
  render(<FormularioContacto />);

  fireEvent.click(screen.getByRole("button", { name: /enviar formulario/i }));

  expect(enviarMensajeContacto).not.toHaveBeenCalled();
  expect(screen.getByText("El nombre no debe estar vacío")).toBeTruthy();
  expect(screen.getByText("El correo electrónico es obligatorio")).toBeTruthy();
  expect(screen.getByText("El comentario no debe estar vacío")).toBeTruthy();
});

test("muestra un correo inválido y no envía el formulario", () => {
  render(<FormularioContacto />);

  fireEvent.change(screen.getByLabelText(/nombre completo/i), {
    target: { value: "Yasna Mora" },
  });
  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: "correo-invalido" },
  });
  fireEvent.change(screen.getByLabelText(/comentarios/i), {
    target: { value: "Consulta" },
  });

  fireEvent.click(screen.getByRole("button", { name: /enviar formulario/i }));

  expect(enviarMensajeContacto).not.toHaveBeenCalled();
  expect(screen.getByText("Ingresa un correo electrónico válido")).toBeTruthy();
});

test("muestra el error del backend cuando el envío falla", async () => {
  vi.mocked(enviarMensajeContacto).mockRejectedValue(
    new Error("correo: El correo electrónico debe tener un formato válido"),
  );

  render(<FormularioContacto />);
  completarFormulario();

  fireEvent.click(screen.getByRole("button", { name: /enviar formulario/i }));

  const alertaError = await screen.findByRole("alert");
  expect(alertaError.textContent).toContain(
    "correo: El correo electrónico debe tener un formato válido",
  );
  expect(screen.getByRole("button", { name: /enviar formulario/i })).toBeTruthy();
});

test("muestra el estado de carga y deshabilita el botón mientras envía", async () => {
  let resolverEnvio: (valor: ContactoMensaje) => void = () => {};
  vi.mocked(enviarMensajeContacto).mockImplementation(
    () =>
      new Promise<ContactoMensaje>((resolve) => {
        resolverEnvio = resolve;
      }),
  );

  render(<FormularioContacto />);
  completarFormulario();

  fireEvent.click(screen.getByRole("button", { name: /enviar formulario/i }));

  const botonEnviando = await screen.findByRole("button", { name: /enviando/i });
  expect((botonEnviando as HTMLButtonElement).disabled).toBe(true);

  resolverEnvio(MENSAJE_GUARDADO);

  await waitFor(() =>
    expect(screen.getByRole("button", { name: /enviar formulario/i })).toBeTruthy(),
  );
});
