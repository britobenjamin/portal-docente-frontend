export const JURISDICCIONES = [
  { value: 'provincial', label: 'Tucumán' },
  { value: 'nacional', label: 'Nacional' },
];

export const TIPOS = [
  { value: 'ley', label: 'Ley' },
  { value: 'decreto', label: 'Decreto' },
  { value: 'resolucion', label: 'Resolución' },
  { value: 'estatuto', label: 'Estatuto' },
];

export const ORDENES = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'numero', label: 'Número' },
  { value: 'alfabetico', label: 'Alfabético (A-Z)' },
];

export const jurisdiccionLabel = (v) => JURISDICCIONES.find((j) => j.value === v)?.label ?? v;
export const tipoLabel = (v) => TIPOS.find((t) => t.value === v)?.label ?? v;

/** "Ley N° 1002", "Decreto N° 2001/3" */
export const nombreNorma = (ley) => `${tipoLabel(ley.tipo)} N° ${ley.numero}`;
