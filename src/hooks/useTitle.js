import { useEffect } from 'react';

const BASE = 'Portal Docente Tucumán · ATEP';

export function useTitle(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | ${BASE}` : BASE;
  }, [titulo]);
}
