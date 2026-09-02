import type { Metadata } from "next";
import { RecursosView } from "@/components/resources/recursos-view";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getRecursos } from "@/lib/data/recursos";
import { getTiposRecurso } from "@/lib/data/catalogos";

export const metadata: Metadata = { title: "Recursos" };

export default async function RecursosPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="recursos" />;
  }

  const [recursos, tiposRecurso] = await Promise.all([getRecursos(), getTiposRecurso()]);

  return <RecursosView recursos={recursos} tiposRecurso={tiposRecurso} />;
}
