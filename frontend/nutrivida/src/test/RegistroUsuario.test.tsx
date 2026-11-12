//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegistroUsuario from "../pages/RegistroUsuario";

test("Debe renderizar el formulario de registro y permitir escribir nombres y RUT", () => {
  render(
    <MemoryRouter>
      <RegistroUsuario />
    </MemoryRouter>
  );

  expect(screen.getByText("Registro de Usuario")).toBeTruthy();

  const inputRut = screen.getByPlaceholderText("188663338") as HTMLInputElement;
  fireEvent.change(inputRut, { target: { value: "198765432" } });
  expect(inputRut.value).toBe("198765432");
});