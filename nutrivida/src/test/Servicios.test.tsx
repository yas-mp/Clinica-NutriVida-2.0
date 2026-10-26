//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Servicios from "../pages/Servicios";

test("Debe renderizar los 18 servicios y permitir filtrar por nombre en el buscador", () => {
  render(
    <MemoryRouter>
      <Servicios />
    </MemoryRouter>
  );

  expect(screen.getByText("Nuestros Servicios")).toBeTruthy();
  expect(screen.getAllByText(/Más información/i).length).toBe(18);

  const inputBusqueda = screen.getByPlaceholderText(/Buscar servicio por nombre/i);
  fireEvent.change(inputBusqueda, { target: { value: "Bioimpedanciometría" } });

  expect(screen.getByText("Bioimpedanciometría")).toBeTruthy();
  expect(screen.getAllByText(/Más información/i).length).toBe(1);
});