"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEmpleado(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const legajo = String(formData.get("legajo") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const areaId = String(formData.get("areaId") ?? "").trim() || null;
  const puesto = String(formData.get("puesto") ?? "").trim() || null;

  if (!nombre || !apellido) throw new Error("Nombre y apellido son obligatorios");

  const { error } = await supabase.from("empleados").insert({
    nombre,
    apellido,
    legajo,
    email,
    area_id: areaId,
    puesto,
    creado_por: user.id,
  });

  if (error) throw error;

  revalidatePath("/empleados");
}
