//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/organismos/Navbar";

test("Debe renderizar la barra de navegación con los enlaces principales", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText(/NutriVida/i)).toBeTruthy();
  expect(screen.getByText("Profesionales")).toBeTruthy();
  expect(screen.getByText("Servicios")).toBeTruthy();
});