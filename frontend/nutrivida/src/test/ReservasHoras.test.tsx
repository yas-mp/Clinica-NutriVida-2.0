//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ReservasHoras from "../pages/ReservasHoras";

test("Debe renderizar el formulario de reserva de horas y permitir ingresar el RUT", () => {
  render(
    <MemoryRouter>
      <ReservasHoras />
    </MemoryRouter>
  );

  expect(screen.getByText("Agendar Hora")).toBeTruthy();

  const inputRut = screen.getByPlaceholderText("12345678K") as HTMLInputElement;
  fireEvent.change(inputRut, { target: { value: "188663338" } });
  expect(inputRut.value).toBe("188663338");
});