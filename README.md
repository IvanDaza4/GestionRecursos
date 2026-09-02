# Recursos

Sistema de gestión y trazabilidad de recursos físicos (notebooks, teléfonos,
indumentaria y otros dispositivos) de la empresa: inventario, entregas,
devoluciones, empleados, solicitudes y auditoría.

Documenta el ciclo de vida completo de cada recurso — alta, entrega,
devolución y cambio de estado — con auditoría inmutable (`eventos_recurso`)
generada automáticamente por triggers en la base, no por la aplicación.

## Stack

- **Next.js 16** (App Router) + TypeScript + React 19
- **Supabase** (Postgres + Storage + Auth) como backend
- **Tailwind CSS v4** + CSS a medida (ver `app/globals.css`)

## Proyecto Supabase

La app ya está conectada a un proyecto Supabase real (`GestionRecursos`,
`fpfgxfnxkkpfwvkfuxpg`) con el esquema completo aplicado — ver
`supabase/migrations/0001_initial_schema.sql` para el detalle: tablas,
triggers de auditoría automática y políticas de Row Level Security.

`.env.local` (no versionado) ya tiene `NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_ANON_KEY` cargadas. Si necesitás recrearlo, copiá
`.env.local.example` y completá esos dos valores desde el dashboard de
Supabase (Project Settings → API).

### Cuenta demo

Para entrar sin crear un usuario propio:

- **Email:** `demo@ingnala.com`
- **Contraseña:** `Recursos2026!`

Tiene rol `rrhh`, que ya da acceso completo de lectura/escritura sobre
recursos, entregas, devoluciones, empleados y solicitudes por diseño de las
políticas RLS. También existe la cuenta real `implementaciones@ingnala.com.ar`
(rol `rrhh`) creada en una sesión anterior — su contraseña no se tocó.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción (incluye type-check)
npm run lint
```

## Estructura

- `app/login` — login con Supabase Auth
- `app/(app)/*` — módulos protegidos: dashboard, recursos (inventario),
  entregas, devoluciones, empleados, solicitudes, auditoría
- `components/layout/app-shell.tsx` — sidebar + topbar + navegación
- `components/<módulo>/*` — vista de lista + modal de alta por módulo
- `lib/data/*` — lecturas contra Supabase (Server Components)
- `lib/actions/*` — Server Actions (altas, entregas, devoluciones,
  aprobación de solicitudes)
- `lib/supabase/{client,server,proxy,types}.ts` — clientes de Supabase
  (browser/server), sesión en el proxy (`proxy.ts` — Next 16 renombró
  `middleware` a `proxy`), y tipos generados desde el esquema real
- `supabase/migrations/0001_initial_schema.sql` — esquema completo con RLS

## Roles

- **RRHH** / **Administrador** — gestión completa (recursos, entregas,
  devoluciones, empleados, solicitudes)
- **Jefe de área** — consulta acotada a su propia área (ver políticas RLS
  en la migración)

Los roles se gestionan en la tabla `profiles` y se aplican vía Row Level
Security en Postgres — no hay lógica de permisos duplicada en el frontend.

## Qué falta / próximos pasos

Esta primera pasada deja operativo el núcleo real (auth + los 7 módulos
con datos reales, sin mocks). Quedan afuera para iterar después:

- Revisión de fotos de evidencia ya subidas (hoy solo se suben, no hay
  galería de fotos históricas por entrega/devolución).
- Búsqueda de empleado "en vivo" al registrar una devolución (hoy es un
  `<select>` con todas las entregas activas; sirve para el volumen de un
  MVP, no escala a cientos de empleados).
- Reportes/exportables y gráficos de tendencia.
- Gestión de áreas y catálogo de tipos de recurso desde la UI (hoy se
  administran directo en Supabase).
