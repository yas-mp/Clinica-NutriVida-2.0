//@vitest-environment jsdom
import { afterEach, beforeEach, test, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DetalleServicio from "../pages/DetalleServicio";
import { LISTADO_SERVICIOS } from "../components/data/ListadoServicios";
import { obtenerServicioPorId } from "../services/servicioService";

vi.mock("../services/servicioService", () => ({
  obtenerServicioPorId: vi.fn(),
  obtenerMensajeError: (error: unknown) =>
    error instanceof Error ? error.message : "Error inesperado",
}));

beforeEach(() => {
  vi.mocked(obtenerServicioPorId).mockResolvedValue(LISTADO_SERVICIOS[0]);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("Debe mostrar el detalle del servicio 1 obtenido desde el backend", async () => {
  render(
    <MemoryRouter initialEntries={["/servicios/1"]}>
      <Routes>
        <Route path="/servicios/:id" element={<DetalleServicio />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText("Vista Detallada del Servicio")).toBeTruthy();
  expect(screen.getByText("Primera Consulta Nutricional")).toBeTruthy();
  expect(screen.getByText("CN001")).toBeTruthy();
  expect(obtenerServicioPorId).toHaveBeenCalledWith(1);
});

test("Debe mostrar un mensaje claro cuando el servicio no existe en el backend", async () => {
  vi.mocked(obtenerServicioPorId).mockRejectedValueOnce(
    new Error("Servicio no encontrado con ID: 99")
  );

  render(
    <MemoryRouter initialEntries={["/servicios/99"]}>
      <Routes>
        <Route path="/servicios/:id" element={<DetalleServicio />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText("Servicio no encontrado")).toBeTruthy();
  expect(screen.getByRole("alert").textContent).toContain("ID: 99");
});
