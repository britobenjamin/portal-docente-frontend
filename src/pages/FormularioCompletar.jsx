import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerFormulario } from '../data/formularios/index.js';
import { useMisDatos } from '../hooks/useMisDatos.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useTitle } from '../hooks/useTitle.js';
import CampoDinamico from '../components/formularios/CampoDinamico.jsx';
import CampoLista, { nuevoItem } from '../components/formularios/CampoLista.jsx';
import VistaPreviaNota from '../components/formularios/VistaPreviaNota.jsx';
import Icon from '../components/ui/Icon.jsx';
import { Spinner } from '../components/ui/Estados.jsx';
import { validarCampo, validarTodo } from '../lib/validators.js';
import { armarNota, hoyISO, nombreArchivo } from '../lib/plantilla.js';
import { descargarPdf, layoutDe, pdfBlob } from '../lib/pdf/index.js';
import NotFound from './NotFound.jsx';

/** Valores iniciales: default del JSON → pisado por Mis datos (si hay). */
function valoresIniciales(form, misDatos) {
  const v = {};
  for (const c of form.campos) {
    if (c.tipo === 'lista') {
      v[c.nombre] = Array.from({ length: c.min ?? 1 }, (_, i) => nuevoItem(c, i));
      continue;
    }
    const clave = c.misDatos ?? c.nombre;
    if (misDatos[clave]) v[c.nombre] = misDatos[clave];
    else if (c.default === 'hoy') v[c.nombre] = hoyISO();
    else if (c.default !== undefined) v[c.nombre] = c.default;
    else v[c.nombre] = c.tipo === 'checkbox' ? false : '';
  }
  return v;
}

function agrupar(campos) {
  const grupos = [];
  for (const c of campos) {
    const nombre = c.grupo ?? 'Datos';
    let g = grupos.find((x) => x.nombre === nombre);
    if (!g) grupos.push((g = { nombre, campos: [] }));
    g.campos.push(c);
  }
  return grupos;
}

const idDeError = (clave) => `campo-${clave.replace(/\./g, '-')}`;

export default function FormularioCompletar() {
  const { slug } = useParams();
  const form = obtenerFormulario(slug);
  useTitle(form?.titulo ?? 'Formulario');
  if (!form) return <NotFound mensaje="Ese formulario no existe." />;
  return <Completar key={form.slug} form={form} />;
}

function Completar({ form }) {
  const { datos: misDatos, guardar, tieneDatos } = useMisDatos();
  const [valores, setValores] = useState(() => valoresIniciales(form, misDatos));
  const [errores, setErrores] = useState({});
  const [paso, setPaso] = useState('form'); // form | preview
  const [guardarEnMisDatos, setGuardarEnMisDatos] = useState(!tieneDatos);
  const [generando, setGenerando] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [errorPdf, setErrorPdf] = useState(null);
  const desktop = useMediaQuery('(min-width: 768px)');
  const topRef = useRef(null);

  const esNota = layoutDe(form) === 'nota';
  const grupos = useMemo(() => agrupar(form.campos), [form]);
  const nota = useMemo(() => (esNota ? armarNota(form.plantilla, valores) : null), [esNota, form, valores]);
  const autocompletados = form.campos.filter((c) => c.tipo !== 'lista' && misDatos[c.misDatos ?? c.nombre]).length;

  const setError = (clave, err) => setErrores((e) => ({ ...e, [clave]: err }));

  const setValor = (nombre, v) => {
    setValores((prev) => ({ ...prev, [nombre]: v }));
    if (errores[nombre]) setError(nombre, undefined);
  };

  const irAVistaPrevia = (e) => {
    e.preventDefault();
    const errs = validarTodo(form.campos, valores);
    setErrores(errs);
    const claves = Object.keys(errs);
    if (claves.length) {
      document.getElementById(idDeError(claves[0]))?.focus();
      return;
    }
    if (guardarEnMisDatos) {
      const paraGuardar = {};
      form.campos.forEach((c) => {
        if (c.misDatos && valores[c.nombre]) paraGuardar[c.misDatos] = valores[c.nombre];
      });
      guardar(paraGuardar);
    }
    setPaso('preview');
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Genera el PDF para la vista previa (iframe en desktop, botón "Ver PDF" en celular)
  useEffect(() => {
    if (paso !== 'preview') return undefined;
    let url;
    let cancelado = false;
    setPdfUrl(null);
    setErrorPdf(null);
    pdfBlob(form, valores)
      .then((blob) => {
        if (cancelado) return;
        url = URL.createObjectURL(blob);
        setPdfUrl(url);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelado) setErrorPdf('No se pudo generar la vista previa del PDF.');
      });
    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [paso, form, valores]);

  const descargar = async () => {
    setGenerando(true);
    setErrorPdf(null);
    try {
      await descargarPdf(form, valores, nombreArchivo(form.slug, valores.apellido));
    } catch (err) {
      console.error(err);
      setErrorPdf('No se pudo generar el PDF. Probá de nuevo.');
    } finally {
      setGenerando(false);
    }
  };

  const hayErrores = Object.values(errores).some(Boolean);

  return (
    <div ref={topRef} className="container-page scroll-mt-24 py-8 sm:py-12">
      <Link to="/formularios" className="mb-6 inline-flex items-center gap-2 font-medium text-ink/70 hover:text-ink">
        <Icon name="arrowLeft" className="h-5 w-5" /> Volver a formularios
      </Link>
      <h1 className="text-2xl font-bold leading-tight sm:text-4xl">{form.titulo}</h1>
      <p className="mt-2 max-w-2xl text-ink/70">{form.descripcion}</p>

      {/* Pasos */}
      <ol className="my-6 flex items-center gap-3 text-sm font-semibold" aria-label="Pasos">
        <li className={`flex items-center gap-2 ${paso === 'form' ? 'text-ink' : 'text-ink/50'}`}>
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${paso === 'form' ? 'bg-primary' : 'bg-primary-light'}`}>1</span>
          Completar
        </li>
        <li aria-hidden="true" className="h-px w-8 bg-primary/50" />
        <li className={`flex items-center gap-2 ${paso === 'preview' ? 'text-ink' : 'text-ink/50'}`}>
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${paso === 'preview' ? 'bg-primary' : 'bg-primary-light'}`}>2</span>
          Revisar y descargar
        </li>
      </ol>

      {paso === 'form' ? (
        <form onSubmit={irAVistaPrevia} noValidate className="max-w-3xl">
          {autocompletados > 0 && (
            <p className="mb-4 rounded-xl bg-primary-light px-4 py-3 text-sm">
              Completamos {autocompletados} {autocompletados === 1 ? 'campo' : 'campos'} con tus datos guardados.{' '}
              <Link to="/mis-datos" className="link">
                Editar Mis datos
              </Link>
            </p>
          )}
          {form.aviso && (
            <p className="mb-6 flex gap-2 rounded-xl border border-primary/40 px-4 py-3 text-sm">
              <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
              {form.aviso}
            </p>
          )}

          {grupos.map((g) => (
            <fieldset key={g.nombre} className="card mb-5 p-5 sm:p-6">
              <legend className="float-left mb-4 w-full text-lg font-bold">{g.nombre}</legend>
              <div className="clear-both grid gap-5 sm:grid-cols-2">
                {g.campos.map((c) =>
                  c.tipo === 'lista' ? (
                    <div key={c.nombre} className="sm:col-span-2">
                      <CampoLista
                        campo={c}
                        valor={valores[c.nombre]}
                        errores={errores}
                        onChange={(v) => setValor(c.nombre, v)}
                        setError={setError}
                      />
                    </div>
                  ) : (
                    <div key={c.nombre} className={c.tipo === 'textarea' || c.tipo === 'checkbox' ? 'sm:col-span-2' : ''}>
                      <CampoDinamico
                        campo={c}
                        valor={valores[c.nombre]}
                        error={errores[c.nombre]}
                        onChange={(v) => setValor(c.nombre, v)}
                        onBlur={() => setError(c.nombre, validarCampo(c, valores[c.nombre], valores, form.campos) ?? undefined)}
                      />
                    </div>
                  ),
                )}
              </div>
            </fieldset>
          ))}

          {form.campos.some((c) => c.misDatos) && (
            <label className="mb-6 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-6 w-6 shrink-0 accent-primary-dark"
                checked={guardarEnMisDatos}
                onChange={(e) => setGuardarEnMisDatos(e.target.checked)}
              />
              <span>
                Guardar mis datos en este dispositivo para la próxima
                <span className="block text-sm text-ink/60">No se envían a ningún servidor.</span>
              </span>
            </label>
          )}

          {hayErrores && (
            <p role="alert" className="mb-4 font-medium text-red-700">
              Revisá los campos marcados en rojo.
            </p>
          )}

          <button type="submit" className="btn-primary w-full sm:w-auto sm:px-10">
            Ver vista previa <Icon name="arrowRight" />
          </button>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            {desktop ? (
              <div className="card overflow-hidden">
                {pdfUrl ? (
                  <iframe src={pdfUrl} title="Vista previa del PDF" className="h-[85vh] w-full" />
                ) : (
                  <div className="flex h-[60vh] items-center justify-center">
                    <Spinner />
                  </div>
                )}
              </div>
            ) : esNota ? (
              <VistaPreviaNota nota={nota} />
            ) : (
              <div className="card flex flex-col items-center gap-4 p-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-xl font-bold text-primary-dark">PDF</span>
                <p className="text-ink/75">Tu documento está listo. Abrilo para revisarlo antes de descargarlo.</p>
                {pdfUrl ? (
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                    <Icon name="eye" /> Ver PDF
                  </a>
                ) : (
                  <Spinner />
                )}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm text-ink/70">Revisá que esté todo bien. Si algo no está correcto, volvé a editar.</p>
            <button type="button" className="btn-primary w-full" onClick={descargar} disabled={generando}>
              {generando ? <Spinner className="h-5 w-5 border-2" /> : <Icon name="download" />}
              {generando ? 'Generando…' : 'Descargar PDF'}
            </button>
            <button type="button" className="btn-outline w-full" onClick={() => setPaso('form')}>
              <Icon name="arrowLeft" /> Editar datos
            </button>
            {errorPdf && (
              <p role="alert" className="text-sm font-medium text-red-700">
                {errorPdf}
              </p>
            )}
            {form.aviso && <p className="text-xs text-ink/60">{form.aviso}</p>}
            <p className="text-xs text-ink/60">Archivo: {nombreArchivo(form.slug, valores.apellido)}</p>
          </aside>
        </div>
      )}
    </div>
  );
}
