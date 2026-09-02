import { createClient } from "@/lib/supabase/server";
import type { EstadoRecurso } from "@/lib/constants";
import type { TipoEvento } from "@/lib/supabase/types";

const ANTIGUEDAD_ALERTA_MESES = 24;

interface RecursoConTipo {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  estado_actual: EstadoRecurso;
  tipo_recurso: { nombre: string } | null;
}

interface RecursoAntiguo {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  fecha_alta: string;
  tipo_recurso: { nombre: string } | null;
}

interface EventoReciente {
  id: string;
  tipo_evento: TipoEvento;
  descripcion: string | null;
  fecha_evento: string;
  recurso: { id: string; marca: string | null; modelo: string | null; codigo_interno: string | null } | null;
  actor: { nombre: string; apellido: string } | null;
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const fechaAntiguedad = new Date();
  fechaAntiguedad.setMonth(fechaAntiguedad.getMonth() - ANTIGUEDAD_ALERTA_MESES);

  const [
    { count: totalRecursos },
    { count: disponibles },
    { count: asignados },
    { count: enReparacion },
    { count: entregasDelMes },
    { count: solicitudesPendientes },
    { data: recursosDeteriorados },
    { data: recursosAntiguos },
    { data: eventosRecientes },
  ] = await Promise.all([
    supabase.from("recursos").select("*", { count: "exact", head: true }).eq("activo", true),
    supabase
      .from("recursos")
      .select("*", { count: "exact", head: true })
      .eq("activo", true)
      .eq("disponibilidad", "disponible"),
    supabase
      .from("recursos")
      .select("*", { count: "exact", head: true })
      .eq("activo", true)
      .eq("disponibilidad", "asignado"),
    supabase
      .from("recursos")
      .select("*", { count: "exact", head: true })
      .eq("activo", true)
      .eq("disponibilidad", "en_reparacion"),
    supabase
      .from("entregas")
      .select("*", { count: "exact", head: true })
      .gte("fecha_entrega", inicioMes.toISOString()),
    supabase
      .from("solicitudes")
      .select("*", { count: "exact", head: true })
      .eq("estado", "pendiente"),
    supabase
      .from("recursos")
      .select("id, marca, modelo, codigo_interno, estado_actual, tipo_recurso:tipos_recurso(nombre)")
      .eq("activo", true)
      .in("estado_actual", ["regular", "danado"])
      .order("fecha_actualizacion", { ascending: false })
      .limit(5)
      .returns<RecursoConTipo[]>(),
    supabase
      .from("recursos")
      .select("id, marca, modelo, codigo_interno, fecha_alta, tipo_recurso:tipos_recurso(nombre)")
      .eq("activo", true)
      .lte("fecha_alta", fechaAntiguedad.toISOString().slice(0, 10))
      .order("fecha_alta", { ascending: true })
      .limit(5)
      .returns<RecursoAntiguo[]>(),
    supabase
      .from("eventos_recurso")
      .select(
        "id, tipo_evento, descripcion, fecha_evento, recurso:recursos(id, marca, modelo, codigo_interno), actor:profiles(nombre, apellido)",
      )
      .order("fecha_evento", { ascending: false })
      .limit(8)
      .returns<EventoReciente[]>(),
  ]);

  return {
    totalRecursos: totalRecursos ?? 0,
    disponibles: disponibles ?? 0,
    asignados: asignados ?? 0,
    enReparacion: enReparacion ?? 0,
    entregasDelMes: entregasDelMes ?? 0,
    solicitudesPendientes: solicitudesPendientes ?? 0,
    recursosDeteriorados: recursosDeteriorados ?? [],
    recursosAntiguos: recursosAntiguos ?? [],
    eventosRecientes: eventosRecientes ?? [],
  };
}
