import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import LeyBadges from './LeyBadges.jsx';
import { nombreNorma } from '../../lib/format.js';

export default function LeyCard({ ley }) {
  return (
    <article className="card group relative flex flex-col p-5 transition hover:border-primary hover:shadow-card-hover">
      <p className="mb-1 text-sm font-bold uppercase tracking-wide text-primary-dark">{nombreNorma(ley)}</p>
      <h3 className="mb-2 text-lg font-semibold leading-snug">
        <Link to={`/leyes/${ley.slug}`} className="after:absolute after:inset-0 focus:outline-none">
          {ley.titulo}
        </Link>
      </h3>
      {ley.resumen && <p className="mb-4 line-clamp-3 text-[15px] leading-relaxed text-ink/75">{ley.resumen}</p>}
      <div className="mb-5">
        <LeyBadges ley={ley} />
      </div>

      {/* "relative z-10" para que los botones queden por encima del link que cubre toda la card */}
      <div className="relative z-10 mt-auto grid grid-cols-2 gap-2">
        {ley.pdf_url ? (
          <>
            <a
              href={ley.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-3"
              aria-label={`Ver PDF de ${nombreNorma(ley)} (se abre en otra pestaña)`}
            >
              <Icon name="eye" /> Ver
            </a>
            <a href={ley.pdf_download_url} className="btn-primary px-3" download aria-label={`Descargar PDF de ${nombreNorma(ley)}`}>
              <Icon name="download" /> <span>Descargar PDF</span>
            </a>
          </>
        ) : (
          <span className="col-span-2 btn border border-neutral-200 px-3 text-sm text-ink/50">PDF no disponible</span>
        )}
      </div>
    </article>
  );
}
