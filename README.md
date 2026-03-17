# Dashboard de Impacto del Curso de IA 2025

Dashboard ejecutivo (SPA) en **Next.js App Router** con **TypeScript**, **Tailwind**, **shadcn/ui**, **Recharts**, **Framer Motion** y **Lucide**.  
Los datos están **hardcodeados** en `lib/data.ts` (sin APIs).

## Ejecutar

Requisitos: Node.js 18+.

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Estructura

- `app/`: App Router (`layout.tsx`, `page.tsx`, `globals.css`)
- `components/`: UI del dashboard (cards, filtros, etc.)
- `components/ui/`: componentes estilo shadcn/ui (Radix)
- `lib/`: datos, analítica y extracción de temas
- `types/`: tipos de encuesta

