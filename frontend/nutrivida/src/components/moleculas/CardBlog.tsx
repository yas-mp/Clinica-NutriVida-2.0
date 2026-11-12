import React, { useState } from "react";
import Boton from "../atomos/Boton";

export interface Noticia {
  id: number;
  titulo: string;
  imagen: string;
  descripcionCorta: string;
  descripcionLarga: string;
}

interface CardBlogProps {
  noticia: Noticia;
}

export const CardBlog: React.FC<CardBlogProps> = ({ noticia }) => {
  const [expandido, setExpandido] = useState(false);

  const mostrarMas = () => {
    setExpandido(!expandido);
  };

  return (
    <div className="col">
      <div className="card-blog shadow-sm align-items-center p-3 h-100 bg-white rounded">
        <img
          src={noticia.imagen}
          className="card-img-top img-icono mb-3"
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "20px",
            objectFit: "cover",
          }}
          alt={noticia.titulo}
        />

        <div className="card-body text-center d-flex flex-column w-100 p-0">
          <h5 className="card-title fw-bold mb-2">{noticia.titulo}</h5>
          <p className="card-text text-start fs-6">{noticia.descripcionCorta}</p>

          {expandido && (
            <div className="mt-2 text-start text-secondary fs-6">
              <hr />
              <p style={{ textAlign: "justify" }}>{noticia.descripcionLarga}</p>
            </div>
          )}

          <div className="mt-auto pt-3">
            <Boton
              label={expandido ? "Cerrar" : "Leer más"}
              className="btn btn-success mx-auto"
              onClick={mostrarMas}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardBlog;