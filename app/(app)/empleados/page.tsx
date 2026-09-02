import type { Metadata } from "next";
import { EmpleadosView } from "@/components/empleados/empleados-view";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getEmpleados, getAreas } from "@/lib/data/catalogos";

export const metadata: Metadata = { title: "Empleados" };

export default async function EmpleadosPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="empleados" />;
  }

  const [empleados, areas] = await Promise.all([getEmpleados(), getAreas()]);

  return <EmpleadosView empleados={empleados} areas={areas} />;
}
