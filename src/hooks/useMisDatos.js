import { useCallback, useEffect, useState } from 'react';

const KEY = 'portal-docente:mis-datos';

/** Campos de "Mis datos". Se guardan SOLO en el navegador (localStorage). */
export const CAMPOS_MIS_DATOS = [
  { nombre: 'nombre', label: 'Nombre/s', tipo: 'text', autoComplete: 'given-name' },
  { nombre: 'apellido', label: 'Apellido/s', tipo: 'text', autoComplete: 'family-name' },
  {
    nombre: 'suscribe',
    label: 'En las notas, presentarme como',
    tipo: 'select',
    opciones: ['La que suscribe', 'El que suscribe'],
  },
  { nombre: 'dni', label: 'DNI', tipo: 'text', validacion: 'dni', inputMode: 'numeric', placeholder: 'Sin puntos' },
  { nombre: 'cuil', label: 'CUIL', tipo: 'text', validacion: 'cuil', inputMode: 'numeric', placeholder: '27-12345678-9' },
  { nombre: 'ipss', label: 'Nº I.P.S.S.', tipo: 'text' },
  { nombre: 'fecha_nacimiento', label: 'Fecha de nacimiento', tipo: 'date' },
  { nombre: 'legajo', label: 'Legajo', tipo: 'text' },
  { nombre: 'domicilio', label: 'Domicilio (calle y número)', tipo: 'text', autoComplete: 'street-address' },
  { nombre: 'localidad', label: 'Localidad', tipo: 'text', placeholder: 'Ej: San Miguel de Tucumán' },
  { nombre: 'escuela', label: 'Escuela', tipo: 'text', placeholder: 'Ej: Escuela N° 123 "Gral. Belgrano"' },
  { nombre: 'cargo', label: 'Cargo', tipo: 'text', placeholder: 'Ej: Maestra de grado' },
  {
    nombre: 'nivel',
    label: 'Nivel',
    tipo: 'select',
    opciones: ['Inicial', 'Primario', 'Secundario', 'Superior'],
  },
  { nombre: 'telefono', label: 'Teléfono', tipo: 'text', validacion: 'telefono', inputMode: 'tel', autoComplete: 'tel' },
  { nombre: 'email', label: 'Email', tipo: 'text', validacion: 'email', inputMode: 'email', autoComplete: 'email' },
];

const NOMBRES = new Set(CAMPOS_MIS_DATOS.map((c) => c.nombre));

function leer() {
  try {
    const raw = localStorage.getItem(KEY);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === 'object' ? obj : {};
  } catch {
    return {};
  }
}

export function useMisDatos() {
  const [datos, setDatos] = useState(leer);

  // Sincroniza si se cambian en otra pestaña
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setDatos(leer());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /** Guarda (mezclando) solo las claves conocidas de Mis datos. */
  const guardar = useCallback((nuevos) => {
    const filtrados = Object.fromEntries(Object.entries(nuevos).filter(([k]) => NOMBRES.has(k)));
    const merged = { ...leer(), ...filtrados };
    try {
      localStorage.setItem(KEY, JSON.stringify(merged));
    } catch {
      /* modo privado o almacenamiento lleno: se ignora */
    }
    setDatos(merged);
  }, []);

  const borrar = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignorar */
    }
    setDatos({});
  }, []);

  const tieneDatos = Object.values(datos).some((v) => v);
  return { datos, guardar, borrar, tieneDatos };
}
