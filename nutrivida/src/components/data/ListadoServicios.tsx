import icono1 from '../../assets/images/icono1.jpg';
import icono2 from '../../assets/images/icono2.jpg';
import icono3 from '../../assets/images/icono3.webp';
import carruselNutri from '../../assets/images/carruselNutri.webp';

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

export const LISTADO_SERVICIOS: ServicioNutricional[] = [
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