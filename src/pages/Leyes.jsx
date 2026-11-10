import { useEffect, useState } from 'react';
import { useLeyes } from '../hooks/useLeyes.js';
import { useTitle } from '../hooks/useTitle.js';
import LeyCard from '../components/leyes/LeyCard.jsx';
import LeyesFiltros from '../components/leyes/LeyesFiltros.jsx';
import Icon from '../components/ui/Icon.jsx';
import { CardSkeleton, EmptyState, ErrorBox } from '../components/ui/Estados.jsx';
import { ORDENES } from '../lib/format.js';

export default function Leyes() {
  useTitle('Leyes docentes');
  const L = useLeyes();
  const [panelAbierto, setPanelAbierto] = useState(false);

  // Texto del buscador: se escribe local y se pasa a la URL con un pequeño retraso.
  const [texto, setTexto] = useState(L.q);
  useEffect(() => {
    setTexto(L.q);
  }, [L.q]);
  useEffect(() => {
    if (texto === L.q) return;
    const t = setTimeout(() => L.setParam('q', texto), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  // Bloquea el scroll del fondo con el panel de filtros abierto (celular)
  useEffect(() => {
    document.body.style.overflow = panelAbierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [panelAbierto]);

  const filtrosProps = {
    filtros: L.filtros,
    setParam: L.setParam,
    anios: L.anios,
    filtrosActivos: L.filtrosActivos,
    limpiarFiltros: L.limpiarFiltros,
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Leyes docentes</h1>
        <p className="mt-2 text-ink/70">Normativa vigente de la Provincia de Tucumán y de Nación.</p>
      </header>

      {/* Buscador + orden */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="buscar-leyes" className="sr-only">
            Buscar por nombre, número o palabra clave
          </label>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-dark" />
          <input
            id="buscar-leyes"
            type="search"
            className="input pl-12"
            placeholder="Buscar por nombre, número o palabra clave"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-outline flex-1 lg:hidden"
            onClick={() => setPanelAbierto(true)}
            aria-haspopup="dialog"
          >
            <Icon name="filter" /> Filtros{L.filtrosActivos > 0 && ` (${L.filtrosActivos})`}
          </button>
          <label htmlFor="orden" className="sr-only">
            Ordenar por
          </label>
          <select
            id="orden"
            className="input flex-1 sm:w-52 sm:flex-none"
            value={L.orden}
            onChange={(e) => L.setParam('orden', e.target.value === 'recientes' ? '' : e.target.value)}
          >
            {ORDENES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filtros: barra lateral en desktop */}
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="card sticky top-24 p-5">
            <h2 className="mb-4 font-bold">Filtrar</h2>
            <LeyesFiltros {...filtrosProps} />
          </div>
        </aside>

        <section aria-live="polite" aria-busy={L.loading}>
          {L.loading ? (
            <>
              {L.despertando && (
                <p className="mb-4 flex items-center gap-2 rounded-xl bg-primary-light px-4 py-3 text-sm">
                  <Icon name="clock" className="h-5 w-5 shrink-0 text-primary-dark" />
                  El servidor se está despertando. La primera carga puede tardar hasta un minuto.
                </p>
              )}
              <div className="grid gap-5 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </>
          ) : L.error ? (
            <ErrorBox error={L.error} onRetry={L.reintentar} />
          ) : (
            <>
              <p className="mb-4 text-sm font-medium text-ink/70">
                {L.resultados.length === L.total
                  ? `${L.total} ${L.total === 1 ? 'norma' : 'normas'}`
                  : `${L.resultados.length} de ${L.total} normas`}
              </p>
              {L.resultados.length === 0 ? (
                <EmptyState
                  titulo="No encontramos normas con esa búsqueda"
                  accion={
                    <button
                      type="button"
                      className="btn-primary mt-2"
                      onClick={() => {
                        setTexto('');
                        L.limpiarTodo();
                      }}
                    >
                      Ver todas las leyes
                    </button>
                  }
                >
                  Probá con otras palabras o sacá algún filtro.
                </EmptyState>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {L.resultados.map((ley) => (
                    <LeyCard key={ley.id} ley={ley} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Filtros: panel inferior en celular/tablet */}
      {panelAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="titulo-filtros">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Cerrar filtros"
            onClick={() => setPanelAbierto(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="titulo-filtros" className="text-xl font-bold">
                Filtros
              </h2>
              <button type="button" className="btn-ghost -mr-3 px-3" onClick={() => setPanelAbierto(false)} aria-label="Cerrar">
                <Icon name="x" className="h-6 w-6" />
              </button>
            </div>
            <LeyesFiltros {...filtrosProps} />
            <button type="button" className="btn-primary mt-6 w-full" onClick={() => setPanelAbierto(false)}>
              Ver {L.resultados.length} {L.resultados.length === 1 ? 'resultado' : 'resultados'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
