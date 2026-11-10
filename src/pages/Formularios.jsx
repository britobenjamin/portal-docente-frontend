import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { formularios } from '../data/formularios/index.js';
import { useTitle } from '../hooks/useTitle.js';
import Icon from '../components/ui/Icon.jsx';
import { EmptyState } from '../components/ui/Estados.jsx';

export default function Formularios() {
  useTitle('Formularios');
  const [q, setQ] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(formularios, {
        keys: [
          { name: 'titulo', weight: 3 },
          { name: 'etiquetas', weight: 2 },
          { name: 'descripcion', weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        ignoreDiacritics: true,
      }),
    [],
  );
  const lista = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : formularios;

  return (
    <div className="container-page py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Formularios</h1>
        <p className="mt-2 max-w-2xl text-ink/70">
          Elegí una nota, completá tus datos y descargala en PDF lista para imprimir y firmar. No necesitás Word.
        </p>
      </header>

      <div className="relative mb-6 max-w-xl">
        <label htmlFor="buscar-form" className="sr-only">
          Buscar formulario
        </label>
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-dark" />
        <input
          id="buscar-form"
          type="search"
          className="input pl-12"
          placeholder="Buscar formulario (ej: inasistencia, licencia)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>

      {lista.length === 0 ? (
        <EmptyState titulo="No encontramos formularios con esa búsqueda">Probá con otra palabra.</EmptyState>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((f) => (
            <Link
              key={f.slug}
              to={`/formularios/${f.slug}`}
              className="card group flex flex-col gap-3 p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary-dark transition group-hover:bg-primary group-hover:text-ink">
                <Icon name="form" className="h-6 w-6" />
              </span>
              <span className="text-lg font-semibold leading-snug">{f.titulo}</span>
              <span className="text-[15px] text-ink/70">{f.descripcion}</span>
              <span className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold">
                Completar
                <Icon name="arrowRight" className="h-5 w-5 text-primary-dark transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-10 text-sm text-ink/70">
        ¿Usás siempre los mismos datos?{' '}
        <Link to="/mis-datos" className="link">
          Guardalos en Mis datos
        </Link>{' '}
        y se completan solos en todos los formularios.
      </p>
    </div>
  );
}
