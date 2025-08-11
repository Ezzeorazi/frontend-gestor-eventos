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
