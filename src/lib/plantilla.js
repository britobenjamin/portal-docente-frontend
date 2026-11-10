// Motor de plantillas de las notas.
//  {{campo}}         → valor del campo (fechas yyyy-mm-dd se muestran dd/mm/aaaa)
//  {{campo|larga}}   → fecha larga: "10 de noviembre de 2026"
//  {{campo|mayus}}   → en mayúsculas
//  **texto**         → negrita
// Un campo vacío se reemplaza por una línea de puntos, como en la nota en papel.

import { formatearCuil } from './validators.js';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const ES_FECHA = /^\d{4}-\d{2}-\d{2}$/;
export const VACIO = '……………………';

export function fechaCorta(iso) {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

export function fechaLarga(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function hoyISO() {
  const h = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${h.getFullYear()}-${p(h.getMonth() + 1)}-${p(h.getDate())}`;
}

function formatear(valor, filtro, nombre) {
  if (valor === undefined || valor === null || String(valor).trim() === '') return VACIO;
  let v = String(valor).trim();
  if (ES_FECHA.test(v)) v = filtro === 'larga' ? fechaLarga(v) : fechaCorta(v);
  else if (nombre === 'cuil') v = formatearCuil(v);
  if (filtro === 'mayus') v = v.toLocaleUpperCase('es-AR');
  return v;
}

/** Reemplaza {{campo}} por su valor formateado. */
export function rellenar(texto, valores) {
  return texto.replace(/\{\{\s*([\w]+)(?:\|(\w+))?\s*\}\}/g, (_, nombre, filtro) =>
    formatear(valores[nombre], filtro, nombre),
  );
}

/**
 * Convierte un texto con **negritas** en segmentos [{text, bold}].
 * Sirve tanto para pdfmake como para la vista previa HTML.
 */
export function segmentos(texto) {
  return texto
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((s) => (s.startsWith('**') && s.endsWith('**') ? { text: s.slice(2, -2), bold: true } : { text: s }));
}

/** Arma la nota completa (ya rellenada) a partir de la plantilla del formulario. */
export function armarNota(plantilla, valores) {
  const r = (t) => segmentos(rellenar(t, valores));
  return {
    lugarFecha: plantilla.lugarFecha ? r(plantilla.lugarFecha) : null,
    destinatario: (plantilla.destinatario ?? []).map(r),
    // Un párrafo puede ser un texto, o { "texto": "...", "si": "campo" } para incluirlo solo si ese campo tiene valor.
    parrafos: (plantilla.parrafos ?? [])
      .filter((p) => typeof p === 'string' || !p.si || String(valores[p.si] ?? '').trim())
      .map((p) => r(typeof p === 'string' ? p : p.texto)),
    firma: (plantilla.firma ?? []).map(r),
  };
}

/** Nombre de archivo: {formulario}_{apellido}_{fecha}.pdf, sin tildes ni espacios. */
export function nombreArchivo(slug, apellido) {
  const limpio = String(apellido || 'docente')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}_${limpio || 'docente'}_${hoyISO()}.pdf`;
}
