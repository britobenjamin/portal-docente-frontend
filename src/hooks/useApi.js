import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

/**
 * GET a la API con estados de carga/error.
 * `despertando` se activa si la respuesta tarda más de 4 s (Render free "dormido").
 */
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true, despertando: false });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!path) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null, despertando: false }));
    const timer = setTimeout(() => setState((s) => ({ ...s, despertando: true })), 4000);

    api(path, { signal: ctrl.signal })
      .then((data) => setState({ data, error: null, loading: false, despertando: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error, loading: false, despertando: false });
      })
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [path, intento]);

  return { ...state, reintentar: () => setIntento((n) => n + 1) };
}
