export interface Profesional {
  codigo: string;
  nombre: string;
  apellidos: string;
  especialidad: string;
  correo: string;
  clave: string;
  rol: 'NUTRICIONISTA' | 'PACIENTE' | 'ADMIN';
  rut?: string;
}

export const LISTADO_PROFESIONALES: Profesional[] = [
  {
    codigo: 'NUT001',
    rut: '15432987K',
    nombre: 'Nut. Carolina',
    apellidos: 'Fuentes M.',
    especialidad: 'Obesidad y síndrome metabólico',
    correo: 'cfuentes@nutrivida.cl',
    clave: '1234',
    rol: 'NUTRICIONISTA',
  },
  {
    codigo: 'NUT002',
    rut: '16789432K',
    nombre: 'Nut. Rodrigo',
    apellidos: 'Sepúlveda A.',
    especialidad: 'Nutrición deportiva y rendimiento',
    correo: 'rsepulveda@nutrivida.cl',
    clave: '1234',
    rol: 'NUTRICIONISTA',
  },
  {
    codigo: 'NUT003',
    rut: '17890123K',
    nombre: 'Nut. Daniela',
    apellidos: 'Morales C.',
    especialidad: 'Alimentación vegetariana, vegana y trastornos alimentarios',
    correo: 'dmorales@nutrivida.cl',
    clave: '1234',
    rol: 'NUTRICIONISTA',
  },
  {
    codigo: 'NUT004',
    rut: '14567890K',
    nombre: 'Nut. Felipe',
    apellidos: 'Araya R.',
    especialidad: 'Nutrición pediátrica',
    correo: 'faraya@nutrivida.cl',
    clave: '1234',
    rol: 'NUTRICIONISTA',
  },
];