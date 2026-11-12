//@vitest-environment jsdom
import { test, expect, vi} from "vitest";
import { render, screen } from "@testing-library/react";
import CampoCorreo from "../components/moleculas/CampoCorreo";

test("Debe marcar el campo como valido si el correo tiene el formato de correo: example@gmail.com", () => {
  render(
    <CampoCorreo 
      etiqueta="correo"
      tipo="email"
      nombre="correo"
      valor="yasna@gmail.com" 
      alCambiar={vi.fn()}
    />
  );

  const input = screen.getByRole("textbox") as HTMLInputElement;

  expect(input.checkValidity()).toBe(true);
});