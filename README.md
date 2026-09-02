# Recursos Ingnala

Sistema de gestión y trazabilidad de recursos físicos (notebooks, teléfonos,
indumentaria y otros dispositivos) para el sector de RRHH de Ingnala S.A.

Documenta el ciclo de vida completo de cada recurso — alta, entrega,
devolución, reparación y baja — con evidencia fotográfica obligatoria y
auditoría inmutable, para eliminar las disputas por daños no registrados.

## Stack

- **Next.js 16** (App Router) + TypeScript + React 19
- **Framer Motion** (`motion/react`) para todas las transiciones e interacciones
- **Supabase** (Postgres + Storage + Auth) como backend
- **Tailwind CSS v4** con un sistema de diseño propio (ver `docs/design-system.md`)

## Poner en marcha un proyecto de Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Corré la migración inicial: `supabase/migrations/0001_initial_schema.sql`
   (SQL Editor del dashboard, o `supabase db push` con la CLI).
3. Opcional — datos de ejemplo: seguí las instrucciones en
   `supabase/seed.sql` (requiere crear primero un usuario vía Auth).
4. Copiá `.env.local.example` a `.env.local` y completá:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Sin estas variables, la app corre igual (`npm run dev`) mostrando el sistema
de diseño y la navegación, con un aviso de "conectá un proyecto" en lugar de
datos reales.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción (incluye type-check)
npm run lint
```

## Estructura

- `app/(auth)/login` — login con Supabase Auth
- `app/(app)/*` — módulos protegidos: dashboard, recursos, entregas,
  devoluciones, empleados, solicitudes, reportes, administración
- `components/wizard/*` — wizard de entrega/devolución (pasos + animaciones)
- `components/resources/*` — ficha de recurso ("pasaporte del dispositivo")
  con timeline animado
- `components/dashboard/*` — indicadores y gráficos del dashboard de RRHH
- `lib/data/*` — acceso a datos (Server Components)
- `lib/actions/*` — Server Actions (mutaciones)
- `lib/supabase/*` — clientes de Supabase (browser/server) y tipos
- `supabase/migrations/0001_initial_schema.sql` — esquema completo con RLS
- `docs/design-system.md` — tokens del sistema de diseño

## Roles

- **RRHH** — gestión completa (recursos, entregas, devoluciones, solicitudes)
- **Jefe de área** — consulta de su propio equipo
- **Administrador** — gestión completa + usuarios y catálogos

Los roles se gestionan en la tabla `profiles` y se aplican vía Row Level
Security en Postgres (ver la migración).
