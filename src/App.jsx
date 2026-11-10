import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import Inicio from './pages/Inicio.jsx';
import Leyes from './pages/Leyes.jsx';
import LeyDetalle from './pages/LeyDetalle.jsx';
import Formularios from './pages/Formularios.jsx';
import FormularioCompletar from './pages/FormularioCompletar.jsx';
import MisDatos from './pages/MisDatos.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Inicio />} />
        <Route path="leyes" element={<Leyes />} />
        <Route path="leyes/:slug" element={<LeyDetalle />} />
        <Route path="formularios" element={<Formularios />} />
        <Route path="formularios/:slug" element={<FormularioCompletar />} />
        <Route path="mis-datos" element={<MisDatos />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
