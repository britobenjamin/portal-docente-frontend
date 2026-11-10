// API simulada para el modo demostración (VITE_DEMO=true): responde con datos locales sin backend.
// Los datos salen de src/data/demo/ y los PDFs de public/demo/leyes/.
import leyes from '../data/demo/leyes.json';
import categorias from '../data/demo/categorias.json';
import niveles from '../data/demo/niveles.json';

class DemoError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const vigentes = () => leyes.filter((l) => l.estado === 'vigente');

export async function demoApi(path) {
  // Pequeña demora para que se vean los estados de carga como con el servidor real
  await new Promise((r) => setTimeout(r, 250));
  const url = new URL(path, 'http://demo');
  const p = url.pathname;

  if (p === '/leyes') {
    const lista = vigentes();
    return { total: lista.length, leyes: lista };
  }
  const detalle = p.match(/^\/leyes\/([^/]+)$/);
  if (detalle) {
    const ley = vigentes().find((l) => l.slug === decodeURIComponent(detalle[1]));
    if (!ley) throw new DemoError(404, 'No encontramos esa ley.');
    return ley;
  }
  if (p === '/categorias') return categorias;
  if (p === '/niveles') return niveles;
  if (p === '/health') return { ok: true, demo: true };

  throw new DemoError(404, 'Ruta no encontrada');
}
