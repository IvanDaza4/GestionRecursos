import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceHeader } from "@/components/resources/resource-header";
import { ResourceTimeline } from "@/components/resources/resource-timeline";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getRecursoById, getEventosRecurso, getEntregaActivaPorRecurso } from "@/lib/data/recursos";

export async function generateMetadata({ params }: PageProps<"/recursos/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isSupabaseConfigured) return { title: "Recurso" };
  const recurso = await getRecursoById(id);
  return { title: recurso ? `${recurso.marca} ${recurso.modelo}` : "Recurso" };
}

export default async function RecursoDetallePage({ params }: PageProps<"/recursos/[id]">) {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="el recurso" />;
  }

  const { id } = await params;
  const recurso = await getRecursoById(id);
  if (!recurso) notFound();

  const [eventos, entregaActiva] = await Promise.all([
    getEventosRecurso(id),
    recurso.disponibilidad === "asignado" ? getEntregaActivaPorRecurso(id) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <ResourceHeader
        marca={recurso.marca}
        modelo={recurso.modelo}
        tipoNombre={recurso.tipo_recurso?.nombre ?? "Recurso"}
        codigoInterno={recurso.codigo_interno}
        numeroSerie={recurso.numero_serie}
        imei={recurso.imei}
        fechaAlta={recurso.fecha_alta}
        estado={recurso.estado_actual}
        disponibilidad={recurso.disponibilidad}
        recursoId={recurso.id}
        entregaActivaId={entregaActiva?.id}
        empleadoActual={entregaActiva?.empleado ?? null}
      />

      <div className="rounded-lg border border-white/8 bg-card p-6">
        <h2 className="text-sm font-semibold text-ink mb-5">Pasaporte del dispositivo</h2>
        <ResourceTimeline eventos={eventos} />
      </div>
    </div>
  );
}
