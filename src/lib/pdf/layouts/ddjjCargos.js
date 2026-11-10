// Diseño "ddjj-cargos": Declaración Jurada de cargos (Dcto. 94/3 SH — Dcto. 785/14/96), Ministerio de Educación de Tucumán.
// Reproduce los cuadros 1 a 6, el cuadro demostrativo de horarios y las declaraciones.
// Los espacios de certificación (LUGAR/FECHA de cada repartición y la firma del Director) quedan en blanco:
// los completa la autoridad que firma.
import { fechaCorta, fechaLarga } from '../../plantilla.js';
// Logo extraído del formulario oficial en blanco ("Nueva DDJJ en blanco.pdf"). ?inline → data URL para pdfmake.
import logoMinisterio from '../assets/logo-ministerio-educacion-tucuman.jpg?inline';
import { formatearCuil } from '../../validators.js';

const s = (v) => (v === undefined || v === null ? '' : String(v).trim());
const fecha = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(s(v)) ? fechaCorta(v) : s(v));

const lbl = (t) => ({ text: t, fontSize: 7.5 });
const val = (v) => ({ text: s(v) || ' ', bold: true, fontSize: 9.5 });

/** Celda con etiqueta arriba y valor abajo. */
const celda = (label, valor, extra = {}) => ({
  stack: [lbl(label), { ...val(valor), margin: [0, 2, 0, 0] }],
  margin: [2, 2, 2, 3],
  ...extra,
});

/** Bordes: externo grueso, internos finos (como el formulario impreso). */
const recuadro = {
  hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1.6 : 0.6),
  vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length ? 1.6 : 0.6),
};

const numero = (n, rowSpan) => ({ text: String(n), bold: true, fontSize: 10, rowSpan, margin: [0, 4, 0, 0], alignment: 'center' });

function cuadroCargo(n, c = {}) {
  return {
    margin: [0, 0, 0, 8],
    layout: recuadro,
    table: {
      widths: [14, '*', '*'],
      body: [
        [
          numero(n, 4),
          celda('MINISTERIO, SECRETARIA, ETC,', c.ministerio),
          {
            stack: [
              { text: [lbl('CALLE  '), val(c.calle), lbl('     Nº '), val(c.numero)] },
              { text: [lbl('LOCALIDAD  '), val(c.localidad)], margin: [0, 2, 0, 0] },
            ],
            margin: [2, 2, 2, 3],
          },
        ],
        ['', celda('REPARTICION', c.reparticion), celda('CANTIDADES DE HORAS CATEDRAS:\nFUNCIONES QUE DESEMPEÑA', c.funciones)],
        [
          '',
          celda('DEPENDENCIA, OFICINA, ESCUELA', c.dependencia),
          {
            rowSpan: 2,
            margin: [2, 2, 2, 3],
            stack: [
              lbl('Certifico que los datos consignados\nprecedentemente son exactos y correctos.'),
              {
                margin: [0, 26, 0, 0],
                columns: [
                  { text: 'LUGAR', fontSize: 8, alignment: 'center' },
                  { text: 'FECHA', fontSize: 8, alignment: 'center' },
                ],
              },
            ],
          },
        ],
        [
          '',
          {
            margin: [2, 2, 2, 3],
            stack: [
              { text: [lbl('CUMPLE HORARIO (Completo o Reducido)  '), val(c.cumple)] },
              { text: [lbl('De Hs.  '), val(c.hora_desde), lbl('     a  '), val(c.hora_hasta)], margin: [0, 3, 0, 0] },
            ],
          },
          '',
        ],
      ],
    },
  };
}

const titulo = (t, extra = {}) => ({ text: t, bold: true, fontSize: 9.5, alignment: 'center', margin: [0, 2, 0, 6], ...extra });

const DIAS = [
  ['dom', 'Domingo'],
  ['lun', 'Lunes'],
  ['mar', 'Martes'],
  ['mie', 'Miércoles'],
  ['jue', 'Jueves'],
  ['vie', 'Viernes'],
  ['sab', 'Sábado'],
];

const lineaFirma = (texto) => ({
  margin: [0, 34, 0, 0],
  columns: [
    { width: '*', text: '' },
    {
      width: 170,
      stack: [
        { text: '……………………………………………', alignment: 'center' },
        { text: texto, alignment: 'center', fontSize: 9, margin: [0, 2, 0, 0] },
      ],
    },
  ],
});

export function definicionDdjjCargos(v, { titulo: tituloDoc = 'Declaración jurada de cargos' } = {}) {
  const cargos = Array.isArray(v.cargos) ? v.cargos : [];
  const cargo = (i) => cargos[i] ?? {};
  const lugarFecha = [s(v.lugar), /^\d{4}-\d{2}-\d{2}$/.test(s(v.fecha_nota)) ? fechaLarga(v.fecha_nota) : ''].filter(Boolean).join(', ');

  // ---------- Página 1 ----------
  const encabezado = {
    margin: [0, 0, 0, 10],
    columns: [
      {
        width: '*',
        margin: [0, 0, 8, 0],
        stack: [
          { image: logoMinisterio, width: 165, alignment: 'center', margin: [0, 0, 0, 8] },
          { text: 'MINISTERIO DE EDUCACION\nPROVINCIA DE TUCUMAN', bold: true, fontSize: 10, alignment: 'center' },
          {
            text: 'DECLARACION JURADA (Dcto. Nº 94/3 SH)\nde los cargos de actividades que\ndesempeñe el causante\n(Dcto. 785/14/96)',
            fontSize: 8.5,
            alignment: 'center',
            margin: [0, 2, 0, 0],
          },
        ],
      },
      {
        width: 300,
        layout: recuadro,
        table: {
          widths: [14, '*'],
          body: [
            [
              numero(1, 4),
              {
                margin: [2, 3, 2, 3],
                columns: [
                  { text: [lbl('L.C/L.E/'), { text: 'D.N.I.', fontSize: 7.5, bold: true, decoration: 'underline' }, lbl('/C.I. Nº  '), val(v.dni)] },
                  { text: [lbl('C.U.I.L  '), val(formatearCuil(s(v.cuil)))] },
                ],
              },
            ],
            ['', { text: [lbl('Nº I.P.S.S.  '), val(v.ipss)], margin: [2, 3, 2, 3] }],
            ['', celda('En caso de no poseer estos documentos especifique su documentación.', v.otro_documento)],
            ['', { text: [lbl('Fecha de Nacimiento  '), val(fecha(v.fecha_nacimiento))], margin: [2, 3, 2, 3] }],
          ],
        },
      },
    ],
  };

  const cuadro2 = {
    margin: [0, 0, 0, 8],
    layout: recuadro,
    table: {
      widths: [14, '*', '*'],
      body: [
        [
          numero(2),
          {
            margin: [2, 2, 2, 2],
            stack: [lbl('APELLIDO:'), { ...val(v.apellido), margin: [0, 2, 0, 2] }, { text: 'La mujer casada indica primero su apellido de soltera', fontSize: 6 }],
          },
          {
            margin: [2, 2, 2, 2],
            stack: [lbl('NOMBRES:'), { ...val(v.nombre), margin: [0, 2, 0, 2] }, { text: 'Escribir todos los nombres completos', fontSize: 6 }],
          },
        ],
      ],
    },
  };

  const cuadro3 = {
    margin: [0, 0, 0, 10],
    layout: recuadro,
    table: {
      widths: [14, '*', 60, '*'],
      body: [[numero(3), celda('DOMICILIO:', v.domicilio), celda('Nº', v.domicilio_numero), celda('LOCALIDAD:', v.localidad)]],
    },
  };

  // ---------- Página 2 ----------
  const nombreCargo = (c) => [s(c.funciones), s(c.dependencia)].filter(Boolean).join(' — ');
  const filaHorario = (n, c = {}) => [
    { text: n ? String(n) : '', bold: true, fontSize: 9 },
    { text: nombreCargo(c), fontSize: 8 },
    ...DIAS.map(([k]) => ({ text: s(c[k]), fontSize: 8.5, alignment: 'center' })),
  ];

  const cuadroHorarios = {
    margin: [0, 0, 0, 14],
    layout: recuadro,
    table: {
      widths: [10, 90, '*', '*', '*', '*', '*', '*', '*'],
      heights: (row) => (row === 0 ? 16 : 54),
      body: [
        [
          { text: 'CARGO', colSpan: 2, bold: true, fontSize: 9, alignment: 'center', margin: [0, 2, 0, 0] },
          '',
          ...DIAS.map(([, d]) => ({ text: d, bold: true, fontSize: d.length > 7 ? 7.5 : 8.5, alignment: 'center', margin: [0, 2, 0, 0] })),
        ],
        filaHorario(4, cargo(0)),
        filaHorario(5, cargo(1)),
        filaHorario(6, cargo(2)),
        filaHorario(null),
      ],
    },
  };

  const parrafo = (t) => ({ text: t, fontSize: 9, alignment: 'justify', lineHeight: 1.35, leadingIndent: 6 });

  return {
    pageSize: 'A4',
    pageMargins: [36, 30, 36, 30],
    info: { title: tituloDoc },
    defaultStyle: { font: 'Roboto', fontSize: 9, color: '#000000' },
    content: [
      encabezado,
      cuadro2,
      cuadro3,
      titulo('DATOS RELACIONADOS CON LAS FUNCIONES, CARGOS Y OCUPACIONES'),
      cuadroCargo(4, cargo(0)),
      titulo('EN OTRA REPARTICION NACIONAL, PROVINCIAL Y/O MUNICIPAL'),
      cuadroCargo(5, cargo(1)),
      titulo('EN OTRA REPARTICION NACIONAL, PROVINCIAL Y/O MUNICIPAL'),
      cuadroCargo(6, cargo(2)),

      titulo('CUADRO DEMOSTRATIVO DEL CUMPLIMIENTO DE LOS HORARIOS PARA\nLOS CARGOS Y ACTIVIDADES', { pageBreak: 'before', fontSize: 10 }),
      cuadroHorarios,

      { text: [{ text: 'Lugar y Fecha:  ' }, { text: lugarFecha, bold: true }], fontSize: 9, margin: [0, 0, 0, 4] },
      parrafo(
        'Declaro bajo juramento que todos los datos consignados son veraces y exactos de acuerdo a mi leal saber y entender. Asimismo, me notifico que cualquier falsedad, ocultamiento u omisión dará motivo a las mas severas sanciones disciplinarias, como así también que estoy obligado a denunciar dentro de las cuarenta y ocho horas las modificaciones que se produzcan en el futuro.',
      ),
      lineaFirma('Firma del Declarante'),

      { text: 'Lugar y Fecha:', fontSize: 9, margin: [0, 30, 0, 4] },
      parrafo(
        'Certifico la exactitud de las informaciones contenidas en los cuadros 1, 2 y 3 y la autenticidad de la firma que antecede. Manifiesto que no tengo conocimiento que en la presente, el declarante haya incurrido en ninguna falsedad, ocultamiento u omisión.',
      ),
      lineaFirma('Firma del Director'),

      {
        margin: [0, 14, 0, 4],
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 0.6, dash: { length: 3, space: 2 } }],
      },
      { text: 'Para uso de la Dirección de Administración Fecha:\nRecibido por:', fontSize: 8 },
    ],
  };
}
