import { getSolicitudes } from "@/lib/data/solicitudes";
import { getEmpleados, getAreas, getTiposRecurso } from "@/lib/data/catalogos";
import { SolicitudesView } from "@/components/solicitudes/solicitudes-view";

export default async function SolicitudesPage() {
  const [solicitudes, empleados, areas, tipos] = await Promise.all([
    getSolicitudes(),
    getEmpleados(),
    getAreas(),
    getTiposRecurso(),
  ]);

  return <SolicitudesView solicitudes={solicitudes} empleados={empleados} areas={areas} tipos={tipos} />;
}
