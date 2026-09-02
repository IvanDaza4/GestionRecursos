"use server";

import { createClient } from "@/lib/supabase/server";
import type { TipoEvento } from "@/lib/supabase/types";

const SIGNED_URL_TTL = 60 * 60; // 1 hora

async function conSignedUrls(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fotos: { id: string; tipo_foto: string; url: string; orden: number }[],
) {
  return Promise.all(
    fotos.map(async (foto) => {
      const { data: signed } = await supabase.storage
        .from("recursos-fotos")
        .createSignedUrl(foto.url, SIGNED_URL_TTL);
      return { ...foto, signedUrl: signed?.signedUrl ?? null };
    }),
  );
}

export async function getFotosEvento(tipoEvento: TipoEvento, referenciaId: string) {
  const supabase = await createClient();

  if (tipoEvento === "entrega") {
    const { data, error } = await supabase
      .from("entrega_fotos")
      .select("*")
      .eq("entrega_id", referenciaId)
      .order("orden");
    if (error || !data) return [];
    return conSignedUrls(supabase, data);
  }

  if (tipoEvento === "devolucion") {
    const { data, error } = await supabase
      .from("devolucion_fotos")
      .select("*")
      .eq("devolucion_id", referenciaId)
      .order("orden");
    if (error || !data) return [];
    return conSignedUrls(supabase, data);
  }

  return [];
}
