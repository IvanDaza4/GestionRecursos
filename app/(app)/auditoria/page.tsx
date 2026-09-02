import { Check } from "lucide-react";
import { getEventosGlobales } from "@/lib/data/auditoria";
import { TIPO_EVENTO_CONFIG } from "@/lib/constants";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFechaHora } from "@/lib/utils";

export default async function AuditoriaPage() {
  const eventos = await getEventosGlobales();

  return (
    <div className="module">
      <div className="module-intro">
        <div>
          <p className="eyebrow">TRAZABILIDAD</p>
          <h1>Auditoría</h1>
          <p className="subtitle">Todo lo que pasó, ordenado para entenderlo.</p>
        </div>
      </div>

      {eventos.length === 0 ? (
        <EmptyState title="Todavía no hay eventos" description="Cada alta, entrega, devolución o cambio de estado va a quedar registrado acá." />
      ) : (
        <section className="panel timeline">
          {eventos.map((evento) => {
            const config = TIPO_EVENTO_CONFIG[evento.tipo_evento];
            return (
              <div className="timeline-item" key={evento.id}>
                <time>{formatFechaHora(evento.fecha_evento)}</time>
                <span className={`timeline-mark ${config.tono === "blue" ? "" : config.tono}`}>
                  <Check size={13} />
                </span>
                <div>
                  <strong>{config.label}</strong>
                  <p>
                    {evento.recurso
                      ? [evento.recurso.marca, evento.recurso.modelo].filter(Boolean).join(" ") ||
                        evento.recurso.codigo_interno
                      : evento.descripcion}
                  </p>
                  <small>
                    Por {evento.actor ? `${evento.actor.nombre} ${evento.actor.apellido}` : "sistema"}
                    {evento.descripcion ? ` · ${evento.descripcion}` : ""}
                  </small>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
