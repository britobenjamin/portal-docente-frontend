// Carga automáticamente todos los formularios JSON de esta carpeta.
// Para agregar uno nuevo: crear un .json con el mismo formato. No hace falta tocar componentes.
const modulos = import.meta.glob('./*.json', { eager: true, import: 'default' });

export const formularios = Object.values(modulos).sort(
  (a, b) => (a.orden ?? 99) - (b.orden ?? 99) || a.titulo.localeCompare(b.titulo, 'es'),
);

export const obtenerFormulario = (slug) => formularios.find((f) => f.slug === slug) ?? null;
