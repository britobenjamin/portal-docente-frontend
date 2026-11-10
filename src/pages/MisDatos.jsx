import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CAMPOS_MIS_DATOS, useMisDatos } from '../hooks/useMisDatos.js';
import { useTitle } from '../hooks/useTitle.js';
import CampoDinamico from '../components/formularios/CampoDinamico.jsx';
import Icon from '../components/ui/Icon.jsx';
import { validarCampo, validarTodo } from '../lib/validators.js';

export default function MisDatos() {
  useTitle('Mis datos');
  const { datos, guardar, borrar, tieneDatos } = useMisDatos();
  const [valores, setValores] = useState(() => ({ ...datos }));
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validarTodo(CAMPOS_MIS_DATOS, valores);
    setErrores(errs);
    if (Object.keys(errs).length) {
      setMensaje({ tipo: 'error', texto: 'Revisá los campos marcados en rojo.' });
      return;
    }
    guardar(valores);
    setMensaje({ tipo: 'ok', texto: 'Listo, tus datos quedaron guardados en este dispositivo.' });
  };

  const onBorrar = () => {
    borrar();
    setValores({});
    setErrores({});
    setConfirmarBorrado(false);
    setMensaje({ tipo: 'ok', texto: 'Se borraron tus datos de este dispositivo.' });
  };

  return (
    <div className="container-page max-w-3xl py-8 sm:py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Mis datos</h1>
      <p className="mt-2 text-ink/70">
        Cargalos una vez y se completan solos en todos los{' '}
        <Link to="/formularios" className="link">
          formularios
        </Link>
        .
      </p>

      <div className="my-6 flex gap-3 rounded-2xl border border-primary/50 bg-primary-light p-4">
        <Icon name="alert" className="mt-0.5 h-6 w-6 shrink-0 text-primary-dark" />
        <p className="text-[15px]">
          <strong>Tus datos quedan guardados solo en este dispositivo.</strong> No se envían a ningún servidor. Si usás
          una computadora compartida, borralos al terminar.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="card p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {CAMPOS_MIS_DATOS.map((c) => (
            <CampoDinamico
              key={c.nombre}
              campo={c}
              valor={valores[c.nombre]}
              error={errores[c.nombre]}
              onChange={(v) => {
                setValores((p) => ({ ...p, [c.nombre]: v }));
                setMensaje(null);
                if (errores[c.nombre]) setErrores((e) => ({ ...e, [c.nombre]: undefined }));
              }}
              onBlur={() => setErrores((e) => ({ ...e, [c.nombre]: validarCampo(c, valores[c.nombre]) ?? undefined }))}
            />
          ))}
        </div>

        {mensaje && (
          <p
            role={mensaje.tipo === 'error' ? 'alert' : 'status'}
            className={`mt-6 rounded-xl px-4 py-3 font-medium ${
              mensaje.tipo === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
            }`}
          >
            {mensaje.texto}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary sm:px-10">
            Guardar mis datos
          </button>
          {tieneDatos && !confirmarBorrado && (
            <button type="button" className="btn-ghost text-red-800 hover:bg-red-50" onClick={() => setConfirmarBorrado(true)}>
              Borrar datos guardados
            </button>
          )}
        </div>

        {confirmarBorrado && (
          <div role="alertdialog" aria-labelledby="conf-borrar" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p id="conf-borrar" className="mb-3 font-semibold text-red-900">
              ¿Borrar todos tus datos de este dispositivo?
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn bg-red-700 text-white hover:bg-red-800" onClick={onBorrar}>
                Sí, borrar
              </button>
              <button type="button" className="btn-outline" onClick={() => setConfirmarBorrado(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
