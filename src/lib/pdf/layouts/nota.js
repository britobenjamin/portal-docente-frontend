// Diseño "nota": nota oficial con lugar/fecha, destinatario, párrafos y firma. Sin logo.
const CM = 28.35; // puntos por centímetro

/** nota = resultado de armarNota(): { lugarFecha, destinatario[], parrafos[], firma[] } (cada línea = segmentos) */
export function definicionNota(nota, { titulo = 'Nota' } = {}) {
  const content = [];

  if (nota.lugarFecha) {
    content.push({ text: nota.lugarFecha, alignment: 'right', margin: [0, 0, 0, 2.2 * CM] });
  }

  if (nota.destinatario.length) {
    content.push({
      stack: nota.destinatario.map((linea) => ({ text: linea, margin: [0, 0, 0, 6] })),
      margin: [0, 0, 0, 1.6 * CM],
    });
  }

  nota.parrafos.forEach((p) => {
    content.push({ text: p, alignment: 'justify', leadingIndent: 2.5 * CM, lineHeight: 1.5, margin: [0, 0, 0, 10] });
  });

  if (nota.firma.length) {
    content.push({
      margin: [0, 3 * CM, 0, 0],
      columns: [
        { width: '*', text: '' },
        {
          width: 220,
          stack: [
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 220, y2: 0, lineWidth: 0.7 }], margin: [0, 0, 0, 6] },
            ...nota.firma.map((l) => ({ text: l, alignment: 'center', fontSize: 11 })),
          ],
        },
      ],
    });
  }

  return {
    pageSize: 'A4',
    pageMargins: [3 * CM, 2.5 * CM, 2.5 * CM, 2.5 * CM],
    info: { title: titulo },
    defaultStyle: { font: 'Roboto', fontSize: 12, color: '#000000' },
    content,
  };
}
