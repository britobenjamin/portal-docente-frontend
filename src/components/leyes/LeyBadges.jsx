import Badge from '../ui/Badge.jsx';
import { jurisdiccionLabel, tipoLabel } from '../../lib/format.js';

export default function LeyBadges({ ley, conCategorias = true }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant={ley.jurisdiccion === 'provincial' ? 'solid' : 'soft'}>{jurisdiccionLabel(ley.jurisdiccion)}</Badge>
      <Badge>{tipoLabel(ley.tipo)}</Badge>
      <Badge>{ley.anio}</Badge>
      {conCategorias &&
        ley.categorias.map((c) => (
          <Badge key={c.id} variant="muted">
            {c.nombre}
          </Badge>
        ))}
    </div>
  );
}
