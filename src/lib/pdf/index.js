// Generación de PDFs de formularios en el navegador (pdfmake).
// Cada formulario indica su diseño con "layout" en el JSON: "nota" (por defecto) o un diseño propio.
// pdfmake se carga recién cuando hace falta (import dinámico) para no engordar el resto del sitio.
import { armarNota } from '../plantilla.js';
import { definicionNota } from './layouts/nota.js';
import { definicionDdjjCargos } from './layouts/ddjjCargos.js';

const LAYOUTS = {
  nota: (form, valores) => definicionNota(armarNota(form.plantilla, valores), { titulo: form.titulo }),
  'ddjj-cargos': (form, valores) => definicionDdjjCargos(valores, { titulo: form.titulo }),
};

export const layoutDe = (form) => form.layout ?? 'nota';

let pdfMakePromise;
function cargarPdfMake() {
  pdfMakePromise ||= Promise.all([import('pdfmake/build/pdfmake'), import('pdfmake/build/vfs_fonts')]).then(
    ([pm, vfs]) => {
      const pdfMake = pm.default ?? pm;
      pdfMake.addVirtualFileSystem(vfs.default ?? vfs);
      return pdfMake;
    },
  );
  return pdfMakePromise;
}

export function definicionPdf(form, valores) {
  const fn = LAYOUTS[layoutDe(form)];
  if (!fn) throw new Error(`Diseño de PDF desconocido: ${form.layout}`);
  return fn(form, valores);
}

export async function pdfBlob(form, valores) {
  const pdfMake = await cargarPdfMake();
  return pdfMake.createPdf(definicionPdf(form, valores)).getBlob();
}

export async function descargarPdf(form, valores, nombre) {
  const blob = await pdfBlob(form, valores);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
