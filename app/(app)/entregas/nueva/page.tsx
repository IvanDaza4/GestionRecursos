import type { Metadata } from "next";
import { EntregaWizard } from "@/components/wizard/entrega-wizard";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getRecursosDisponibles, getEmpleados } from "@/lib/data/catalogos";
import type { RecursoOption, EmpleadoOption } from "@/components/wizard/types";

export const metadata: Metadata = { title: "Nueva entrega" };

export default async function NuevaEntregaPage({
  searchParams,
}: PageProps<"/entregas/nueva">) {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="recursos y empleados" />;
  }

  const params = await searchParams;
  const recursoIdParam = typeof params.recurso === "string" ? params.recurso : undefined;

  const [recursosRaw, empleadosRaw] = await Promise.all([getRecursosDisponibles(), getEmpleados()]);

  const recursos: RecursoOption[] = recursosRaw.map((r) => ({
    id: r.id,
    marca: r.marca,
    modelo: r.modelo,
    codigo_interno: r.codigo_interno,
    numero_serie: r.numero_serie,
    estado_actual: r.estado_actual,
    tipo_recurso: r.tipo_recurso,
  }));

  const empleados: EmpleadoOption[] = empleadosRaw.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    apellido: e.apellido,
    legajo: e.legajo,
    area: e.area,
  }));

  const recursoPreseleccionado = recursos.find((r) => r.id === recursoIdParam);

  return (
    <EntregaWizard recursos={recursos} empleados={empleados} recursoPreseleccionado={recursoPreseleccionado} />
  );
}
