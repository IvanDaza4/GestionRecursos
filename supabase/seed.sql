-- ============================================================================
-- Datos de ejemplo para probar la app contra un proyecto Supabase real.
-- Correr DESPUÉS de 0001_initial_schema.sql.
--
-- Los usuarios (profiles) dependen de auth.users, que no se puede poblar por
-- SQL directo. Pasos:
--   1. Creá un usuario desde el dashboard de Supabase (Authentication > Users)
--      o con supabase.auth.signUp() desde la app.
--   2. Copiá su UUID y reemplazá 'REEMPLAZAR_CON_UUID_DEL_USUARIO' abajo.
--   3. Corré este script.
-- ============================================================================

-- Áreas
insert into public.areas (id, nombre, descripcion) values
  ('a0000000-0000-0000-0000-000000000001', 'Sistemas', 'Desarrollo, infraestructura y soporte'),
  ('a0000000-0000-0000-0000-000000000002', 'Recursos Humanos', 'Gestión de personal y recursos físicos'),
  ('a0000000-0000-0000-0000-000000000003', 'Ventas', 'Comercial y atención a clientes')
on conflict (id) do nothing;

-- Perfil de RRHH (reemplazar el id por un usuario real de auth.users)
insert into public.profiles (id, nombre, apellido, email, role, activo) values
  ('REEMPLAZAR_CON_UUID_DEL_USUARIO', 'Ana', 'Gómez', 'ana.gomez@ingnala.com', 'rrhh', true)
on conflict (id) do nothing;

-- Empleados
insert into public.empleados (id, nombre, apellido, legajo, email, area_id, puesto, fecha_ingreso) values
  ('e0000000-0000-0000-0000-000000000001', 'Martín', 'Pérez', 'LEG-1001', 'martin.perez@ingnala.com', 'a0000000-0000-0000-0000-000000000001', 'Desarrollador Backend', '2023-03-01'),
  ('e0000000-0000-0000-0000-000000000002', 'Lucía', 'Fernández', 'LEG-1002', 'lucia.fernandez@ingnala.com', 'a0000000-0000-0000-0000-000000000002', 'Analista de RRHH', '2022-07-15'),
  ('e0000000-0000-0000-0000-000000000003', 'Javier', 'Torres', 'LEG-1003', 'javier.torres@ingnala.com', 'a0000000-0000-0000-0000-000000000003', 'Ejecutivo de Ventas', '2024-01-10')
on conflict (id) do nothing;

-- Recursos (usa los tipos ya sembrados en la migración inicial)
insert into public.recursos (id, tipo_recurso_id, codigo_interno, marca, modelo, numero_serie, estado_actual, disponibilidad, fecha_alta)
select
  'r0000000-0000-0000-0000-000000000001',
  id, 'ING-NB-0001', 'Dell', 'Latitude 5420', 'SN-DL5420-001', 'muy_bueno', 'disponible', '2023-02-01'
from public.tipos_recurso where nombre = 'Notebook'
on conflict (id) do nothing;

insert into public.recursos (id, tipo_recurso_id, codigo_interno, marca, modelo, imei, estado_actual, disponibilidad, fecha_alta)
select
  'r0000000-0000-0000-0000-000000000002',
  id, 'ING-TEL-0001', 'Samsung', 'Galaxy A54', '355000000000001', 'bueno', 'disponible', '2023-06-15'
from public.tipos_recurso where nombre = 'Teléfono'
on conflict (id) do nothing;

insert into public.recursos (id, tipo_recurso_id, codigo_interno, marca, modelo, numero_serie, estado_actual, disponibilidad, fecha_alta)
select
  'r0000000-0000-0000-0000-000000000003',
  id, 'ING-NB-0002', 'Apple', 'MacBook Air M2', 'SN-MBA-002', 'regular', 'disponible', '2021-11-20'
from public.tipos_recurso where nombre = 'Notebook'
on conflict (id) do nothing;
