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

## Acceso demo (opcional)

Para mostrar el sistema sin loguearte a mano, se puede configurar una cuenta
demo que entra **automáticamente**: al pedir cualquier ruta protegida
(`/dashboard`, `/recursos`, etc.) sin sesión activa, en vez de redirigir a
`/login` inicia sesión con esa cuenta y sigue directo a la página pedida.

1. Creá un usuario en Supabase (**Authentication → Users → Add user**),
   tildando **Auto Confirm User**.
2. Dale un perfil en `profiles` con ese mismo UID (ver sección de roles):
   ```sql
   insert into public.profiles (id, nombre, apellido, email, role)
   values ('EL-UUID-DEL-USUARIO', 'Demo', 'Ingnala', 'demo@ingnala.com', 'rrhh');
   ```
3. En `.env.local`, agregá:
   ```
   DEMO_LOGIN_EMAIL=demo@ingnala.com
   DEMO_LOGIN_PASSWORD=la-contraseña-que-le-pusiste
   ```

Sin estas dos variables, el comportamiento es el de siempre (redirige a
`/login` y pide credenciales reales). Las credenciales de la cuenta demo
viven del lado del servidor y nunca llegan al navegador.

> ⚠️ **Con estas variables seteadas, cualquiera con la URL entra directo con
> la cuenta demo — sin login, sin excepción.** Es intencional para mostrar el
> sistema, pero por eso mismo: solo en un entorno de prueba/preview, nunca en
> una instancia con datos reales de la empresa.

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
