import { createClient } from "@/lib/supabase/server";
import type { EstadoRecurso, DisponibilidadRecurso, TipoEvento } from "@/lib/constants";

export interface RecursoDetalle {
  id: string;
  tipo_recurso_id: string;
  codigo_interno: string | null;
  marca: string | null;
  modelo: string | null;
  numero_serie: string | null;
  imei: string | null;
  descripcion: string | null;
  estado_actual: EstadoRecurso;
  disponibilidad: DisponibilidadRecurso;
  fecha_alta: string;
  activo: boolean;
  tipo_recurso: { id: string; nombre: string; categoria: string } | null;
}

export async function getRecursos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recursos")
    .select("*, tipo_recurso:tipos_recurso(id, nombre, categoria)")
    .eq("activo", true)
    .order("fecha_creacion", { ascending: false })
    .returns<RecursoDetalle[]>();

  if (error) throw error;
  return data;
}

export async function getRecursoById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recursos")
    .select("*, tipo_recurso:tipos_recurso(id, nombre, categoria)")
    .eq("id", id)
    .maybeSingle()
    .returns<RecursoDetalle>();

  if (error) throw error;
  return data;
}

export interface EventoConActor {
  id: string;
  tipo_evento: TipoEvento;
  descripcion: string | null;
  fecha_evento: string;
  actor: { nombre: string; apellido: string } | null;
}

export async function getEventosRecurso(recursoId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eventos_recurso")
    .select("id, tipo_evento, descripcion, fecha_evento, actor:profiles(nombre, apellido)")
    .eq("recurso_id", recursoId)
    .order("fecha_evento", { ascending: false })
    .returns<EventoConActor[]>();

  if (error) throw error;
  return data;
}

export interface EntregaConEmpleado {
  id: string;
  fecha_entrega: string;
  estado_entrega: EstadoRecurso;
  empleado: { id: string; nombre: string; apellido: string } | null;
}

export async function getEntregaActivaPorRecurso(recursoId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entregas")
    .select("id, fecha_entrega, estado_entrega, empleado:empleados(id, nombre, apellido)")
    .eq("recurso_id", recursoId)
    .order("fecha_entrega", { ascending: false })
    .limit(1)
    .maybeSingle()
    .returns<EntregaConEmpleado>();

  if (error) throw error;
  return data;
}

export async function getFotosEntrega(entregaId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entrega_fotos")
    .select("*")
    .eq("entrega_id", entregaId)
    .order("orden");

  if (error) throw error;
  return data;
}
