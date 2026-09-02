"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Laptop, PackageCheck, Undo2 } from "lucide-react";
import { EstadoBadge } from "@/components/ui/estado-badge";
import { formatFecha, cn } from "@/lib/utils";
import { DISPONIBILIDAD_CONFIG, type DisponibilidadRecurso, type EstadoRecurso } from "@/lib/constants";
import { springPanel } from "@/lib/animations";

export function ResourceHeader({
  marca,
  modelo,
  tipoNombre,
  codigoInterno,
  numeroSerie,
  imei,
  fechaAlta,
  estado,
  disponibilidad,
  recursoId,
  entregaActivaId,
  empleadoActual,
}: {
  marca: string | null;
  modelo: string | null;
  tipoNombre: string;
  codigoInterno: string | null;
  numeroSerie: string | null;
  imei: string | null;
  fechaAlta: string;
  estado: EstadoRecurso;
  disponibilidad: DisponibilidadRecurso;
  recursoId: string;
  entregaActivaId?: string;
  empleadoActual?: { nombre: string; apellido: string } | null;
}) {
  const dispoConfig = DISPONIBILIDAD_CONFIG[disponibilidad];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPanel}
      className="rounded-lg border border-white/8 bg-card p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/8">
            <Laptop className="size-6 text-ink-muted" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-ink-faint uppercase tracking-wide">
              {tipoNombre}
            </p>
            <h1 className="text-xl font-semibold text-ink tracking-tight truncate">
              {marca} {modelo}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[12px] text-ink-faint mono-data">
              {codigoInterno && <span>{codigoInterno}</span>}
              {numeroSerie && <span>S/N {numeroSerie}</span>}
              {imei && <span>IMEI {imei}</span>}
              <span>Alta {formatFecha(fechaAlta)}</span>
            </div>
            {empleadoActual && (
              <p className="text-[12.5px] text-ink-muted mt-2">
                Asignado a{" "}
                <span className="text-ink font-medium">
                  {empleadoActual.nombre} {empleadoActual.apellido}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <EstadoBadge estado={estado} />
            <span
              className={cn("inline-flex items-center h-7 px-2.5 rounded-xs text-xs font-medium border")}
              style={{
                color: dispoConfig.color,
                backgroundColor: `color-mix(in srgb, ${dispoConfig.color} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${dispoConfig.color} 28%, transparent)`,
              }}
            >
              {dispoConfig.label}
            </span>
          </div>

          {disponibilidad === "disponible" && (
            <Link
              href={`/entregas/nueva?recurso=${recursoId}`}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-accent text-ink-inverse text-[13px] font-medium hover:bg-accent-bright transition-colors"
            >
              <PackageCheck className="size-3.5" /> Registrar entrega
            </Link>
          )}
          {disponibilidad === "asignado" && entregaActivaId && (
            <Link
              href={`/devoluciones/nueva?entrega=${entregaActivaId}`}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-elevated border border-white/10 text-ink text-[13px] font-medium hover:bg-surface-hover transition-colors"
            >
              <Undo2 className="size-3.5" /> Registrar devolución
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
