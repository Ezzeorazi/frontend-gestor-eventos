# Frontend Gestor de Eventos

Aplicación web creada con **React** y **Vite** para gestionar eventos e invitaciones.
Permite registrar usuarios, iniciar sesión y administrar un panel con métricas básicas
sobre los eventos y sus invitaciones. La interfaz utiliza **Tailwind CSS** y está
optimizada para dispositivos móviles.

## Requisitos

- Node.js >= 18
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:5173`.

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

Las peticiones al backend se realizan contra `http://localhost:5000/api`,
configurable en [`src/services/axios.js`](src/services/axios.js).

## Nimbus Assistant

Se añadió un asistente de IA lateral llamado **Nimbus Assistant**. El backend
expone los endpoints:

- `POST /api/ai/chat`: chat contextual con herramientas.
- `POST /api/ai/embed`: inserta embeddings (admin).

### Variables de entorno

Crear un archivo `.env` en la raíz del backend con:

```
OPENAI_API_KEY=...
LLM_PROVIDER=openai
GOOGLE_PLACES_API_KEY=...
JWT_SECRET=...
MONGODB_URI=...
```

### Ejecutar backend

```bash
cd backend
npm install
npm start
```

### Tests

```bash
cd backend
npm test
```

## Ejemplos de prompts

- `/email` Redactar mail cordial para cliente ACME.
- `/margen` Calcular margen de producto con costo 50 y precio 100.
- `/presupuesto` Crear presupuesto para cliente 123.
- `/buscar` Proveedores de catering cerca de Rosario.
