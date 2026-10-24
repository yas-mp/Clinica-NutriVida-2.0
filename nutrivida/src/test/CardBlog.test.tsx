//@vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImagenBlog3 from "../assets/images/vitaminas-blog.jpg"
import CardBlog from "../components/moleculas/CardBlog";
import { MemoryRouter } from "react-router-dom";

test("Debe renderizar la tarjeta blog con titulo, descripcion e imagen", () => {
    const DatosPruebaNoticia = {
        id: 1,
        titulo: "Alimentacion saludable",
        imagen: ImagenBlog3,
        descripcionCorta: "Alimentacion es nutritiva",
        descripcionLarga: "Alimentacion es muy nutritiva y nos ayuda a poder nutrir nuestro cuerpo"
    }
  
    render(
        <MemoryRouter>
            <CardBlog
            noticia={DatosPruebaNoticia}/>
        </MemoryRouter>
    );
    expect(screen.getByText("Alimentacion saludable")).toBeTruthy
    expect(screen.getByText("Alimentacion es nutritiva")).toBeTruthy

    const botonLeerMas = screen.getByText(/leer más/i)
    fireEvent.click(botonLeerMas)

    expect(screen.getByText("Alimentacion es muy nutritiva y nos ayuda a poder nutrir nuestro cuerpo")).toBeTruthy
})

