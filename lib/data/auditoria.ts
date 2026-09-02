import { createClient } from "@/lib/supabase/server";
import type { TipoEvento } from "@/lib/constants";

export interface EventoAuditoria {
  id: string;
  tipo_evento: TipoEvento;
  descripcion: string | null;
  fecha_evento: string;
  recurso: { id: string; marca: string | null; modelo: string | null; codigo_interno: string | null } | null;
  actor: { nombre: string; apellido: string } | null;
}

export async function getEventosGlobales() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eventos_recurso")
    .select(
      "id, tipo_evento, descripcion, fecha_evento, recurso:recursos(id, marca, modelo, codigo_interno), actor:profiles(nombre, apellido)",
    )
    .order("fecha_evento", { ascending: false })
    .limit(200)
    .returns<EventoAuditoria[]>();

  if (error) throw error;
  return data;
}
