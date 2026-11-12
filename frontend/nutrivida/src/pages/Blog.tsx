import React, { useState } from "react";
import { ListaBlog } from "../components/organismos/ListaBlog";
import type { Noticia } from "../components/moleculas/CardBlog";
import ImagenBlog1 from "../assets/images/menu-semanal-blog.jpg"
import ImagenBlog2 from "../assets/images/comida-blog.jpg"
import ImagenBlog3 from "../assets/images/vitaminas-blog.jpg"

export const Blog: React.FC = () => {
  const [noticias] = useState<Noticia[]>([
    {
      id: 1,
      titulo: "¿Qué es el colesterol?",
      imagen: ImagenBlog1,
      descripcionCorta: `No es casualidad que todo el mundo haya oído hablar del colesterol alto (hipercolesterolemia), 
        dado que es un problema frecuente entre la población y que genera un mayor 
        riesgo de sufrir enfermedades cardiovasculares (ECV).`,
      descripcionLarga: `El colesterol es una molécula lipídica (grasa) presente en 
        el organismo como parte de membranas, tejidos y también en la sangre. 
        Eso hace que el colesterol sea necesario para la formación de vitaminas, 
        hormonas y ácidos biliares entre otras cosas. Por tanto, el colesterol es necesario, 
        siempre y esencial para la salud, pero si se superan sus valores óptimos es cuando aumenta 
        el riesgo de ECV. Dicho esto, debemos tener en cuenta que el colesterol es producido 
        por nuestro cuerpo pero también lo obtenemos a través de la alimentación y cuando se 
        acumula gran cantidad en las arterias por un exceso en plasma, entonces se dificulta 
        la circulación sanguínea y aparecen los riesgos cardiovasculares.`,
    },
    {
      id: 2,
      titulo: "¿Cómo controlar la ansiedad al comer?",
      imagen: ImagenBlog2,
      descripcionCorta: `Comer es un acto biológico necesario, pero también una conducta cargada de significado emocional, 
        social y cultural. Sin embargo, cuando la ingesta deja de estar guiada por el hambre...`,
      descripcionLarga: `El tratamiento debe ser integral y adaptado a cada persona. No basta con prescribir una dieta. 
        Sin duda, la terapia cognitivo-conductual (TCC) es uno de los enfoques con mayor evidencia científica. 
        Permite identificar detonantes emocionales, modificar pensamientos disfuncionales relacionados con la comida
        y el cuerpo, desarrollar habilidades de regulación emocional, etc.
        Otras terapias como la terapia de aceptación y compromiso (ACT) o el 
        mindfulness ayudan a tolerar el malestar sin recurrir a la comida.
        En lo referente a la intervención nutricional, el objetivo no es prohibir, sino estructurar. 
        Por ejemplo: establecer horarios regulares de comida, evitar restricciones extremas, reintroducir 
        todos los grupos de alimentos de forma equilibrada, etc.
        También resulta interesante realizar una evaluación médica, ya que en algunos casos pueden 
        existir comorbilidades como obesidad, síndrome metabólico, 
        depresión o ansiedad clínica que requieren abordaje específico.`,
    },
    {
      id: 3,
      titulo: "Vitamina para vegetarianos y veganos",
      imagen: ImagenBlog3,
      descripcionCorta: `Seguir un patrón de alimentación vegano o vegetariano ofrece numerosos beneficios: 
        menor riesgo de enfermedad cardiovascular, 
        menor prevalencia de diabetes y mayor ingesta de fibra...`,
      descripcionLarga: `En las dietas vegetarianas o veganas, si no hay malabsorción y la dieta no es restrictiva, 
        sino variada y equilibrada, no haría falta suplementar con ninguna vitamina salvo con B12.
        Eso sí, al igual que en las dietas omnívoras, los valores de vitamina D en las analíticas suelen estar reducidos, 
        por lo que el profesional de la salud deberá valorar su suplementación (aunque eso no debe desplazar a la exposición solar de manera saludable).
        Salvo en estos dos casos, el resto de las vitaminas pueden obtenerse fácilmente a través de la 
        alimentación y por tanto no es necesaria su suplementación. Recordemos que la suplementación 
        no debe desplazar a los alimentos que siempre serán nuestra primera opción.
        Finalmente, aclarar que para que estas pautas puedan adaptarse a cada caso es recomendable 
        trabajar de la mano de un nutricionista que te ayude a personalizar tu alimentación y 
        suplementación (en caso de ser necesaria) a tu estilo de vida, necesidades y gustos. 
        Podría interesarte este artículo: alimentos ricos en proteína vegetal.`,
    },
  ]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <main className="flex-grow-1 py-4">
        <section className="section-blog container">
          <h3 className="titulo-blog text-center mb-4 fw-bold">
            Blog - Nutrición
          </h3>
          <ListaBlog noticias={noticias} />
        </section>
      </main>
    </div>
  );
};
export default Blog;