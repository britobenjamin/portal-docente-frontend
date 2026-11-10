import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-primary/30 bg-primary-light/40">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-ink">Portal Docente</span> · ATEP Tucumán
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Pie de página">
          <Link to="/leyes" className="hover:text-ink">Leyes</Link>
          <Link to="/formularios" className="hover:text-ink">Formularios</Link>
          <Link to="/mis-datos" className="hover:text-ink">Mis datos</Link>
        </nav>
      </div>
    </footer>
  );
}
