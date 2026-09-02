import { getEntregas } from "@/lib/data/entregas";
import { getRecursosDisponibles, getEmpleados } from "@/lib/data/catalogos";
import { EntregasView } from "@/components/entregas/entregas-view";

export default async function EntregasPage() {
  const [entregas, recursosDisponibles, empleados] = await Promise.all([
    getEntregas(),
    getRecursosDisponibles(),
    getEmpleados(),
  ]);

  return <EntregasView entregas={entregas} recursosDisponibles={recursosDisponibles} empleados={empleados} />;
}
