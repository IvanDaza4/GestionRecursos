"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CircleAlert } from "lucide-react";
import { EstadoBadge } from "@/components/ui/estado-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { formatFecha } from "@/lib/utils";
import type { EstadoRecurso } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

interface RecursoAlerta {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  tipo_recurso: { nombre: string } | null;
  estado_actual?: EstadoRecurso;
  fecha_alta?: string;
}

export function AlertList({
  titulo,
  recursos,
  variant,
}: {
  titulo: string;
  recursos: RecursoAlerta[];
  variant: "estado" | "antiguedad";
}) {
  return (
    <div className="rounded-md border border-white/8 bg-card p-5">
      <h3 className="text-[13px] font-semibold text-ink mb-4 flex items-center gap-1.5">
        <CircleAlert className="size-3.5 text-regular" />
        {titulo}
      </h3>

      {recursos.length === 0 ? (
        <EmptyState icon={<ShieldCheck />} title="Todo en orden" description="No hay alertas activas por ahora." />
      ) : (
        <motion.ul variants={staggerContainer} initial="hidden" animate="show" className="space-y-1">
          {recursos.map((r) => (
            <motion.li key={r.id} variants={staggerItem}>
              <Link
                href={`/recursos/${r.id}`}
                className="flex items-center justify-between gap-3 rounded-sm px-2 py-2.5 -mx-2 hover:bg-white/[0.03] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-ink truncate">
                    {r.marca} {r.modelo}
                  </p>
                  <p className="text-[11px] text-ink-faint truncate">
                    {r.tipo_recurso?.nombre} · {r.codigo_interno ?? "s/código"}
                  </p>
                </div>
                {variant === "estado" && r.estado_actual && (
                  <EstadoBadge estado={r.estado_actual} size="sm" />
                )}
                {variant === "antiguedad" && r.fecha_alta && (
                  <span className="text-[11px] text-ink-faint mono-data shrink-0">
                    {formatFecha(r.fecha_alta)}
                  </span>
                )}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
