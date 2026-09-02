import type { Metadata } from "next";
import { EntregasTable } from "@/components/entregas/entregas-table";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getEntregas } from "@/lib/data/entregas";

export const metadata: Metadata = { title: "Entregas" };

export default async function EntregasPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="entregas" />;
  }

  const entregas = await getEntregas();
  return <EntregasTable entregas={entregas} />;
}
