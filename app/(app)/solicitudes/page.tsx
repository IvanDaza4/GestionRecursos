import type { Metadata } from "next";
import { SolicitudesView } from "@/components/solicitudes/solicitudes-view";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSolicitudes } from "@/lib/data/solicitudes";
import { getEmpleados, getTiposRecurso } from "@/lib/data/catalogos";

export const metadata: Metadata = { title: "Solicitudes" };

export default async function SolicitudesPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="solicitudes" />;
  }

  const [solicitudes, empleados, tiposRecurso] = await Promise.all([
    getSolicitudes(),
    getEmpleados(),
    getTiposRecurso(),
  ]);

  return <SolicitudesView solicitudes={solicitudes} empleados={empleados} tiposRecurso={tiposRecurso} />;
}
