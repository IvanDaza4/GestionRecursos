"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EstadoSolicitud } from "@/lib/constants";

export async function createSolicitud(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const empleadoId = String(formData.get("empleadoId"));
  const areaId = String(formData.get("areaId") ?? "").trim() || null;
  const tipoRecursoId = String(formData.get("tipoRecursoId") ?? "").trim() || null;
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;

  const { error } = await supabase.from("solicitudes").insert({
    empleado_id: empleadoId,
    area_id: areaId,
    tipo_recurso_id: tipoRecursoId,
    descripcion,
    solicitado_por: user.id,
    creado_por: user.id,
  });

  if (error) throw error;

  revalidatePath("/solicitudes");
  revalidatePath("/dashboard");
}

export async function resolverSolicitud(id: string, estado: EstadoSolicitud) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("solicitudes")
    .update({
      estado,
      aprobado_por: user.id,
      fecha_resolucion: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/solicitudes");
  revalidatePath("/dashboard");
}
