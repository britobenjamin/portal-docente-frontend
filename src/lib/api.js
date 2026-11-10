export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

/** Modo demostración: el front funciona sin backend con datos de ejemplo (src/data/demo). */
export const DEMO = import.meta.env.VITE_DEMO === 'true';

export class ApiError extends Error {
  constructor(status, message, detalles) {
    super(message);
    this.status = status;
    this.detalles = detalles;
  }
}

/** fetch con base URL, JSON y mensajes de error legibles. */
export async function api(path, { signal, ...opts } = {}) {
  if (DEMO) {
    const { demoApi } = await import('./demoApi.js');
    try {
      return await demoApi(path);
    } catch (err) {
      throw new ApiError(err.status ?? 500, err.message);
    }
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { signal, ...opts });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(0, 'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || 'Ocurrió un error inesperado.', data?.detalles);
  }
  return data;
}
