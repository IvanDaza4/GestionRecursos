"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EstadoRecurso, TipoFoto } from "@/lib/supabase/types";

async function subirFotos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  carpeta: string,
) {
  const archivos = formData.getAll("fotos") as File[];
  const tipos = formData.getAll("fotosTipo") as string[];
  const subidas: { tipo_foto: TipoFoto; url: string; orden: number }[] = [];

  for (let i = 0; i < archivos.length; i++) {
    const archivo = archivos[i];
    if (!archivo || archivo.size === 0) continue;
    const extension = archivo.name.split(".").pop() ?? "jpg";
    const path = `${carpeta}/${randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from("recursos-fotos").upload(path, archivo, {
      contentType: archivo.type || "image/jpeg",
    });
    if (error) throw error;

    subidas.push({
      tipo_foto: (tipos[i] as TipoFoto) ?? "otro",
      url: path,
      orden: i,
    });
  }

  return subidas;
}

export async function createEntrega(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const recursoId = String(formData.get("recursoId"));
  const empleadoId = String(formData.get("empleadoId"));
  const areaId = formData.get("areaId") ? String(formData.get("areaId")) : null;
  const estado = String(formData.get("estado")) as EstadoRecurso;
  const observaciones = String(formData.get("observaciones") ?? "");
  const aceptado = formData.get("aceptado") === "true";

  const { data: entrega, error } = await supabase
    .from("entregas")
    .insert({
      recurso_id: recursoId,
      empleado_id: empleadoId,
      area_id: areaId,
      entregado_por: user.id,
      estado_entrega: estado,
      observaciones: observaciones || null,
      aceptado,
      fecha_aceptacion: aceptado ? new Date().toISOString() : null,
      creado_por: user.id,
    })
    .select("id")
    .single();

  if (error) throw error;

  const fotos = await subirFotos(supabase, formData, `entregas/${entrega.id}`);
  if (fotos.length > 0) {
    const { error: fotosError } = await supabase
      .from("entrega_fotos")
      .insert(fotos.map((f) => ({ ...f, entrega_id: entrega.id })));
    if (fotosError) throw fotosError;
  }

  revalidatePath("/recursos");
  revalidatePath(`/recursos/${recursoId}`);
  revalidatePath("/entregas");
  revalidatePath("/dashboard");

  return { id: entrega.id as string };
}

export async function createDevolucion(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const entregaId = String(formData.get("entregaId"));
  const recursoId = String(formData.get("recursoId"));
  const empleadoId = String(formData.get("empleadoId"));
  const estado = String(formData.get("estado")) as EstadoRecurso;
  const observaciones = String(formData.get("observaciones") ?? "");

  const { data: devolucion, error } = await supabase
    .from("devoluciones")
    .insert({
      entrega_id: entregaId,
      recurso_id: recursoId,
      empleado_id: empleadoId,
      recibido_por: user.id,
      estado_devolucion: estado,
      observaciones: observaciones || null,
      creado_por: user.id,
    })
    .select("id, comparacion_resultado")
    .single();

  if (error) throw error;

  const fotos = await subirFotos(supabase, formData, `devoluciones/${devolucion.id}`);
  if (fotos.length > 0) {
    const { error: fotosError } = await supabase
      .from("devolucion_fotos")
      .insert(fotos.map((f) => ({ ...f, devolucion_id: devolucion.id })));
    if (fotosError) throw fotosError;
  }

  revalidatePath("/recursos");
  revalidatePath(`/recursos/${recursoId}`);
  revalidatePath("/devoluciones");
  revalidatePath("/dashboard");

  return { id: devolucion.id as string, comparacion: devolucion.comparacion_resultado };
}
