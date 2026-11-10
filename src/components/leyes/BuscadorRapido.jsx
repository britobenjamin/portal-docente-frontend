import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

/** Buscador del inicio: lleva a /leyes?q=... */
export default function BuscadorRapido() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const texto = q.trim();
    navigate(texto ? `/leyes?q=${encodeURIComponent(texto)}` : '/leyes');
  };

  return (
    <form onSubmit={onSubmit} role="search" className="flex w-full flex-col gap-3 sm:flex-row">
      <label htmlFor="buscador-rapido" className="sr-only">
        Buscar leyes
      </label>
      <div className="relative flex-1">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-dark" />
        <input
          id="buscador-rapido"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: licencia por maternidad, estatuto, 1002…"
          className="input min-h-[56px] pl-12 text-base shadow-card"
          autoComplete="off"
        />
      </div>
      <button type="submit" className="btn-primary min-h-[56px] px-7 text-base">
        Buscar
      </button>
    </form>
  );
}
