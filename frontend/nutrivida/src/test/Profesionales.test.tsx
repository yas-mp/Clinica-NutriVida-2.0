//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profesionales from "../pages/Profesionales";

test("Debe renderizar el listado de profesionales de la clínica", () => {
  render(
    <MemoryRouter>
      <Profesionales />
    </MemoryRouter>
  );

  expect(screen.getByText("Nuestros Profesionales")).toBeTruthy();
  expect(screen.getByText("Carolina Fuentes M.")).toBeTruthy();
  expect(screen.getByText("Rodrigo Sepúlveda A.")).toBeTruthy();
});