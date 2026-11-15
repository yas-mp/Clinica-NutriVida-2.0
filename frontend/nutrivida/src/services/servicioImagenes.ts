import imagenPorDefecto from '../assets/images/nutricionista.jpg';

/**
 * El backend guarda rutas relativas del estilo `../images/primera-consulta.jpg`
 * (ver V1__crear_tablas_servicios.sql). Esas rutas no existen en el bundle de
 * Vite, por lo que se resuelven al asset real importado desde `src/assets/images`.
 */
const imagenesImportadas = import.meta.glob('../assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

function normalizarNombre(nombre: string): string {
  try {
    return decodeURIComponent(nombre).trim().toLowerCase();
  } catch {
    return nombre.trim().toLowerCase();
  }
}

const imagenesPorArchivo = new Map<string, string>();

Object.entries(imagenesImportadas).forEach(([ruta, url]) => {
  const archivo = ruta.split('/').pop();
  if (archivo && typeof url === 'string') {
    imagenesPorArchivo.set(normalizarNombre(archivo), url);
  }
});

export { imagenPorDefecto };

/**
 * Devuelve una URL utilizable en el navegador para la imagen de un servicio.
 * - Respeta URLs absolutas (`http`, `data`, `blob`) y rutas públicas (`/...`).
 * - Para rutas del backend busca el archivo por nombre en los assets locales.
 * - Si no lo encuentra, entrega una imagen por defecto.
 */
export function resolverImagenServicio(imagen?: string | null): string {
  const valor = (imagen ?? '').trim();
  if (!valor) {
    return imagenPorDefecto;
  }

  if (/^(https?:|data:|blob:)/i.test(valor) || valor.startsWith('/')) {
    return valor;
  }

  const archivo = valor
    .replace(/\\/g, '/')
    .split('/')
    .filter((segmento) => segmento !== '' && segmento !== '.' && segmento !== '..')
    .pop();

  if (!archivo) {
    return imagenPorDefecto;
  }

  return imagenesPorArchivo.get(normalizarNombre(archivo)) ?? imagenPorDefecto;
}
