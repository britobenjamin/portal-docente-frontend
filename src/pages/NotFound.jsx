import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle.js';

export default function NotFound({ mensaje = 'La página que buscás no existe o fue movida.' }) {
  useTitle('Página no encontrada');
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">No encontramos lo que buscás</h1>
      <p className="mt-2 max-w-md text-ink/70">{mensaje}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          Ir al inicio
        </Link>
        <Link to="/leyes" className="btn-outline">
          Ver leyes
        </Link>
      </div>
    </div>
  );
}
