import { getRecursos } from "@/lib/data/recursos";
import { getTiposRecurso } from "@/lib/data/catalogos";
import { RecursosView } from "@/components/recursos/recursos-view";

export default async function RecursosPage() {
  const [recursos, tipos] = await Promise.all([getRecursos(), getTiposRecurso()]);

  return <RecursosView recursos={recursos} tipos={tipos} />;
}
