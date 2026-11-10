import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

const LINKS = [
  { to: '/leyes', label: 'Leyes' },
  { to: '/formularios', label: 'Formularios' },
  { to: '/mis-datos', label: 'Mis datos' },
];

export function Logo({ size = 'h-12 w-12' }) {
  return <img src="/logo-atep.png" alt="" className={`${size} shrink-0 object-contain`} />;
}

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 font-medium transition-colors ${
      isActive ? 'bg-primary-light text-ink' : 'text-ink/80 hover:bg-primary-light/60 hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b-2 border-primary bg-white/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label="Portal Docente ATEP Tucumán - Inicio">
          <Logo />
          <span className="leading-tight">
            <span className="block text-lg font-bold">Portal Docente</span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-primary-dark">ATEP Tucumán</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="btn-ghost -mr-2 px-3 md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setAbierto((v) => !v)}
        >
          <Icon name={abierto ? 'x' : 'menu'} className="h-7 w-7" />
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" className="border-t border-primary/30 bg-white md:hidden" aria-label="Principal">
          <div className="container-page flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `${linkClass({ isActive })} py-3 text-lg`}>
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
