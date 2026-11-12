// @vitest-environment jsdom
import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FormularioLogin from "../components/organismos/FormularioLogin";

const alertas = vi.spyOn(window, "alert").mockImplementation(() => {});

beforeEach(() => {
  alertas.mockClear();
  localStorage.clear();
});

test("Debe dejar iniciar sesión si los datos son válidos", () => {
  render(
    <MemoryRouter>
      <FormularioLogin />
    </MemoryRouter>
  );

  const inputCorreo = screen.getByLabelText(/correo electrónico/i);
  const inputClave = screen.getByLabelText(/contraseña/i);
  const botonIngresar = screen.getByRole("button", { name: /ingresar/i });

  fireEvent.change(inputCorreo, { target: { value: "prueba@admin.cl" } });
  fireEvent.change(inputClave, { target: { value: "1234" } });

  fireEvent.click(botonIngresar);

  const sesionGuardada = localStorage.getItem("nutrivida_usuario_activo");
  expect(sesionGuardada).not.toBeNull();
  expect(JSON.parse(sesionGuardada!)).toMatchObject({
    correo: "prueba@admin.cl",
    rol: "ADMINISTRADOR",
  });
});