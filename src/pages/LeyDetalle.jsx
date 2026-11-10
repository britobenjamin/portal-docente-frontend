import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { useTitle } from '../hooks/useTitle.js';
import { Cargando, ErrorBox } from '../components/ui/Estados.jsx';
import Icon from '../components/ui/Icon.jsx';
import Badge from '../components/ui/Badge.jsx';
import LeyBadges from '../components/leyes/LeyBadges.jsx';
import PdfViewer from '../components/leyes/PdfViewer.jsx';
import { jurisdiccionLabel, nombreNorma, tipoLabel } from '../lib/format.js';
import NotFound from './NotFound.jsx';

function Dato({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/60">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  );
}

export default function LeyDetalle() {
  const { slug } = useParams();
  const { data: ley, error, loading, despertando, reintentar } = useApi(`/leyes/${encodeURIComponent(slug)}`);
  useTitle(ley ? `${nombreNorma(ley)} — ${ley.titulo}` : 'Ley');

  if (loading) return <Cargando despertando={despertando} />;
  if (error?.status === 404) return <NotFound mensaje="Esta norma no existe o ya no está vigente." />;
  if (error)
    return (
      <div className="container-page py-12">
        <ErrorBox error={error} onRetry={reintentar} />
      </div>
    );

  return (
    <div className="container-page py-8 sm:py-12">
      <Link to="/leyes" className="mb-6 inline-flex items-center gap-2 font-medium text-ink/70 hover:text-ink">
        <Icon name="arrowLeft" className="h-5 w-5" /> Volver a leyes
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-primary-dark">{nombreNorma(ley)}</p>
          <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-4xl">{ley.titulo}</h1>
          <div className="mb-6">
            <LeyBadges ley={ley} />
          </div>
          {ley.resumen && <p className="mb-8 text-lg leading-relaxed text-ink/80">{ley.resumen}</p>}

          <h2 className="mb-3 text-xl font-bold">Documento</h2>
          <PdfViewer url={ley.pdf_url} thumbUrl={ley.pdf_thumb_url} titulo={ley.titulo} />
        </div>

        <aside className="lg:pt-8">
          <div className="card sticky top-24 flex flex-col gap-5 p-6">
            {ley.pdf_download_url && (
              <a href={ley.pdf_download_url} download className="btn-primary w-full">
                <Icon name="download" /> Descargar PDF
              </a>
            )}
            <dl className="grid grid-cols-2 gap-4">
              <Dato label="Tipo">{tipoLabel(ley.tipo)}</Dato>
              <Dato label="Número">{ley.numero}</Dato>
              <Dato label="Jurisdicción">{jurisdiccionLabel(ley.jurisdiccion)}</Dato>
              <Dato label="Año">{ley.anio}</Dato>
              <div className="col-span-2">
                <Dato label="Niveles">{ley.niveles.map((n) => n.nombre).join(', ') || '—'}</Dato>
              </div>
            </dl>
            {ley.palabras_clave.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/60">Palabras clave</p>
                <div className="flex flex-wrap gap-1.5">
                  {ley.palabras_clave.map((p) => (
                    <Link key={p} to={`/leyes?q=${encodeURIComponent(p)}`}>
                      <Badge variant="muted" className="hover:bg-primary-light">{p}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
