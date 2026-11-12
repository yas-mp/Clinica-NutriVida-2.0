import React from "react";
import { CardBlog, type Noticia } from "../moleculas/CardBlog";

interface ListaBlogProps {
  noticias: Noticia[];
}
export const ListaBlog: React.FC<ListaBlogProps> = ({ noticias }) => {
  return (
    <div
      id="listarNoticias"
      className="row row-cols-1 row-cols-md-3 g-4 align-items-start mx-auto"
      style={{ maxWidth: "1300px" }}
    >
      {noticias.map((n) => (
        <CardBlog key={n.id} noticia={n} />
      ))}
    </div>
  );
};
export default ListaBlog