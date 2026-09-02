import { getDevoluciones, getEntregasActivas } from "@/lib/data/entregas";
import { DevolucionesView } from "@/components/devoluciones/devoluciones-view";

export default async function DevolucionesPage() {
  const [devoluciones, entregasActivas] = await Promise.all([getDevoluciones(), getEntregasActivas()]);

  return <DevolucionesView devoluciones={devoluciones} entregasActivas={entregasActivas} />;
}
