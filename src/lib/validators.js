// Validaciones de campos de formulario. Cada una devuelve un mensaje de error o null.

export const soloDigitos = (v) => String(v ?? '').replace(/\D/g, '');

export function validarDni(v) {
  const d = soloDigitos(v);
  if (d.length < 7 || d.length > 8) return 'El DNI debe tener 7 u 8 números.';
  return null;
}

/** CUIL/CUIT: 11 dígitos con dígito verificador (acepta con o sin guiones). */
export function validarCuil(v) {
  const d = soloDigitos(v);
  if (d.length !== 11) return 'El CUIL debe tener 11 números (ej: 27-12345678-9).';
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((acc, p, i) => acc + p * Number(d[i]), 0);
  let dv = 11 - (suma % 11);
  if (dv === 11) dv = 0;
  if (dv === 10) return null; // caso especial (ANSES cambia el prefijo a 23/24): no se bloquea
  if (dv !== Number(d[10])) return 'El CUIL no es válido. Revisá los números.';
  return null;
}

export function formatearCuil(v) {
  const d = soloDigitos(v);
  if (d.length !== 11) return v;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d[10]}`;
}

export function validarEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()) ? null : 'El email no es válido.';
}

export function validarTelefono(v) {
  const d = soloDigitos(v);
  return d.length >= 7 && d.length <= 15 ? null : 'El teléfono no es válido.';
}

/** Fecha en formato yyyy-mm-dd (lo que devuelve <input type="date">). */
export function validarFecha(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'La fecha no es válida.';
  const [a, m, d] = v.split('-').map(Number);
  const f = new Date(a, m - 1, d);
  if (f.getFullYear() !== a || f.getMonth() !== m - 1 || f.getDate() !== d) return 'La fecha no es válida.';
  if (a < 1900 || a > 2100) return 'La fecha no es válida.';
  return null;
}

const POR_TIPO = { dni: validarDni, cuil: validarCuil, email: validarEmail, telefono: validarTelefono };

/** Valida un campo según su definición JSON. `valores` sirve para reglas entre campos (despuesDe). */
export function validarCampo(campo, valor, valores = {}, campos = []) {
  const vacio = valor === undefined || valor === null || valor === '' || valor === false;
  if (vacio) return campo.obligatorio ? 'Este campo es obligatorio.' : null;
  if (campo.tipo === 'date') {
    const err = validarFecha(valor);
    if (err) return err;
    if (campo.despuesDe && valores[campo.despuesDe] && valor < valores[campo.despuesDe]) {
      const otro = campos.find((c) => c.nombre === campo.despuesDe);
      return `Debe ser igual o posterior a "${otro?.label ?? campo.despuesDe}".`;
    }
  }
  if (campo.tipo === 'number' && Number.isNaN(Number(valor))) return 'Ingresá solo números.';
  if (campo.validacion && POR_TIPO[campo.validacion]) return POR_TIPO[campo.validacion](valor);
  return null;
}

/**
 * Valida todos los campos. Los campos tipo "lista" generan errores con clave "lista.indice.subcampo"
 * (ej: "cargos.0.dependencia").
 */
export function validarTodo(campos, valores) {
  const errores = {};
  for (const c of campos) {
    if (c.tipo === 'lista') {
      const items = Array.isArray(valores[c.nombre]) ? valores[c.nombre] : [];
      if (c.obligatorio && items.length === 0) errores[c.nombre] = 'Agregá al menos uno.';
      items.forEach((item, i) => {
        for (const s of c.subcampos) {
          const e = validarCampo(s, item[s.nombre], item, c.subcampos);
          if (e) errores[`${c.nombre}.${i}.${s.nombre}`] = e;
        }
      });
      continue;
    }
    const e = validarCampo(c, valores[c.nombre], valores, campos);
    if (e) errores[c.nombre] = e;
  }
  return errores;
}
