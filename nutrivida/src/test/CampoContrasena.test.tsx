//@vitest-environment jsdom
import CampoContrasena from "../components/moleculas/CampoContrasena";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

test("Debe permitir escribir una contrasena", () => {

    const onAlCambiar = vi.fn();

    render(<CampoContrasena
    etiqueta="contrasena"
    tipo="password"
    nombre="contrasena"
    valor=""
    alCambiar={onAlCambiar}/>);
    const input = screen.getByPlaceholderText("****");
    fireEvent.change(input, {target: {value: '1234'}});
    
    expect(onAlCambiar).toHaveBeenCalled()
})




/* npm install -D @testing-library/react @testing-library/jest-dom jsdom*/