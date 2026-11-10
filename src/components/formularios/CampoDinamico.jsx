// Renderiza un campo según su definición JSON: text, number, date, select, textarea, checkbox.

export default function CampoDinamico({ campo, valor, error, onChange, onBlur }) {
  const id = `campo-${campo.nombre}`;
  const errId = `${id}-error`;
  const comunes = {
    id,
    name: campo.nombre,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : campo.ayuda ? `${id}-ayuda` : undefined,
    onBlur,
  };
  const claseInput = `input ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-200' : ''}`;

  if (campo.tipo === 'checkbox') {
    return (
      <div>
        <label htmlFor={id} className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-primary/40 p-3">
          <input
            {...comunes}
            type="checkbox"
            checked={!!valor}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 h-6 w-6 shrink-0 accent-primary-dark"
          />
          <span className="font-medium">
            {campo.label}
            {campo.obligatorio && <span className="text-red-700"> *</span>}
          </span>
        </label>
        {error && <p id={errId} className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
      </div>
    );
  }

  let control;
  if (campo.tipo === 'select') {
    control = (
      <select {...comunes} className={claseInput} value={valor ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">Elegí una opción</option>
        {campo.opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (campo.tipo === 'textarea') {
    control = (
      <textarea
        {...comunes}
        rows={4}
        className={`${claseInput} py-3`}
        placeholder={campo.placeholder}
        value={valor ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  } else {
    control = (
      <input
        {...comunes}
        type={campo.tipo === 'number' ? 'text' : campo.tipo}
        inputMode={campo.inputMode ?? (campo.tipo === 'number' ? 'numeric' : undefined)}
        autoComplete={campo.autoComplete ?? 'off'}
        className={claseInput}
        placeholder={campo.placeholder}
        value={valor ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {campo.label}
        {campo.obligatorio ? <span className="text-red-700"> *</span> : <span className="font-normal text-ink/60"> (opcional)</span>}
      </label>
      {control}
      {campo.ayuda && !error && (
        <p id={`${id}-ayuda`} className="mt-1.5 text-sm text-ink/60">
          {campo.ayuda}
        </p>
      )}
      {error && (
        <p id={errId} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
