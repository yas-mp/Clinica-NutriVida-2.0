//@vitest-environment jsdom
import { test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Usuario from "../pages/Usuario";

beforeEach(() => {
  localStorage.setItem(
    "nutrivida_usuario_activo",
    JSON.stringify({
      nombres: "Paciente",
      apellidos: "Test",
      rut: "188663338",
      correo: "paciente@nutrivida.cl",
      region: "La Araucanía",
      comuna: "Temuco",
      rol: "PACIENTE",
    })
  );
});

test("Debe renderizar el portal del paciente con sus datos personales y tabla de citas", () => {
  render(
    <MemoryRouter>
      <Usuario />
    </MemoryRouter>
  );

  expect(screen.getByText(/Portal/i)).toBeTruthy();
  expect(screen.getByText("Mis Datos Personales")).toBeTruthy();
  expect(screen.getByText("Mis Citas Médicas")).toBeTruthy();
});