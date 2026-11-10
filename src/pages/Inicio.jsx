import { Link } from 'react-router-dom';
import BuscadorRapido from '../components/leyes/BuscadorRapido.jsx';
import Icon from '../components/ui/Icon.jsx';
import { useTitle } from '../hooks/useTitle.js';

function CardAcceso({ to, icon, titulo, texto, cta }) {
  return (
    <Link
      to={to}
      className="card group flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover sm:p-8"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark transition group-hover:bg-primary group-hover:text-ink">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <span className="text-2xl font-bold">{titulo}</span>
      <span className="text-ink/75">{texto}</span>
      <span className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold">
        {cta}
        <Icon name="arrowRight" className="h-5 w-5 text-primary-dark transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function Inicio() {
  useTitle();
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/70 via-primary-light/20 to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[40px] border-primary/10"
        />
        <div className="container-page relative py-14 sm:py-20">
          <p className="mb-3 inline-block rounded-full border border-primary/50 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-dark">
            ATEP Tucumán
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl sm:leading-tight">
            Las leyes y formularios docentes, <span className="text-primary-dark">en un solo lugar</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/75">
            Buscá la normativa de Tucumán y Nación, descargala en PDF y completá tus notas sin abrir Word.
          </p>
          <div className="mt-8 max-w-2xl">
            <BuscadorRapido />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-5 py-12 md:grid-cols-2" aria-label="Secciones">
        <CardAcceso
          to="/leyes"
          icon="book"
          titulo="Leyes docentes"
          texto="Estatuto, licencias, salario, jubilación, concursos y más. Filtrá por jurisdicción, tipo y nivel."
          cta="Ver leyes"
        />
        <CardAcceso
          to="/formularios"
          icon="form"
          titulo="Formularios"
          texto="Pedidos de licencia, justificación de inasistencias y declaraciones juradas listos para descargar en PDF."
          cta="Ver formularios"
        />
      </section>
    </>
  );
}
