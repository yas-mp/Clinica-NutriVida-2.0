//@vitest-environment jsdom
import { test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Pago from "../pages/Pago";

beforeEach(() => {
  localStorage.clear();
});

test("Debe mostrar un mensaje de validación si el número de tarjeta no tiene 16 dígitos", () => {
  render(
    <MemoryRouter>
      <Pago />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText("Ej: Diego Rivas"), {
    target: { value: "Diego Rivas" },
  });
  fireEvent.change(screen.getByPlaceholderText("188663338"), {
    target: { value: "188663338" },
  });
  fireEvent.change(screen.getByPlaceholderText("cliente@ejemplo.com"), {
    target: { value: "diego@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("4532019283746512"), {
    target: { value: "12345" },
  });

  const botonPagar = screen.getByText(/Pagar \$/i);
  fireEvent.click(botonPagar);

  expect(
    screen.getByText(
      "El número de tarjeta debe contener exactamente 16 dígitos numéricos"
    )
  ).toBeTruthy();
});

test("Debe procesar el pago y renderizar el comprobante cuando todos los campos son válidos", () => {
  render(
    <MemoryRouter>
      <Pago />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText("Ej: Diego Rivas"), {
    target: { value: "Diego Rivas" },
  });
  fireEvent.change(screen.getByPlaceholderText("188663338"), {
    target: { value: "188663338" },
  });
  fireEvent.change(screen.getByPlaceholderText("cliente@ejemplo.com"), {
    target: { value: "diego@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("4532019283746512"), {
    target: { value: "4532019283746512" },
  });
  fireEvent.change(screen.getByPlaceholderText("08/28"), {
    target: { value: "08/28" },
  });
  fireEvent.change(screen.getByPlaceholderText("123"), {
    target: { value: "321" },
  });

  const botonPagar = screen.getByText(/Pagar \$/i);
  fireEvent.click(botonPagar);

  expect(screen.getByText("¡Pago realizado con éxito!")).toBeTruthy();
  expect(screen.getByText("Transacción Aprobada")).toBeTruthy();
  expect(screen.getByText("diego@gmail.com")).toBeTruthy();
});