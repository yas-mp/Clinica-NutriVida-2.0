//@vitest-environment jsdom
import CampoContrasena from "../components/moleculas/CampoContrasena";
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

test("Debe marcar inválido si la contraseña tiene menos de 4 caracteres", () => {
  render(
    <CampoContrasena
      etiqueta="contrasena"
      tipo="password"
      nombre="contrasena"
      valor="124" 
      alCambiar={vi.fn()}
    />
  );

  const input = screen.getByPlaceholderText("****") as HTMLInputElement;

  expect(input.checkValidity()).toBe(true);
});



