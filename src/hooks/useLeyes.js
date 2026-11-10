import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useApi } from './useApi.js';

export const FILTROS = ['jurisdiccion', 'tipo', 'categoria', 'nivel', 'anio'];

const quitarPuntos = (s) => String(s).replace(/[.\s]/g, '');

/**
 * Carga todas las leyes vigentes una vez y busca/filtra/ordena en el navegador.
 * El estado de los filtros vive en la URL (?q=&jurisdiccion=...) para poder compartir el link.
 */
export function useLeyes() {
  const { data, error, loading, despertando, reintentar } = useApi('/leyes');
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const orden = params.get('orden') ?? 'recientes';
  const filtros = Object.fromEntries(FILTROS.map((k) => [k, params.get(k) ?? '']));

  const leyes = useMemo(
    () =>
      (data?.leyes ?? []).map((l) => ({
        ...l,
        _numeroPlano: quitarPuntos(l.numero),
        _categorias: l.categorias.map((c) => c.nombre).join(' '),
      })),
    [data],
  );

  const fuse = useMemo(
    () =>
      new Fuse(leyes, {
        keys: [
          { name: 'numero', weight: 3 },
          { name: '_numeroPlano', weight: 3 },
          { name: 'titulo', weight: 3 },
          { name: 'palabras_clave', weight: 2 },
          { name: '_categorias', weight: 1.5 },
          { name: 'resumen', weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        ignoreDiacritics: true, // "jubilacion" encuentra "jubilación"
        minMatchCharLength: 2,
      }),
    [leyes],
  );

  const resultados = useMemo(() => {
    const texto = q.trim();
    let lista = texto ? fuse.search(texto).map((r) => r.item) : [...leyes];

    lista = lista.filter(
      (l) =>
        (!filtros.jurisdiccion || l.jurisdiccion === filtros.jurisdiccion) &&
        (!filtros.tipo || l.tipo === filtros.tipo) &&
        (!filtros.anio || String(l.anio) === filtros.anio) &&
        (!filtros.categoria || l.categorias.some((c) => String(c.id) === filtros.categoria)) &&
        (!filtros.nivel || l.niveles.some((n) => String(n.id) === filtros.nivel)),
    );

    // Con texto de búsqueda y orden por defecto, se respeta la relevancia de Fuse.
    if (!(texto && orden === 'recientes')) {
      const cmp = {
        recientes: (a, b) => b.anio - a.anio || a.titulo.localeCompare(b.titulo, 'es'),
        numero: (a, b) => a._numeroPlano.localeCompare(b._numeroPlano, 'es', { numeric: true }),
        alfabetico: (a, b) => a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }),
      }[orden];
      if (cmp) lista.sort(cmp);
    }
    return lista;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuse, leyes, q, orden, ...FILTROS.map((k) => filtros[k])]);

  const anios = useMemo(() => [...new Set(leyes.map((l) => l.anio))].sort((a, b) => b - a), [leyes]);

  const setParam = (key, value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const limpiarFiltros = () =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        FILTROS.forEach((k) => next.delete(k));
        return next;
      },
      { replace: true },
    );

  /** Saca filtros y texto de búsqueda (conserva el orden). */
  const limpiarTodo = () =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        [...FILTROS, 'q'].forEach((k) => next.delete(k));
        return next;
      },
      { replace: true },
    );

  const filtrosActivos = FILTROS.filter((k) => filtros[k]).length;

  return {
    loading,
    error,
    despertando,
    reintentar,
    total: leyes.length,
    resultados,
    anios,
    q,
    orden,
    filtros,
    filtrosActivos,
    setParam,
    limpiarFiltros,
    limpiarTodo,
  };
}
