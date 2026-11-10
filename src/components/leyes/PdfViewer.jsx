import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import Icon from '../ui/Icon.jsx';

/**
 * Desktop: PDF embebido en un iframe.
 * Celular: Chrome Android y Safari iOS no muestran PDFs en iframes, así que se muestra
 * la miniatura de la 1ª página (si existe) y un botón grande para abrirlo en el visor del teléfono.
 */
export default function PdfViewer({ url, thumbUrl, titulo }) {
  const desktop = useMediaQuery('(min-width: 768px)');

  if (!url) {
    return (
      <div className="card p-8 text-center text-ink/70">Esta norma todavía no tiene un PDF cargado.</div>
    );
  }

  if (desktop) {
    return (
      <div className="card overflow-hidden">
        <iframe src={url} title={`PDF: ${titulo}`} className="h-[80vh] w-full" />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex flex-col items-center gap-4 p-5 text-center transition hover:border-primary"
    >
      {thumbUrl ? (
        <img src={thumbUrl} alt={`Primera página de ${titulo}`} className="w-full max-w-xs rounded-lg border border-primary/30" loading="lazy" />
      ) : (
        <div className="flex h-40 w-32 items-center justify-center rounded-lg border-2 border-primary/40 bg-primary-light">
          <span className="text-2xl font-bold text-primary-dark">PDF</span>
        </div>
      )}
      <span className="btn-primary w-full">
        <Icon name="external" /> Abrir PDF
      </span>
    </a>
  );
}
