import { getEmpleados, getAreas } from "@/lib/data/catalogos";
import { getEntregasActivas } from "@/lib/data/entregas";
import { EmpleadosView } from "@/components/empleados/empleados-view";

export default async function EmpleadosPage() {
  const [empleados, areas, entregasActivas] = await Promise.all([
    getEmpleados(),
    getAreas(),
    getEntregasActivas(),
  ]);

  return <EmpleadosView empleados={empleados} areas={areas} entregasActivas={entregasActivas} />;
}
