//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Servicios from "../pages/Servicios";

test("Debe renderizar el catálogo de servicios y los botones Ver Detalle", () => {
  render(
    <MemoryRouter>
      <Servicios />
    </MemoryRouter>
  );

  expect(screen.getByText("Nuestros Servicios")).toBeTruthy();
  expect(screen.getByText("Asesoría en Nutrición Deportiva")).toBeTruthy();
  expect(screen.getAllByText(/Ver Detalle/i).length).toBeGreaterThan(0);
});