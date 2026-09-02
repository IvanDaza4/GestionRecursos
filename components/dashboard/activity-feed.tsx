"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { formatFechaHora } from "@/lib/utils";
import { TIPO_EVENTO_CONFIG, type TipoEvento } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { EmptyState } from "@/components/ui/empty-state";
import { Activity } from "lucide-react";

interface Evento {
  id: string;
  tipo_evento: TipoEvento;
  descripcion: string | null;
  fecha_evento: string;
  recurso: { id: string; marca: string | null; modelo: string | null; codigo_interno: string | null } | null;
  actor: { nombre: string; apellido: string } | null;
}

export function ActivityFeed({ eventos }: { eventos: Evento[] }) {
  return (
    <div className="rounded-md border border-white/8 bg-card p-5">
      <h3 className="text-[13px] font-semibold text-ink mb-4">Actividad reciente</h3>

      {eventos.length === 0 ? (
        <EmptyState icon={<Activity />} title="Sin actividad todavía" description="Los movimientos de recursos van a aparecer acá." />
      ) : (
        <motion.ul variants={staggerContainer} initial="hidden" animate="show" className="space-y-1">
          {eventos.map((evento) => {
            const config = TIPO_EVENTO_CONFIG[evento.tipo_evento];
            const Icon = config.icon;
            return (
              <motion.li key={evento.id} variants={staggerItem}>
                <Link
                  href={evento.recurso ? `/recursos/${evento.recurso.id}` : "#"}
                  className="flex items-start gap-3 rounded-sm px-2 py-2.5 -mx-2 hover:bg-white/[0.03] transition-colors"
                >
                  <div
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border mt-0.5"
                    style={{
                      color: config.color,
                      backgroundColor: `color-mix(in srgb, ${config.color} 14%, transparent)`,
                      borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
                    }}
                  >
                    <Icon className="size-3.5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] text-ink">
                      <span className="font-medium">{config.label}</span>
                      {evento.recurso && (
                        <span className="text-ink-muted">
                          {" "}
                          · {evento.recurso.marca} {evento.recurso.modelo}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-ink-faint mono-data mt-0.5">
                      {formatFechaHora(evento.fecha_evento)}
                      {evento.actor && ` · ${evento.actor.nombre} ${evento.actor.apellido}`}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
