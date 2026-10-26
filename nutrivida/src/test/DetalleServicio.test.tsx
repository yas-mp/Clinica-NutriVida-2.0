//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DetalleServicio from "../pages/DetalleServicio";

test("Debe mostrar el detalle del servicio 1 cuando la URL tiene el parámetro /servicios/1", () => {
  render(
    <MemoryRouter initialEntries={["/servicios/1"]}>
      <Routes>
        <Route path="/servicios/:id" element={<DetalleServicio />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("Vista Detallada del Servicio")).toBeTruthy();
  expect(screen.getByText("Primera Consulta Nutricional")).toBeTruthy();
  expect(screen.getByText("CN001")).toBeTruthy();
});