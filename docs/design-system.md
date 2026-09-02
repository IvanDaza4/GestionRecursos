# Sistema de diseño — Ingnala S.A. · Gestión de Recursos

Propuesta de tokens visuales. Dirección: dashboard técnico premium en tema
oscuro con acento cian eléctrico (referencia: Linear / Vercel / Raycast),
no un panel administrativo genérico.

## 1. Color

### 1.1 Superficies (profundidad por capas, sin sombras duras)

| Token              | Hex       | Uso                                          |
|--------------------|-----------|-----------------------------------------------|
| `--bg-base`        | `#0A0B0D` | Fondo de la app (body)                        |
| `--bg-surface`     | `#111318` | Paneles, sidebar, header                      |
| `--bg-card`        | `#15171C` | Tarjetas (recurso, entrega, empleado)         |
| `--bg-elevated`    | `#1B1E24` | Modales, drawers, dropdowns, popovers         |
| `--bg-hover`       | `#1D2028` | Estado hover sobre filas/tarjetas             |

### 1.2 Bordes

| Token              | Valor                      | Uso                              |
|--------------------|-----------------------------|-----------------------------------|
| `--border-subtle`  | `rgba(255,255,255,0.06)`   | Separadores internos              |
| `--border-default` | `rgba(255,255,255,0.10)`   | Bordes de tarjetas/inputs         |
| `--border-strong`  | `rgba(255,255,255,0.16)`   | Bordes en foco/hover               |
| `--border-accent`  | `rgba(34,211,238,0.35)`    | Borde de elemento activo/seleccionado |

### 1.3 Acento primario — cian eléctrico

| Token           | Hex       | Uso                                             |
|-----------------|-----------|--------------------------------------------------|
| `--accent-50`   | `#E6FDFF` | Texto sobre fondo de acento sólido               |
| `--accent-300`  | `#67E8F9` | Hover de texto/íconos con acento                 |
| `--accent-400`  | `#22D3EE` | Acento base — CTAs, focos, estados activos       |
| `--accent-500`  | `#00E5FF` | Acento intenso — glow, indicadores de progreso   |
| `--accent-600`  | `#0BA5C7` | Texto de acento sobre fondos claros (raro)       |

Uso con moderación: 1 CTA principal por vista, estado activo de nav,
foco de inputs, barra de progreso del wizard, glow puntual.

**Glow de acento** (para elementos activos/focales, no decorativo global):
```css
--glow-accent: 0 0 0 1px rgba(34,211,238,0.25), 0 0 24px -4px rgba(0,229,255,0.35);
```

### 1.4 Estados semánticos — condición del recurso

Escala de 5 niveles agrupada por temperatura de color (nunca semáforo
Bootstrap genérico). Cian-verde para condición óptima, ámbar para
intermedia, coral para dañado — dentro de la misma temperatura general
del sistema (evita verde/rojo puros).

| Estado       | Token                | Hex       | Texto sobre badge |
|--------------|-----------------------|-----------|--------------------|
| Nuevo        | `--state-nuevo`       | `#2DD4BF` | `#04211D`          |
| Muy bueno    | `--state-muy-bueno`   | `#5EEAD4` | `#062621`          |
| Bueno        | `--state-bueno`       | `#FBBF24` | `#2B1B02`          |
| Regular      | `--state-regular`     | `#F0973D` | `#2B1802`          |
| Dañado       | `--state-danado`      | `#FB6F6F` | `#2B0A0A`          |

Cada estado tiene una variante `-bg` (fondo del badge) a 12% de opacidad
sobre `--bg-card`, ej. `--state-nuevo-bg: rgba(45,212,191,0.12)`.

Comparación entrega→devolución: `mejoro` usa `--state-nuevo`,
`igual` usa `--text-secondary`, `empeoro` usa `--state-danado` con
animación de énfasis (ver sección animación).

### 1.5 Texto

| Token                | Hex       | Uso                          |
|-----------------------|-----------|-------------------------------|
| `--text-primary`     | `#F5F7FA` | Títulos, texto principal      |
| `--text-secondary`   | `#9AA3AF` | Subtítulos, metadata          |
| `--text-tertiary`    | `#6B7280` | Placeholders, texto deshabilitado |
| `--text-on-accent`   | `#04191C` | Texto sobre botón de acento sólido |

## 2. Tipografía

- **Familia UI:** Geist Sans (`next/font/google` → `Geist`), fallback `system-ui`.
- **Familia datos/mono:** Geist Mono, para IDs, números de serie, IMEI,
  fechas y montos — con `font-variant-numeric: tabular-nums`.

| Token         | Tamaño / Alto | Peso | Tracking  | Uso                          |
|---------------|----------------|------|-----------|-------------------------------|
| `display`     | 32px / 40px    | 700  | -0.02em   | Título de dashboard            |
| `h1`          | 26px / 32px    | 700  | -0.015em  | Título de módulo               |
| `h2`          | 20px / 28px    | 600  | -0.01em   | Título de sección/tarjeta      |
| `h3`          | 16px / 24px    | 600  | 0         | Subtítulo, encabezado de card  |
| `body`        | 14px / 20px    | 400  | 0         | Texto general                  |
| `body-strong` | 14px / 20px    | 600  | 0         | Énfasis en línea               |
| `caption`     | 12px / 16px    | 500  | 0.01em    | Metadata, etiquetas, badges    |
| `mono-data`   | 13px / 20px    | 500  | 0         | Números de serie, IDs, fechas  |

## 3. Espaciado y radios

Escala base 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

| Token         | Valor | Uso                                    |
|---------------|-------|------------------------------------------|
| `--radius-xs` | 4px   | Badges, chips                            |
| `--radius-sm` | 8px   | Botones, inputs                          |
| `--radius-md` | 12px  | Tarjetas                                 |
| `--radius-lg` | 16px  | Paneles, modales                         |
| `--radius-xl` | 24px  | Contenedores de wizard / hero            |
| `--radius-full` | 999px | Avatares, indicadores circulares       |

## 4. Elevación (sin sombras genéricas `shadow-md`)

Cada nivel combina un borde sutil + sombra oscura difusa (no shadow gris
plano), para que la profundidad venga del contraste de superficie:

```css
--elevation-1: 0 1px 2px rgba(0,0,0,0.4);                 /* tarjeta en reposo */
--elevation-2: 0 4px 16px rgba(0,0,0,0.5);                /* tarjeta hover/dropdown */
--elevation-3: 0 12px 40px rgba(0,0,0,0.6);               /* modal/drawer */
```

## 5. Iconografía

`lucide-react`, stroke-width 1.75, tamaño 16/20 según contexto. Nunca
emojis como iconos funcionales (sí se permite un emoji puntual en
copy informal, no en UI de acción).

## 6. Animación (tokens de movimiento, para Framer Motion)

| Token                | Valor                                   | Uso                                  |
|-----------------------|------------------------------------------|----------------------------------------|
| `spring-snappy`      | `{ type: "spring", stiffness: 420, damping: 32 }` | Micro-interacciones, hover/tap |
| `spring-panel`       | `{ type: "spring", stiffness: 300, damping: 30 }` | Modales, drawers, wizard steps |
| `spring-list`        | `{ type: "spring", stiffness: 260, damping: 26 }` | Entrada/salida de filas de lista |
| `stagger-list`       | `staggerChildren: 0.035, delayChildren: 0.05`     | Listas/tablas al montar |
| `duration-fade`      | `0.18s ease-out`                         | Fades simples (overlays)              |

## 7. Ejemplo de implementación (Tailwind v4 / CSS variables)

`app/globals.css` (a crear en el scaffold):

```css
:root {
  --bg-base: #0A0B0D;
  --bg-surface: #111318;
  --bg-card: #15171C;
  --bg-elevated: #1B1E24;
  --accent-400: #22D3EE;
  --accent-500: #00E5FF;
  --state-nuevo: #2DD4BF;
  --state-muy-bueno: #5EEAD4;
  --state-bueno: #FBBF24;
  --state-regular: #F0973D;
  --state-danado: #FB6F6F;
  --text-primary: #F5F7FA;
  --text-secondary: #9AA3AF;
  --text-tertiary: #6B7280;
  --border-default: rgba(255,255,255,0.10);
  --radius-md: 12px;
}
```

`tailwind.config.ts` referenciará estas variables (`colors: { bg: { base: 'var(--bg-base)', ... } }`)
para que Tailwind y el sistema de diseño queden como una sola fuente de verdad.

---

**Pendiente de validación antes de generar componentes:** confirmar esta
paleta y escala tipográfica, o ajustar antes de scaffolding el proyecto
Next.js y los componentes base.
