"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createRecurso(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const tipoRecursoId = String(formData.get("tipoRecursoId"));
  const marca = String(formData.get("marca") ?? "").trim() || null;
  const modelo = String(formData.get("modelo") ?? "").trim() || null;
  const numeroSerie = String(formData.get("numeroSerie") ?? "").trim() || null;
  const imei = String(formData.get("imei") ?? "").trim() || null;
  const codigoInterno = String(formData.get("codigoInterno") ?? "").trim() || null;
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const estado = String(formData.get("estado") ?? "nuevo");

  const { error } = await supabase.from("recursos").insert({
    tipo_recurso_id: tipoRecursoId,
    marca,
    modelo,
    numero_serie: numeroSerie,
    imei,
    codigo_interno: codigoInterno,
    descripcion,
    estado_actual: estado as never,
    creado_por: user.id,
  });

  if (error) throw error;

  revalidatePath("/recursos");
  revalidatePath("/dashboard");
}
