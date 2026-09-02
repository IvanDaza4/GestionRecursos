import type { Metadata } from "next";
import { DevolucionesTable } from "@/components/entregas/devoluciones-table";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDevoluciones } from "@/lib/data/entregas";

export const metadata: Metadata = { title: "Devoluciones" };

export default async function DevolucionesPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="devoluciones" />;
  }

  const devoluciones = await getDevoluciones();
  return <DevolucionesTable devoluciones={devoluciones} />;
}
