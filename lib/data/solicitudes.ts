import { createClient } from "@/lib/supabase/server";
import type { EstadoSolicitud } from "@/lib/constants";

export interface SolicitudConDetalle {
  id: string;
  descripcion: string | null;
  estado: EstadoSolicitud;
  fecha_solicitud: string;
  empleado: { id: string; nombre: string; apellido: string } | null;
  area: { id: string; nombre: string } | null;
  tipo_recurso: { id: string; nombre: string } | null;
}

export async function getSolicitudes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("solicitudes")
    .select(
      "id, descripcion, estado, fecha_solicitud, empleado:empleados(id, nombre, apellido), area:areas(id, nombre), tipo_recurso:tipos_recurso(id, nombre)",
    )
    .order("fecha_solicitud", { ascending: false })
    .returns<SolicitudConDetalle[]>();

  if (error) throw error;
  return data;
}
