import { createClient } from "@/lib/supabase/server";
import type { EstadoRecurso } from "@/lib/constants";
import type { ComparacionEstado } from "@/lib/supabase/types";
import type { EntregaActivaOption } from "@/components/wizard/types";

interface RecursoResumen {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  tipo_recurso: { nombre: string } | null;
}

interface EmpleadoResumen {
  id: string;
  nombre: string;
  apellido: string;
}

export interface EntregaConDetalle {
  id: string;
  fecha_entrega: string;
  estado_entrega: EstadoRecurso;
  aceptado: boolean;
  recurso: RecursoResumen | null;
  empleado: EmpleadoResumen | null;
}

export async function getEntregas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entregas")
    .select(
      "id, fecha_entrega, estado_entrega, aceptado, recurso:recursos(id, marca, modelo, codigo_interno, tipo_recurso:tipos_recurso(nombre)), empleado:empleados(id, nombre, apellido)",
    )
    .order("fecha_entrega", { ascending: false })
    .limit(100)
    .returns<EntregaConDetalle[]>();

  if (error) throw error;
  return data;
}

interface RecursoAsignado {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  numero_serie: string | null;
  estado_actual: EstadoRecurso;
  tipo_recurso: { nombre: string } | null;
}

interface EntregaVigente {
  id: string;
  recurso_id: string;
  fecha_entrega: string;
  estado_entrega: EstadoRecurso;
  empleado: {
    id: string;
    nombre: string;
    apellido: string;
    legajo: string | null;
    area: { id: string; nombre: string } | null;
  } | null;
}

/** Recursos actualmente asignados, con la entrega vigente de cada uno (para el wizard de devolución). */
export async function getEntregasActivas(): Promise<EntregaActivaOption[]> {
  const supabase = await createClient();

  const { data: recursos, error: recursosError } = await supabase
    .from("recursos")
    .select("id, marca, modelo, codigo_interno, numero_serie, estado_actual, tipo_recurso:tipos_recurso(nombre)")
    .eq("disponibilidad", "asignado")
    .eq("activo", true)
    .returns<RecursoAsignado[]>();

  if (recursosError) throw recursosError;
  if (!recursos || recursos.length === 0) return [];

  const { data: entregas, error: entregasError } = await supabase
    .from("entregas")
    .select(
      "id, recurso_id, fecha_entrega, estado_entrega, empleado:empleados(id, nombre, apellido, legajo, area:areas(id, nombre))",
    )
    .in(
      "recurso_id",
      recursos.map((r) => r.id),
    )
    .order("fecha_entrega", { ascending: false })
    .returns<EntregaVigente[]>();

  if (entregasError) throw entregasError;

  const ultimaPorRecurso = new Map<string, EntregaVigente>();
  for (const e of entregas ?? []) {
    if (!ultimaPorRecurso.has(e.recurso_id)) ultimaPorRecurso.set(e.recurso_id, e);
  }

  const resultado: EntregaActivaOption[] = [];
  for (const r of recursos) {
    const ultima = ultimaPorRecurso.get(r.id);
    if (!ultima || !ultima.empleado) continue;
    resultado.push({
      entregaId: ultima.id,
      estadoEntrega: ultima.estado_entrega,
      recurso: {
        id: r.id,
        marca: r.marca,
        modelo: r.modelo,
        codigo_interno: r.codigo_interno,
        numero_serie: r.numero_serie,
        estado_actual: r.estado_actual,
        tipo_recurso: r.tipo_recurso,
      },
      empleado: ultima.empleado,
    });
  }
  return resultado;
}

export interface DevolucionConDetalle {
  id: string;
  fecha_devolucion: string;
  estado_devolucion: EstadoRecurso;
  comparacion_resultado: ComparacionEstado | null;
  recurso: RecursoResumen | null;
  empleado: EmpleadoResumen | null;
}

export async function getDevoluciones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("devoluciones")
    .select(
      "id, fecha_devolucion, estado_devolucion, comparacion_resultado, recurso:recursos(id, marca, modelo, codigo_interno, tipo_recurso:tipos_recurso(nombre)), empleado:empleados(id, nombre, apellido)",
    )
    .order("fecha_devolucion", { ascending: false })
    .limit(100)
    .returns<DevolucionConDetalle[]>();

  if (error) throw error;
  return data;
}
