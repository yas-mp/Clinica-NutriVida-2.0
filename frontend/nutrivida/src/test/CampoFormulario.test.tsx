// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CampoFormulario from "../components/moleculas/CampoFormulario";

test("Debe permitir escribir en el campo de formulario", () => {
  const onAlcambiar = vi.fn();

  render(
    <CampoFormulario
      etiqueta="Nombre completo"
      tipo="text"
      nombre="nombre"
      placeholder="Juan Pérez"
      valor=""
      maxLength={100}
      alCambiar={onAlcambiar}
    />
  );

  const input = screen.getByLabelText(/nombre completo/i);
  fireEvent.change(input, { target: { value: "Yasna" } });

  expect(onAlcambiar).toHaveBeenCalled();
});