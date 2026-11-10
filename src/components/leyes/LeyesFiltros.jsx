import { useApi } from '../../hooks/useApi.js';
import { JURISDICCIONES, TIPOS } from '../../lib/format.js';

function Campo({ id, label, value, onChange, opciones, todos = 'Todos' }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select id={id} className="input appearance-none bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10" style={{ backgroundImage: CHEVRON }} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{todos}</option>
        {opciones.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A8841A' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

/** Filtros de jurisdicción, tipo, categoría, nivel y año. */
export default function LeyesFiltros({ filtros, setParam, anios, filtrosActivos, limpiarFiltros }) {
  const { data: categorias } = useApi('/categorias');
  const { data: niveles } = useApi('/niveles');

  return (
    <div className="flex flex-col gap-4">
      <Campo
        id="f-jurisdiccion"
        label="Jurisdicción"
        todos="Todas"
        value={filtros.jurisdiccion}
        onChange={(v) => setParam('jurisdiccion', v)}
        opciones={JURISDICCIONES}
      />
      <Campo id="f-tipo" label="Tipo" value={filtros.tipo} onChange={(v) => setParam('tipo', v)} opciones={TIPOS} />
      <Campo
        id="f-categoria"
        label="Categoría"
        todos="Todas"
        value={filtros.categoria}
        onChange={(v) => setParam('categoria', v)}
        opciones={(categorias ?? []).map((c) => ({ value: String(c.id), label: c.nombre }))}
      />
      <Campo
        id="f-nivel"
        label="Nivel"
        value={filtros.nivel}
        onChange={(v) => setParam('nivel', v)}
        opciones={(niveles ?? []).map((n) => ({ value: String(n.id), label: n.nombre }))}
      />
      <Campo
        id="f-anio"
        label="Año"
        value={filtros.anio}
        onChange={(v) => setParam('anio', v)}
        opciones={anios.map((a) => ({ value: String(a), label: String(a) }))}
      />
      {filtrosActivos > 0 && (
        <button type="button" onClick={limpiarFiltros} className="btn-ghost justify-start px-0 text-sm underline decoration-primary underline-offset-4">
          Limpiar filtros ({filtrosActivos})
        </button>
      )}
    </div>
  );
}
