//@vitest-environment jsdom
import { afterEach, beforeEach, test, expect, vi } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Servicios from "../pages/Servicios";
import { LISTADO_SERVICIOS } from "../components/data/ListadoServicios";
import { listarServicios, listarTiposServicio } from "../services/servicioService";

vi.mock("../services/servicioService", () => ({
  listarServicios: vi.fn(),
  listarTiposServicio: vi.fn(),
  obtenerMensajeError: (error: unknown) =>
    error instanceof Error ? error.message : "Error inesperado",
}));

const TIPOS_SERVICIO = [
  { id: 1, nombreTipo: "Consulta", descripcion: "Consultas individuales" },
  { id: 2, nombreTipo: "Plan especializado", descripcion: "Planes a medida" },
  { id: 3, nombreTipo: "Evaluación", descripcion: "Mediciones clínicas" },
  { id: 4, nombreTipo: "Taller grupal", descripcion: "Talleres grupales" },
];

beforeEach(() => {
  vi.mocked(listarServicios).mockResolvedValue(LISTADO_SERVICIOS);
  vi.mocked(listarTiposServicio).mockResolvedValue(TIPOS_SERVICIO);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("Debe renderizar los 18 servicios del backend y permitir filtrar por nombre en el buscador", async () => {
  render(
    <MemoryRouter>
      <Servicios />
    </MemoryRouter>
  );

  expect(screen.getByText("Nuestros Servicios")).toBeTruthy();
  expect((await screen.findAllByText(/Más información/i)).length).toBe(18);
  expect(listarServicios).toHaveBeenCalledTimes(1);

  const inputBusqueda = screen.getByPlaceholderText(/Buscar servicio por nombre/i);
  fireEvent.change(inputBusqueda, { target: { value: "Bioimpedanciometría" } });

  await waitFor(() => {
    expect(screen.getAllByText(/Más información/i).length).toBe(1);
  });
  expect(screen.getByText("Bioimpedanciometría")).toBeTruthy();
});

test("Debe mostrar el error del backend y permitir reintentar la carga", async () => {
  vi.mocked(listarServicios).mockRejectedValueOnce(
    new Error("No se pudo conectar con el servicio de Servicios")
  );

  render(
    <MemoryRouter>
      <Servicios />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/No se pudo conectar con el servicio de Servicios/i)
  ).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: /Reintentar/i }));

  expect((await screen.findAllByText(/Más información/i)).length).toBe(18);
});
