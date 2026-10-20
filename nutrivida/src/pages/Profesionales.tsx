import React from 'react';
import { useNavigate } from 'react-router-dom';

import icono1 from '../assets/images/icono1.jpg';
import icono2 from '../assets/images/icono2.jpg';
import icono3 from '../assets/images/icono3.webp';
import carruselNutri from '../assets/images/carruselNutri.webp';

export interface Profesional {
  id: number;
  nombre: string;
  especialidad: string;
  perfil: string;
  modalidad: 'Presencial' | 'Online' | 'Presencial y Online';
  horario: string;
  imagen: string;
}

export const LISTA_PROFESIONALES: Profesional[] = [
  {
    id: 1,
    nombre: 'Carolina Fuentes M.',
    especialidad: 'Obesidad y Síndrome Metabólico',
    perfil:
      'Especialista en el tratamiento integral del exceso de peso, resistencia a la insulina y enfermedades metabólicas. Enfoque centrado en la reeducación alimentaria.',
    modalidad: 'Presencial y Online',
    horario: 'Lunes a Jueves 09:00 - 14:00',
    imagen: icono1,
  },
  {
    id: 2,
    nombre: 'Rodrigo Sepúlveda A.',
    especialidad: 'Nutrición Deportiva y Rendimiento',
    perfil:
      'Enfocado en la optimización de la composición corporal, planificación nutricional para deportistas de alto rendimiento y suplementación basada en evidencia científica.',
    modalidad: 'Presencial y Online',
    horario: 'Martes a Viernes 14:00 - 19:30',
    imagen: icono2,
  },
  {
    id: 3,
    nombre: 'Daniela Morales C.',
    especialidad: 'Alimentación Vegetariana/Vegana y Trastornos Alimentarios',
    perfil:
      'Acompañamiento en transiciones hacia dietas basadas en plantas de forma segura y nutricionalmente completa. Abordaje de la relación con la comida desde un enfoque compasivo.',
    modalidad: 'Online',
    horario: 'Lunes, Miércoles y Viernes 10:00 - 16:00',
    imagen: icono3,
  },
  {
    id: 4,
    nombre: 'Felipe Araya R.',
    especialidad: 'Nutrición Infantil y Familiar',
    perfil:
      'Experto en alimentación infantil, lactancia, introducción alimentaria y selectividad alimentaria en niños. Evaluación del crecimiento y estado nutricional familiar.',
    modalidad: 'Presencial',
    horario: 'Lunes a Viernes 09:00 - 13:00',
    imagen: carruselNutri,
  },
];

const Profesionales: React.FC = () => {
  const navigate = useNavigate();

  const handleReservarConProfesional = (nombreProfesional: string) => {
    navigate('/reservas-horas', { state: { profesionalPreseleccionado: nombreProfesional } });
  };

  return (
    <main className="container my-5">
      <div className="text-center mb-5">
        <span className="nv-badge-subtitle">Equipo Médico en Temuco y Online</span>
        <h1 className="nv-title">Nuestros Profesionales</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
          Contamos con nutricionistas especializados en distintas áreas clínicas y deportivas para
          acompañarte con planes personalizados y seguimiento continuo.
        </p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {LISTA_PROFESIONALES.map((prof) => (
          <div className="col" key={prof.id}>
            <article className="card nv-card-profesional h-100">
              <div className="card-body d-flex flex-column p-4">
                <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-3">
                  <img
                    src={prof.imagen}
                    alt={prof.nombre}
                    className="nv-avatar-profesional"
                  />
                  <div className="text-center text-sm-start">
                    <span className="badge nv-badge-modalidad mb-2">{prof.modalidad}</span>
                    <h4 className="card-title text-sm-start fw-bold mb-1">
                      {prof.nombre}
                    </h4>
                    <p className="nv-especialidad-text mb-0">{prof.especialidad}</p>
                  </div>
                </div>

                <p className="card-text flex-grow-1 mt-2">{prof.perfil}</p>

                <div className="nv-horario-box p-3 rounded-3 mb-3">
                  <small className="d-block text-uppercase fw-bold text-muted">
                    Horario de atención
                  </small>
                  <span className="fw-semibold text-dark">{prof.horario}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleReservarConProfesional(prof.nombre)}
                  className="btn nv-btn-primary w-100 mt-auto"
                >
                  Reservar Hora
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Profesionales;