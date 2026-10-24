//@vitest-environment jsdom
import { test, expect, vi} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CampoCorreo from "../components/moleculas/CampoCorreo";

test("Debe poder ingresar un correo", () => {
    const onAlcambiar = vi.fn();

    render(<CampoCorreo 
        etiqueta="correo"
        tipo="email"
        nombre="correo"
        valor=""
        alCambiar={onAlcambiar}/>)

        const input = screen.getByRole("textbox")
        fireEvent.change(input, {target: {value: 'yasna@gmail.com'}})

        expect(onAlcambiar).toHaveBeenCalled()

})