// @vitest-environment jsdom
import { test, expect, vi,beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormularioContacto from "../components/organismos/FormularioContacto";

const alertas = vi.spyOn(window, "alert").mockImplementation(() => {});

beforeEach(() =>{
    alertas.mockClear();
});

test("Debe mostrar alerta de formulario enviado si todos los campos son validos", () => {
    render(<FormularioContacto/>)

    const inputNombre = screen.getByLabelText(/nombre completo/i);
    const inputCorreo = screen.getByLabelText(/correo/i);
    const inputComentarios = screen.getByLabelText(/comentarios/i)
    const botonEnviar = screen.getByRole("button",  {name: /enviar formulario/i});

    fireEvent.change(inputNombre, {target: {value: "Yasna Mora"}});
    fireEvent.change(inputCorreo,{target: {value: "yasna@gmail.com"}});
    fireEvent.change(inputComentarios, {target: {value: "Tengo dudas acerca de como reservar una hora"}});

    fireEvent.click(botonEnviar);
    expect(alertas).toHaveBeenCalledWith("Formulario enviado correctamente");
});

