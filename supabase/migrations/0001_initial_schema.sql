-- ============================================================================
-- Ingnala S.A. — Sistema de Gestión y Trazabilidad de Recursos Físicos (RRHH)
-- Migración inicial: tipos, tablas, índices, triggers de auditoría y RLS.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensiones
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tipos enumerados
-- ----------------------------------------------------------------------------
create type public.user_role as enum ('rrhh', 'jefe_area', 'administrador');

create type public.estado_recurso as enum ('nuevo', 'muy_bueno', 'bueno', 'regular', 'danado');

create type public.disponibilidad_recurso as enum ('disponible', 'asignado', 'en_reparacion', 'baja');

create type public.estado_solicitud as enum ('pendiente', 'aprobada', 'entregada', 'rechazada');

create type public.tipo_foto as enum ('frontal', 'dorso', 'detalle', 'otro');

create type public.tipo_evento as enum (
  'alta_recurso', 'entrega', 'devolucion', 'reparacion',
  'cambio_estado', 'baja_recurso', 'solicitud_creada', 'solicitud_resuelta'
);

create type public.comparacion_estado as enum ('mejoro', 'igual', 'empeoro');

-- ----------------------------------------------------------------------------
-- Función utilitaria: mantiene fecha_actualizacion en cada UPDATE
-- ----------------------------------------------------------------------------
create or replace function public.set_fecha_actualizacion()
returns trigger
language plpgsql
as $$
begin
  new.fecha_actualizacion = now();
  return new;
end;
$$;

-- ============================================================================
-- TABLA: areas
-- ============================================================================
create table public.areas (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null unique,
  descripcion       text,
  responsable_id    uuid, -- FK a profiles agregada más abajo (dependencia circular)
  activo            boolean not null default true,
  creado_por        uuid,
  fecha_creacion    timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now()
);

create trigger trg_areas_updated_at
  before update on public.areas
  for each row execute function public.set_fecha_actualizacion();

-- ============================================================================
-- TABLA: profiles (extiende auth.users)
-- ============================================================================
create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  nombre            text not null,
  apellido          text not null,
  email             text not null unique,
  role              public.user_role not null default 'rrhh',
  area_id           uuid references public.areas(id), -- relevante para 'jefe_area'
  activo            boolean not null default true,
  creado_por        uuid references public.profiles(id),
  fecha_creacion    timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now()
);

alter table public.areas
  add constraint fk_areas_responsable foreign key (responsable_id)
  references public.profiles(id);

alter table public.areas
  add constraint fk_areas_creado_por foreign key (creado_por)
  references public.profiles(id);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_fecha_actualizacion();

-- ----------------------------------------------------------------------------
-- Funciones helper para RLS (SECURITY DEFINER evita recursión sobre profiles)
-- ----------------------------------------------------------------------------
create or replace function public.current_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_area()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select area_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_rrhh_or_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.current_role() in ('rrhh', 'administrador');
$$;

-- ============================================================================
-- TABLA: empleados
-- ============================================================================
create table public.empleados (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null,
  apellido          text not null,
  legajo            text unique,
  email             text,
  area_id           uuid references public.areas(id),
  puesto            text,
  fecha_ingreso     date,
  activo            boolean not null default true, -- baja lógica (soft delete)
  fecha_baja        date,
  motivo_baja       text,
  creado_por        uuid references public.profiles(id),
  fecha_creacion    timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now()
);

create index idx_empleados_area on public.empleados(area_id);
create index idx_empleados_activo on public.empleados(activo);

create trigger trg_empleados_updated_at
  before update on public.empleados
  for each row execute function public.set_fecha_actualizacion();

-- ============================================================================
-- TABLA: tipos_recurso (catálogo)
-- ============================================================================
create table public.tipos_recurso (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null unique, -- Notebook, Teléfono, Indumentaria, Periférico, Otro
  categoria         text not null default 'electronico', -- electronico | indumentaria | otro
  requiere_serie    boolean not null default true,
  requiere_imei     boolean not null default false,
  activo            boolean not null default true,
  fecha_creacion    timestamptz not null default now()
);

-- ============================================================================
-- TABLA: recursos
-- ============================================================================
create table public.recursos (
  id                uuid primary key default gen_random_uuid(),
  tipo_recurso_id   uuid not null references public.tipos_recurso(id),
  codigo_interno    text unique, -- tag de inventario (ej. ING-NB-0042)
  marca             text,
  modelo            text,
  numero_serie      text,
  imei              text,
  descripcion       text,
  estado_actual     public.estado_recurso not null default 'nuevo',
  disponibilidad    public.disponibilidad_recurso not null default 'disponible',
  fecha_alta        date not null default current_date,
  activo            boolean not null default true, -- baja lógica
  fecha_baja        date,
  motivo_baja       text,
  creado_por        uuid references public.profiles(id),
  fecha_creacion    timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now()
);

create unique index uq_recursos_numero_serie on public.recursos(numero_serie)
  where numero_serie is not null and numero_serie <> '';
create index idx_recursos_tipo on public.recursos(tipo_recurso_id);
create index idx_recursos_disponibilidad on public.recursos(disponibilidad);
create index idx_recursos_activo on public.recursos(activo);

create trigger trg_recursos_updated_at
  before update on public.recursos
  for each row execute function public.set_fecha_actualizacion();

-- ============================================================================
-- TABLA: entregas
-- ============================================================================
create table public.entregas (
  id                uuid primary key default gen_random_uuid(),
  recurso_id        uuid not null references public.recursos(id),
  empleado_id       uuid not null references public.empleados(id),
  area_id           uuid references public.areas(id), -- snapshot del área al momento de entregar
  entregado_por     uuid not null references public.profiles(id),
  fecha_entrega     timestamptz not null default now(),
  estado_entrega    public.estado_recurso not null,
  observaciones     text,
  aceptado          boolean not null default false,
  fecha_aceptacion  timestamptz,
  firma_url         text, -- firma digital o comprobante de aceptación
  activo            boolean not null default true, -- anulación lógica
  creado_por        uuid references public.profiles(id),
  fecha_creacion    timestamptz not null default now()
);

create index idx_entregas_recurso on public.entregas(recurso_id);
create index idx_entregas_empleado on public.entregas(empleado_id);
create index idx_entregas_area on public.entregas(area_id);
create index idx_entregas_fecha on public.entregas(fecha_entrega desc);

-- ============================================================================
-- TABLA: entrega_fotos
-- ============================================================================
create table public.entrega_fotos (
  id                uuid primary key default gen_random_uuid(),
  entrega_id        uuid not null references public.entregas(id) on delete cascade,
  tipo_foto         public.tipo_foto not null,
  url               text not null,
  orden             smallint not null default 0,
  fecha_creacion    timestamptz not null default now()
);

create index idx_entrega_fotos_entrega on public.entrega_fotos(entrega_id);

-- ============================================================================
-- TABLA: devoluciones
-- ============================================================================
create table public.devoluciones (
  id                  uuid primary key default gen_random_uuid(),
  entrega_id          uuid references public.entregas(id), -- entrega de origen (si se conoce)
  recurso_id          uuid not null references public.recursos(id),
  empleado_id         uuid not null references public.empleados(id),
  recibido_por        uuid not null references public.profiles(id),
  fecha_devolucion    timestamptz not null default now(),
  estado_devolucion   public.estado_recurso not null,
  comparacion_resultado public.comparacion_estado,
  observaciones       text,
  activo              boolean not null default true,
  creado_por          uuid references public.profiles(id),
  fecha_creacion      timestamptz not null default now()
);

create index idx_devoluciones_recurso on public.devoluciones(recurso_id);
create index idx_devoluciones_empleado on public.devoluciones(empleado_id);
create index idx_devoluciones_entrega on public.devoluciones(entrega_id);

-- ============================================================================
-- TABLA: devolucion_fotos
-- ============================================================================
create table public.devolucion_fotos (
  id                uuid primary key default gen_random_uuid(),
  devolucion_id     uuid not null references public.devoluciones(id) on delete cascade,
  tipo_foto         public.tipo_foto not null,
  url               text not null,
  orden             smallint not null default 0,
  fecha_creacion    timestamptz not null default now()
);

create index idx_devolucion_fotos_devolucion on public.devolucion_fotos(devolucion_id);

-- ============================================================================
-- TABLA: solicitudes
-- ============================================================================
create table public.solicitudes (
  id                uuid primary key default gen_random_uuid(),
  empleado_id       uuid not null references public.empleados(id),
  area_id           uuid references public.areas(id),
  tipo_recurso_id   uuid references public.tipos_recurso(id),
  descripcion       text,
  estado            public.estado_solicitud not null default 'pendiente',
  solicitado_por    uuid references public.profiles(id),
  aprobado_por      uuid references public.profiles(id),
  entrega_id        uuid references public.entregas(id), -- se vincula al concretarse
  fecha_solicitud   timestamptz not null default now(),
  fecha_resolucion  timestamptz,
  observaciones     text,
  creado_por        uuid references public.profiles(id),
  fecha_creacion    timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now()
);

create index idx_solicitudes_estado on public.solicitudes(estado);
create index idx_solicitudes_area on public.solicitudes(area_id);
create index idx_solicitudes_empleado on public.solicitudes(empleado_id);

create trigger trg_solicitudes_updated_at
  before update on public.solicitudes
  for each row execute function public.set_fecha_actualizacion();

-- ============================================================================
-- TABLA: eventos_recurso (línea de tiempo / auditoría append-only)
-- ============================================================================
create table public.eventos_recurso (
  id                uuid primary key default gen_random_uuid(),
  recurso_id        uuid not null references public.recursos(id),
  tipo_evento       public.tipo_evento not null,
  referencia_tabla  text,
  referencia_id     uuid,
  descripcion       text,
  actor_id          uuid references public.profiles(id),
  metadata          jsonb,
  fecha_evento      timestamptz not null default now()
);

create index idx_eventos_recurso_recurso on public.eventos_recurso(recurso_id, fecha_evento desc);

-- ----------------------------------------------------------------------------
-- Triggers que alimentan eventos_recurso automáticamente (no se puede omitir
-- desde la app: garantiza trazabilidad real).
-- ----------------------------------------------------------------------------
create or replace function public.fn_log_evento_alta_recurso()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.eventos_recurso (recurso_id, tipo_evento, referencia_tabla, referencia_id, descripcion, actor_id)
  values (new.id, 'alta_recurso', 'recursos', new.id, 'Alta de recurso en inventario', new.creado_por);
  return new;
end;
$$;

create trigger trg_recursos_alta_evento
  after insert on public.recursos
  for each row execute function public.fn_log_evento_alta_recurso();

create or replace function public.fn_log_evento_baja_recurso()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.activo = true and new.activo = false then
    insert into public.eventos_recurso (recurso_id, tipo_evento, referencia_tabla, referencia_id, descripcion, actor_id)
    values (new.id, 'baja_recurso', 'recursos', new.id, coalesce(new.motivo_baja, 'Baja de recurso'), auth.uid());
  elsif old.estado_actual is distinct from new.estado_actual then
    insert into public.eventos_recurso (recurso_id, tipo_evento, referencia_tabla, referencia_id, descripcion, actor_id)
    values (new.id, 'cambio_estado', 'recursos', new.id,
      format('Estado actualizado de %s a %s', old.estado_actual, new.estado_actual), auth.uid());
  end if;
  return new;
end;
$$;

create trigger trg_recursos_cambio_evento
  after update on public.recursos
  for each row execute function public.fn_log_evento_baja_recurso();

create or replace function public.fn_log_evento_entrega()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.eventos_recurso (recurso_id, tipo_evento, referencia_tabla, referencia_id, descripcion, actor_id)
  values (new.recurso_id, 'entrega', 'entregas', new.id,
    format('Entrega registrada (estado: %s)', new.estado_entrega), new.entregado_por);

  update public.recursos
    set disponibilidad = 'asignado', estado_actual = new.estado_entrega
    where id = new.recurso_id;

  return new;
end;
$$;

create trigger trg_entregas_evento
  after insert on public.entregas
  for each row execute function public.fn_log_evento_entrega();

create or replace function public.fn_log_evento_devolucion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_estado_entrega public.estado_recurso;
  v_rank_entrega int;
  v_rank_devolucion int;
begin
  if new.entrega_id is not null then
    select estado_entrega into v_estado_entrega from public.entregas where id = new.entrega_id;

    -- Escala de condición: nuevo(5) > muy_bueno(4) > bueno(3) > regular(2) > danado(1)
    v_rank_entrega := case v_estado_entrega
      when 'nuevo' then 5 when 'muy_bueno' then 4 when 'bueno' then 3
      when 'regular' then 2 when 'danado' then 1 end;
    v_rank_devolucion := case new.estado_devolucion
      when 'nuevo' then 5 when 'muy_bueno' then 4 when 'bueno' then 3
      when 'regular' then 2 when 'danado' then 1 end;

    new.comparacion_resultado := case
      when v_rank_devolucion < v_rank_entrega then 'empeoro'
      when v_rank_devolucion > v_rank_entrega then 'mejoro'
      else 'igual'
    end;
  end if;

  insert into public.eventos_recurso (recurso_id, tipo_evento, referencia_tabla, referencia_id, descripcion, actor_id)
  values (new.recurso_id, 'devolucion', 'devoluciones', new.id,
    format('Devolución registrada (estado: %s)', new.estado_devolucion), new.recibido_por);

  update public.recursos
    set disponibilidad = 'disponible', estado_actual = new.estado_devolucion
    where id = new.recurso_id;

  return new;
end;
$$;

create trigger trg_devoluciones_evento
  before insert on public.devoluciones
  for each row execute function public.fn_log_evento_devolucion();

-- Nota: las solicitudes no tienen un recurso físico asignado hasta que se
-- concretan en una entrega, por lo que sólo generan evento en eventos_recurso
-- (tabla indexada por recurso_id) una vez vinculadas a una entrega.
create or replace function public.fn_log_evento_solicitud_resuelta()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.estado is distinct from new.estado and new.entrega_id is not null then
    insert into public.eventos_recurso (recurso_id, tipo_evento, referencia_tabla, referencia_id, descripcion, actor_id)
    select e.recurso_id, 'solicitud_resuelta', 'solicitudes', new.id,
           format('Solicitud actualizada a %s', new.estado), new.aprobado_por
    from public.entregas e where e.id = new.entrega_id;
  end if;
  return new;
end;
$$;

create trigger trg_solicitudes_evento
  after update on public.solicitudes
  for each row execute function public.fn_log_evento_solicitud_resuelta();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.areas enable row level security;
alter table public.profiles enable row level security;
alter table public.empleados enable row level security;
alter table public.tipos_recurso enable row level security;
alter table public.recursos enable row level security;
alter table public.entregas enable row level security;
alter table public.entrega_fotos enable row level security;
alter table public.devoluciones enable row level security;
alter table public.devolucion_fotos enable row level security;
alter table public.solicitudes enable row level security;
alter table public.eventos_recurso enable row level security;

-- No hay borrado físico: se revoca DELETE para todos los roles de app.
revoke delete on public.areas, public.profiles, public.empleados, public.tipos_recurso,
  public.recursos, public.entregas, public.entrega_fotos, public.devoluciones,
  public.devolucion_fotos, public.solicitudes, public.eventos_recurso
  from authenticated, anon;

-- ---------------------------------------------------------------- profiles --
create policy "profiles_select_propio_o_gestion" on public.profiles
  for select using (id = auth.uid() or public.is_rrhh_or_admin());

create policy "profiles_insert_admin" on public.profiles
  for insert with check (public.current_role() = 'administrador');

create policy "profiles_update_propio_o_admin" on public.profiles
  for update using (id = auth.uid() or public.current_role() = 'administrador');

-- ------------------------------------------------------------------ areas --
create policy "areas_select_autenticados" on public.areas
  for select using (auth.uid() is not null);

create policy "areas_insert_rrhh_admin" on public.areas
  for insert with check (public.is_rrhh_or_admin());

create policy "areas_update_rrhh_admin" on public.areas
  for update using (public.is_rrhh_or_admin());

-- -------------------------------------------------------------- empleados --
create policy "empleados_select_scope" on public.empleados
  for select using (
    public.is_rrhh_or_admin()
    or (public.current_role() = 'jefe_area' and area_id = public.current_area())
  );

create policy "empleados_insert_rrhh_admin" on public.empleados
  for insert with check (public.is_rrhh_or_admin());

create policy "empleados_update_rrhh_admin" on public.empleados
  for update using (public.is_rrhh_or_admin());

-- ---------------------------------------------------------- tipos_recurso --
create policy "tipos_recurso_select_autenticados" on public.tipos_recurso
  for select using (auth.uid() is not null);

create policy "tipos_recurso_insert_rrhh_admin" on public.tipos_recurso
  for insert with check (public.is_rrhh_or_admin());

create policy "tipos_recurso_update_rrhh_admin" on public.tipos_recurso
  for update using (public.is_rrhh_or_admin());

-- ------------------------------------------------------------------ recursos
create policy "recursos_select_autenticados" on public.recursos
  for select using (auth.uid() is not null);

create policy "recursos_insert_rrhh_admin" on public.recursos
  for insert with check (public.is_rrhh_or_admin());

create policy "recursos_update_rrhh_admin" on public.recursos
  for update using (public.is_rrhh_or_admin());

-- ------------------------------------------------------------------ entregas
create policy "entregas_select_scope" on public.entregas
  for select using (
    public.is_rrhh_or_admin()
    or (public.current_role() = 'jefe_area' and area_id = public.current_area())
  );

create policy "entregas_insert_rrhh_admin" on public.entregas
  for insert with check (public.is_rrhh_or_admin());

create policy "entregas_update_rrhh_admin" on public.entregas
  for update using (public.is_rrhh_or_admin());

-- ------------------------------------------------------------ entrega_fotos
create policy "entrega_fotos_select_scope" on public.entrega_fotos
  for select using (
    exists (
      select 1 from public.entregas e
      where e.id = entrega_fotos.entrega_id
        and (
          public.is_rrhh_or_admin()
          or (public.current_role() = 'jefe_area' and e.area_id = public.current_area())
        )
    )
  );

create policy "entrega_fotos_insert_rrhh_admin" on public.entrega_fotos
  for insert with check (public.is_rrhh_or_admin());

-- --------------------------------------------------------------- devoluciones
create policy "devoluciones_select_scope" on public.devoluciones
  for select using (
    public.is_rrhh_or_admin()
    or (
      public.current_role() = 'jefe_area'
      and exists (
        select 1 from public.empleados emp
        where emp.id = devoluciones.empleado_id and emp.area_id = public.current_area()
      )
    )
  );

create policy "devoluciones_insert_rrhh_admin" on public.devoluciones
  for insert with check (public.is_rrhh_or_admin());

create policy "devoluciones_update_rrhh_admin" on public.devoluciones
  for update using (public.is_rrhh_or_admin());

-- ---------------------------------------------------------- devolucion_fotos
create policy "devolucion_fotos_select_scope" on public.devolucion_fotos
  for select using (
    exists (
      select 1 from public.devoluciones d
      join public.empleados emp on emp.id = d.empleado_id
      where d.id = devolucion_fotos.devolucion_id
        and (
          public.is_rrhh_or_admin()
          or (public.current_role() = 'jefe_area' and emp.area_id = public.current_area())
        )
    )
  );

create policy "devolucion_fotos_insert_rrhh_admin" on public.devolucion_fotos
  for insert with check (public.is_rrhh_or_admin());

-- ----------------------------------------------------------------- solicitudes
create policy "solicitudes_select_scope" on public.solicitudes
  for select using (
    public.is_rrhh_or_admin()
    or (public.current_role() = 'jefe_area' and area_id = public.current_area())
  );

create policy "solicitudes_insert_rrhh_jefe" on public.solicitudes
  for insert with check (
    public.is_rrhh_or_admin()
    or (public.current_role() = 'jefe_area' and area_id = public.current_area())
  );

create policy "solicitudes_update_rrhh_admin" on public.solicitudes
  for update using (public.is_rrhh_or_admin());

-- ------------------------------------------------------------- eventos_recurso
create policy "eventos_recurso_select_scope" on public.eventos_recurso
  for select using (
    public.is_rrhh_or_admin()
    or public.current_role() = 'jefe_area' -- lectura amplia; se puede acotar por recurso más adelante
  );

-- Los eventos sólo se insertan vía funciones SECURITY DEFINER (triggers).

-- ============================================================================
-- STORAGE: bucket para fotos de recursos
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('recursos-fotos', 'recursos-fotos', false)
on conflict (id) do nothing;

create policy "recursos_fotos_select_autenticados" on storage.objects
  for select using (bucket_id = 'recursos-fotos' and auth.uid() is not null);

create policy "recursos_fotos_insert_rrhh_admin" on storage.objects
  for insert with check (bucket_id = 'recursos-fotos' and public.is_rrhh_or_admin());

create policy "recursos_fotos_update_rrhh_admin" on storage.objects
  for update using (bucket_id = 'recursos-fotos' and public.is_rrhh_or_admin());

-- ============================================================================
-- Catálogo inicial de tipos de recurso
-- ============================================================================
insert into public.tipos_recurso (nombre, categoria, requiere_serie, requiere_imei) values
  ('Notebook', 'electronico', true, false),
  ('Teléfono', 'electronico', true, true),
  ('Monitor', 'electronico', true, false),
  ('Periférico', 'electronico', false, false),
  ('Indumentaria', 'indumentaria', false, false),
  ('Otro', 'otro', false, false);
