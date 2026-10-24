// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TablaReservasAdmin, TablaServiciosAdmin, TablaUsuariosAdmin } from "../components/organismos/TablasVistaAdmin";

test("La tabla de administrador debe renderizar los datos y responder a las acciones CRUD", () => {
  const mockEliminar = vi.fn();
  const usuarios = [{ rut: "123", nombre: "Juan", correo: "a@a.com" }];

  render(
    <TablaUsuariosAdmin
      listaUsuarios={usuarios}
      onCambiarRol={vi.fn()}
      onEliminarUsuario={mockEliminar}
      onModificarUsuario={vi.fn()}
    />
  );

  expect(screen.getByText("Juan")).toBeDefined();
  
  const botonesEliminar = screen.getAllByRole("button", { name: /eliminar/i });
  fireEvent.click(botonesEliminar[0]);

  expect(mockEliminar).toHaveBeenCalledWith(0);
});

test("TablaReservasAdmin renderiza reservas y permite cancelar", () => {
  const cancelar = vi.fn();
  const reservas = [{ rut: "123", servicio: "Nutrición", fecha: "2026-03-30", hora: "15:00" }];

  render(
    <TablaReservasAdmin
      listaReservas={reservas}
      onCancelarReserva={cancelar}
    />
  );

  expect(screen.getByText("Nutrición")).toBeDefined();

  const botonesCancelar = screen.getAllByRole("button", { name: /cancelar/i });
  fireEvent.click(botonesCancelar[0]);

  expect(cancelar).toHaveBeenCalledWith(0);
});

test("TablaServiciosAdmin renderiza servicios y ejecuta eliminación por ID", () => {
  const eliminar = vi.fn();
  const servicios = [{ id: 99, codigo: "S1", nombre: "Consulta", precio: 20000 }];

  render(
    <TablaServiciosAdmin
      servicios={servicios}
      onEliminarServicio={eliminar}
      onModificarServicio={vi.fn()}
    />
  );

  expect(screen.getByText("Consulta")).toBeDefined();

  const botonesEliminar = screen.getAllByRole("button", { name: /eliminar/i });
  fireEvent.click(botonesEliminar[botonesEliminar.length - 1]);
  expect(eliminar).toHaveBeenCalledWith(99);
});