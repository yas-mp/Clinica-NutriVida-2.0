//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CardDetalleServicios from "../components/moleculas/CardDetalleServicios";
import { LISTADO_SERVICIOS } from "../components/data/ListadoServicios";

test("Debe renderizar la molécula CardDetalleServicios con los datos del servicio", () => {
  const servicioPrueba = LISTADO_SERVICIOS[0];

  render(
    <MemoryRouter>
      <CardDetalleServicios servicio={servicioPrueba} />
    </MemoryRouter>
  );

  expect(screen.getByText(servicioPrueba.nombre)).toBeTruthy();
  expect(screen.getByText(servicioPrueba.codigo)).toBeTruthy();
  expect(screen.getByText(servicioPrueba.profesional)).toBeTruthy();
});