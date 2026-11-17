//@vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Pago from "../pages/Pago";
import { registrarPago } from "../services/pagoService";
import type { Pago as PagoDTO } from "../services/pagoService";

vi.mock("../services/pagoService", () => ({
  registrarPago: vi.fn(),
  obtenerMensajeError: (error: unknown) =>
    error instanceof Error && error.message ? error.message : "Error inesperado",
  obtenerUsuarioIdSesion: () => undefined,
}));

const registrarPagoMock = vi.mocked(registrarPago);

const PAGO_RESPUESTA: PagoDTO = {
  id: 1,
  numeroComprobante: "PAY-100001",
  usuarioId: null,
  rutPaciente: "188663338",
  titular: "Diego Rivas",
  correo: "diego@gmail.com",
  idReserva: null,
  idServicio: 1,
  codigoServicio: "CN001",
  servicioNombre: "Primera Consulta Nutricional",
  metodoPago: "Debito",
  ultimos4Digitos: "6512",
  monto: 35000,
  estado: "Aprobado",
  observacion: "Pago registrado en el portal de simulación",
  fechaPago: "2026-11-17",
  fechaCreacion: "2026-11-17T10:15:00",
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

function completarFormulario(numeroTarjeta = "4532019283746512") {
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
    target: { value: numeroTarjeta },
  });
}

test("Debe mostrar un mensaje de validación si el número de tarjeta no tiene 16 dígitos", () => {
  render(
    <MemoryRouter>
      <Pago />
    </MemoryRouter>
  );

  completarFormulario("12345");

  fireEvent.click(screen.getByRole("button", { name: /pagar \$/i }));

  expect(
    screen.getByText(
      "El número de tarjeta debe contener exactamente 16 dígitos numéricos"
    )
  ).toBeTruthy();
  expect(registrarPagoMock).not.toHaveBeenCalled();
});

test("Debe enviar el pago al microservicio y renderizar el comprobante devuelto", async () => {
  registrarPagoMock.mockResolvedValue(PAGO_RESPUESTA);

  render(
    <MemoryRouter>
      <Pago />
    </MemoryRouter>
  );

  completarFormulario();
  fireEvent.change(screen.getByPlaceholderText("08/28"), {
    target: { value: "08/28" },
  });
  fireEvent.change(screen.getByPlaceholderText("123"), {
    target: { value: "321" },
  });

  fireEvent.click(screen.getByRole("button", { name: /pagar \$/i }));

  expect(await screen.findByText("¡Pago realizado con éxito!")).toBeTruthy();
  expect(screen.getByText("Transacción Aprobada")).toBeTruthy();
  expect(screen.getByText("PAY-100001")).toBeTruthy();
  expect(screen.getByText("diego@gmail.com")).toBeTruthy();

  expect(registrarPagoMock).toHaveBeenCalledTimes(1);
  expect(registrarPagoMock).toHaveBeenCalledWith(
    expect.objectContaining({
      rutPaciente: "188663338",
      titular: "Diego Rivas",
      correo: "diego@gmail.com",
      codigoServicio: "CN001",
      servicioNombre: "Primera Consulta Nutricional",
      metodoPago: "Debito",
      ultimos4Digitos: "6512",
      monto: 35000,
      estado: "Aprobado",
    })
  );
});

test("Debe mostrar el mensaje de error devuelto por el microservicio", async () => {
  registrarPagoMock.mockRejectedValue(
    new Error("monto: El monto total debe ser mayor a 0")
  );

  render(
    <MemoryRouter>
      <Pago />
    </MemoryRouter>
  );

  completarFormulario();
  fireEvent.change(screen.getByPlaceholderText("08/28"), {
    target: { value: "08/28" },
  });
  fireEvent.change(screen.getByPlaceholderText("123"), {
    target: { value: "321" },
  });

  fireEvent.click(screen.getByRole("button", { name: /pagar \$/i }));

  expect(
    await screen.findByText("monto: El monto total debe ser mayor a 0")
  ).toBeTruthy();
  expect(screen.queryByText("¡Pago realizado con éxito!")).toBeNull();
});
