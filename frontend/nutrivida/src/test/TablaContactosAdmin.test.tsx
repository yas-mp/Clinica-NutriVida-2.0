// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TablaContactosAdmin } from "../components/organismos/TablaContactosAdmin";
import type { ContactoMensaje } from "../services/contactoService";

const CONTACTO: ContactoMensaje = {
  id: 5,
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

afterEach(() => {
  cleanup();
});

test("renderiza los mensajes de contacto y muestra el estado", () => {
  render(
    <TablaContactosAdmin
      listaContactos={[CONTACTO]}
      onMarcarLeido={vi.fn()}
      onResponder={vi.fn()}
      onEliminar={vi.fn()}
    />,
  );

  expect(screen.getByText("Juan Pérez")).toBeTruthy();
  expect(screen.getByText("juan.perez@correo.cl")).toBeTruthy();
  expect(screen.getByText("Pendiente")).toBeTruthy();
  expect(screen.getByText("No")).toBeTruthy();
});

test("muestra un mensaje cuando no hay contactos registrados", () => {
  render(
    <TablaContactosAdmin
      listaContactos={[]}
      onMarcarLeido={vi.fn()}
      onResponder={vi.fn()}
      onEliminar={vi.fn()}
    />,
  );

  expect(screen.getByText(/no hay mensajes de contacto registrados/i)).toBeTruthy();
});

test("ejecuta las acciones de marcar leído, responder y eliminar", () => {
  const marcarLeido = vi.fn();
  const responder = vi.fn();
  const eliminar = vi.fn();

  render(
    <TablaContactosAdmin
      listaContactos={[CONTACTO]}
      onMarcarLeido={marcarLeido}
      onResponder={responder}
      onEliminar={eliminar}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: /marcar leído/i }));
  expect(marcarLeido).toHaveBeenCalledWith(5, true);

  fireEvent.click(screen.getByRole("button", { name: /responder/i }));
  expect(responder).toHaveBeenCalledWith(CONTACTO);

  fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));
  expect(eliminar).toHaveBeenCalledWith(5);
});
