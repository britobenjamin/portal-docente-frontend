# Portal Docente Tucumán — Frontend

Web para docentes de Tucumán (ATEP): leyes docentes con buscador y filtros, formularios que se completan en la web y se descargan en PDF, y "Mis datos" guardados en el navegador.

**Stack:** React + Vite, Tailwind CSS, React Router, Fuse.js (búsqueda tolerante a errores y tildes), pdfmake (PDFs generados en el navegador).

## Correr en local

```bash
npm install
cp .env.example .env   # VITE_API_URL = URL del backend (portal-docente-backend)
npm run dev            # http://localhost:5173
```

La sección de leyes necesita el backend corriendo. Formularios y Mis datos funcionan sin backend.

## Formularios

Cada formulario es un JSON en `src/data/formularios/`. Para agregar uno nuevo se crea otro JSON con el mismo formato, sin tocar componentes.

- `layout: "nota"` (por defecto): nota oficial armada desde `plantilla` (lugar y fecha, destinatario, párrafos con `{{campo}}`, firma).
- `layout: "ddjj-cargos"`: Declaración Jurada de cargos del Ministerio de Educación (diseño propio en `src/lib/pdf/layouts/`).

## Deploy (Netlify)

`netlify.toml` ya incluye el build y la redirección de la SPA. En Netlify hay que configurar la variable `VITE_API_URL` con la URL del backend en Render.
