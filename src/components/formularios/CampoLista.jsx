// Campo "lista": un grupo de subcampos que se puede repetir (ej: hasta 3 cargos).
// Definición JSON: { tipo: "lista", min, max, subcampos: [...], titulosItems: [...], textoAgregar, itemsIniciales: [...] }
import CampoDinamico from './CampoDinamico.jsx';
import Icon from '../ui/Icon.jsx';
import { validarCampo } from '../../lib/validators.js';

export function nuevoItem(campo, i) {
  const item = {};
  for (const s of campo.subcampos) item[s.nombre] = s.default ?? (s.tipo === 'checkbox' ? false : '');
  return { ...item, ...(campo.itemsIniciales?.[i] ?? {}) };
}

/** Agrupa subcampos consecutivos por "subgrupo" para mostrarlos con un subtítulo. */
function bloques(subcampos) {
  const out = [];
  for (const s of subcampos) {
    const nombre = s.subgrupo ?? '';
    const ultimo = out[out.length - 1];
    if (ultimo && ultimo.nombre === nombre) ultimo.campos.push(s);
    else out.push({ nombre, campos: [s] });
  }
  return out;
}

export default function CampoLista({ campo, valor, errores, onChange, setError }) {
  const items = Array.isArray(valor) ? valor : [];
  const min = campo.min ?? 0;
  const max = campo.max ?? 10;

  const setSub = (i, nombre, v) => {
    const copia = items.map((it, j) => (j === i ? { ...it, [nombre]: v } : it));
    onChange(copia);
    setError(`${campo.nombre}.${i}.${nombre}`, undefined);
  };

  const quitar = (i) => {
    onChange(items.filter((_, j) => j !== i));
    // Los errores de los items se recalculan al validar de nuevo
    Object.keys(errores)
      .filter((k) => k.startsWith(`${campo.nombre}.`))
      .forEach((k) => setError(k, undefined));
  };

  return (
    <div className="flex flex-col gap-5">
      {items.map((item, i) => (
        <section key={i} className="rounded-2xl border border-primary/40 bg-primary-light/20 p-4 sm:p-5" aria-label={campo.titulosItems?.[i] ?? `Item ${i + 1}`}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="font-bold">{campo.titulosItems?.[i] ?? `${campo.label} ${i + 1}`}</h3>
            {items.length > min && (
              <button type="button" onClick={() => quitar(i)} className="btn-ghost min-h-[40px] px-3 text-sm text-red-800 hover:bg-red-50">
                <Icon name="x" className="h-4 w-4" /> Quitar
              </button>
            )}
          </div>

          {bloques(campo.subcampos).map((b, bi) => {
            const compacto = b.campos.every((s) => s.compacto);
            return (
              <div key={bi} className={bi > 0 ? 'mt-5' : ''}>
                {b.nombre && <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary-dark">{b.nombre}</p>}
                <div className={`grid gap-4 ${compacto ? 'grid-cols-2 sm:grid-cols-4' : 'sm:grid-cols-2'}`}>
                  {b.campos.map((s) => {
                    const clave = `${campo.nombre}.${i}.${s.nombre}`;
                    return (
                      <div key={s.nombre} className={s.tipo === 'textarea' ? 'sm:col-span-2' : ''}>
                        <CampoDinamico
                          campo={{ ...s, nombre: clave.replace(/\./g, '-') }}
                          valor={item[s.nombre]}
                          error={errores[clave]}
                          onChange={(v) => setSub(i, s.nombre, v)}
                          onBlur={() => setError(clave, validarCampo(s, item[s.nombre], item, campo.subcampos) ?? undefined)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {errores[campo.nombre] && <p className="text-sm font-medium text-red-700">{errores[campo.nombre]}</p>}

      {items.length < max && (
        <button type="button" className="btn-outline self-start" onClick={() => onChange([...items, nuevoItem(campo, items.length)])}>
          + {campo.textoAgregar ?? 'Agregar otro'}
        </button>
      )}
    </div>
  );
}
