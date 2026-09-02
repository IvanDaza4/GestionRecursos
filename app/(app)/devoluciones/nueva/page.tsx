import type { Metadata } from "next";
import { DevolucionWizard } from "@/components/wizard/devolucion-wizard";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getEntregasActivas } from "@/lib/data/entregas";

export const metadata: Metadata = { title: "Nueva devolución" };

export default async function NuevaDevolucionPage({
  searchParams,
}: PageProps<"/devoluciones/nueva">) {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="recursos asignados" />;
  }

  const params = await searchParams;
  const entregaIdParam = typeof params.entrega === "string" ? params.entrega : undefined;

  const entregasActivas = await getEntregasActivas();
  const entregaPreseleccionada = entregasActivas.find((e) => e.entregaId === entregaIdParam);

  return (
    <DevolucionWizard entregasActivas={entregasActivas} entregaPreseleccionada={entregaPreseleccionada} />
  );
}
