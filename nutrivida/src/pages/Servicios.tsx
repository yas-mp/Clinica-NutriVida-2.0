import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import icono1 from '../assets/images/icono1.jpg';
import icono2 from '../assets/images/icono2.jpg';
import icono3 from '../assets/images/icono3.webp';
import carruselNutri from '../assets/images/carruselNutri.webp';

export interface ServicioNutricional {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  duracion: string;
  modalidad: string;
  profesional: string;
  precio: number;
  imagen: string;
}

export const CATALOGO_SERVICIOS: ServicioNutricional[] = [
  {
    id: 1,
    codigo: 'NV-001',
    nombre: 'Control de Peso y Enfermedades Metabólicas',
    categoria: 'Clínica Adulto',
    descripcion:
      'Evaluación integral para el manejo de sobrepeso, obesidad, resistencia a la insulina y síndrome metabólico. Incluye antropometría completa y pauta digital personalizada.',
    duracion: '45 minutos',
    modalidad: 'Presencial y Online',
    profesional: 'Carolina Fuentes M.',
    precio: 28000,
    imagen: icono1,
  },
  {
    id: 2,
    codigo: 'NV-002',
    nombre: 'Asesoría en Nutrición Deportiva',
    categoria: 'Deporte',
    descripcion:
      'Planificación nutricional enfocada en la optimización de la composición corporal, rendimiento físico y suplementación deportiva basada en evidencia científica.',
    duracion: '60 minutos',
    modalidad: 'Presencial y Online',
    profesional: 'Rodrigo Sepúlveda A.',
    precio: 32000,
    imagen: icono2,
  },
  {
    id: 3,
    codigo: 'NV-003',
    nombre: 'Transición y Control Vegetariano / Vegano',
    categoria: 'Plant-Based',
    descripcion:
      'Acompañamiento hacia dietas basadas en plantas de forma segura y nutricionalmente completa, previniendo déficits de vitamina B12, hierro, calcio y proteínas.',
    duracion: '45 minutos',
    modalidad: 'Online',
    profesional: 'Daniela Morales C.',
    precio: 28000,
    imagen: icono3,
  },
  {
    id: 4,
    codigo: 'NV-004',
    nombre: 'Nutrición Infantil y Familiar',
    categoria: 'Pediátrica',
    descripcion:
      'Evaluación del crecimiento infantil, lactancia, introducción alimentaria y manejo de selectividad alimentaria en niños con enfoque familiar.',
    duracion: '45 minutos',
    modalidad: 'Presencial',
    profesional: 'Felipe Araya R.',
    precio: 26000,
    imagen: carruselNutri,
  },
  {
    id: 5,
    codigo: 'NV-005',
    nombre: 'Sesión de Seguimiento Quincenal / Mensual',
    categoria: 'Seguimiento',
    descripcion:
      'Control periódico para registrar peso, talla y circunferencia de cintura en tu ficha digital, evaluando avances y ajustando tu plan alimenticio.',
    duracion: '30 minutos',
    modalidad: 'Presencial y Online',
    profesional: 'Equipo NutriVida',
    precio: 20000,
    imagen: icono1,
  },
];

const Servicios: React.FC = () => {
  const navigate = useNavigate();
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioNutricional | null>(null);

  const formatearPrecio = (valor: number) =>
    valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  return (
    <div className="servicios">
      {!servicioSeleccionado ? (
        <main className="container my-5">
          <div className="text-center mb-4">
            <h1 className="fw-bold" style={{ borderBottom: '3px solid #2a492a', paddingBottom: '12px' }}>
              Nuestros Servicios
            </h1>
            <p className="text-muted">Conoce los planes y consultas que tenemos para ti</p>
          </div>

          <div id="listaServicios" className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {CATALOGO_SERVICIOS.map((serv) => (
              <div className="col" key={serv.id}>
                <article className="card-servicio">
                  <div>
                    <img src={serv.imagen} alt={serv.nombre} />
                    <span className="badge-tipo d-inline-block">{serv.categoria}</span>
                    <h3>{serv.nombre}</h3>
                    <p className="text-muted small mb-3">{serv.descripcion}</p>
                  </div>
                  <div>
                    <div className="precio">{formatearPrecio(serv.precio)}</div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn-detalle"
                        onClick={() => setServicioSeleccionado(serv)}
                      >
                        Ver Detalle
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-success w-100 fw-semibold"
                        style={{ borderRadius: '10px' }}
                        onClick={() =>
                          navigate('/reservas-horas', {
                            state: {
                              servicioPreseleccionado: serv.nombre,
                              profesionalPreseleccionado:
                                serv.profesional !== 'Equipo NutriVida' ? serv.profesional : '',
                            },
                          })
                        }
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="detalle-servicio container my-4">
          <h1>Detalle del Servicio</h1>
          <img id="imagen" src={servicioSeleccionado.imagen} alt={servicioSeleccionado.nombre} />
          <h2 id="nombre">{servicioSeleccionado.nombre}</h2>
          <p id="descripcion">{servicioSeleccionado.descripcion}</p>
          <p id="codigo">
            <strong>Código:</strong> <span>{servicioSeleccionado.codigo}</span>
          </p>
          <p id="tipo">
            <strong>Categoría:</strong> <span>{servicioSeleccionado.categoria}</span>
          </p>
          <p id="duracion">
            <strong>Duración de la sesión:</strong> <span>{servicioSeleccionado.duracion}</span>
          </p>
          <p id="modalidad">
            <strong>Modalidad:</strong> <span>{servicioSeleccionado.modalidad}</span>
          </p>
          <p id="profesional">
            <strong>Especialista a cargo:</strong> <span>{servicioSeleccionado.profesional}</span>
          </p>
          <div id="precio">Valor: {formatearPrecio(servicioSeleccionado.precio)}</div>

          <div
            className="d-flex justify-content-center gap-3 mb-5 mx-auto"
            style={{ maxWidth: '700px', width: '100%' }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2 fw-semibold"
              onClick={() => setServicioSeleccionado(null)}
            >
              ← Volver a Servicios
            </button>
            <button
              type="button"
              className="nv-btn-primary px-4 py-2"
              onClick={() =>
                navigate('/reservas-horas', {
                  state: {
                    servicioPreseleccionado: servicioSeleccionado.nombre,
                    profesionalPreseleccionado:
                      servicioSeleccionado.profesional !== 'Equipo NutriVida'
                        ? servicioSeleccionado.profesional
                        : '',
                  },
                })
              }
            >
              Reservar este Servicio
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default Servicios;