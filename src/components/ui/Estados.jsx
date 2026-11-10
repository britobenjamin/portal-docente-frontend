import Icon from './Icon.jsx';

export function Spinner({ className = 'h-8 w-8' }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block animate-spin rounded-full border-4 border-primary-light border-t-primary ${className}`}
    />
  );
}

/** Carga con aviso de "servidor despertando" (Render free tarda en arrancar). */
export function Cargando({ despertando, texto = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Spinner />
      <p className="font-medium">{texto}</p>
      {despertando && (
        <p className="max-w-sm text-sm text-ink/70">
          El servidor se está despertando. La primera carga puede tardar hasta un minuto, después va rápido.
        </p>
      )}
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 p-8 text-center">
      <Icon name="alert" className="h-10 w-10 text-primary-dark" />
      <p className="font-semibold">{error?.message || 'Ocurrió un error.'}</p>
      {onRetry && (
        <button type="button" className="btn-primary mt-2" onClick={onRetry}>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}

export function EmptyState({ titulo, children, accion }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-light/40 px-6 py-14 text-center">
      <Icon name="search" className="h-10 w-10 text-primary-dark" />
      <p className="text-lg font-semibold">{titulo}</p>
      {children && <div className="max-w-md text-ink/70">{children}</div>}
      {accion}
    </div>
  );
}

/** Esqueleto de card mientras carga la lista. */
export function CardSkeleton() {
  return (
    <div className="card animate-pulse p-5">
      <div className="mb-3 h-4 w-28 rounded bg-primary-light" />
      <div className="mb-2 h-5 w-full rounded bg-neutral-100" />
      <div className="mb-4 h-5 w-2/3 rounded bg-neutral-100" />
      <div className="mb-2 h-3 w-full rounded bg-neutral-100" />
      <div className="mb-5 h-3 w-5/6 rounded bg-neutral-100" />
      <div className="flex gap-2">
        <div className="h-12 flex-1 rounded-xl bg-primary-light" />
        <div className="h-12 flex-1 rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
}
