"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, Undo2, TrendingDown, TrendingUp, Equal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EstadoBadge } from "@/components/ui/estado-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { formatFechaHora, cn } from "@/lib/utils";
import type { EstadoRecurso } from "@/lib/constants";

interface Devolucion {
  id: string;
  fecha_devolucion: string;
  estado_devolucion: EstadoRecurso;
  comparacion_resultado: "mejoro" | "igual" | "empeoro" | null;
  recurso: { id: string; marca: string | null; modelo: string | null; tipo_recurso: { nombre: string } | null } | null;
  empleado: { id: string; nombre: string; apellido: string } | null;
}

const COMPARACION_UI = {
  mejoro: { label: "Mejoró", icon: TrendingUp, color: "var(--nuevo)" },
  igual: { label: "Igual", icon: Equal, color: "var(--ink-muted)" },
  empeoro: { label: "Empeoró", icon: TrendingDown, color: "var(--danado)" },
};

export function DevolucionesTable({ devoluciones }: { devoluciones: Devolucion[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-muted">{devoluciones.length} devoluciones registradas</p>
        <Link
          href="/devoluciones/nueva"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-accent text-ink-inverse text-[13px] font-medium hover:bg-accent-bright transition-colors"
        >
          <Plus className="size-4" /> Nueva devolución
        </Link>
      </div>

      {devoluciones.length === 0 ? (
        <EmptyState icon={<Undo2 />} title="Sin devoluciones" description="Todavía no se registraron devoluciones de recursos." />
      ) : (
        <div className="rounded-md border border-white/8 bg-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-white/8 text-[11px] font-medium text-ink-faint uppercase tracking-wide">
            <span>Recurso</span>
            <span>Empleado</span>
            <span>Estado</span>
            <span>Comparación</span>
            <span>Fecha</span>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            {devoluciones.map((d) => {
              const comp = d.comparacion_resultado ? COMPARACION_UI[d.comparacion_resultado] : null;
              const Icon = comp?.icon;
              return (
                <motion.div key={d.id} variants={staggerItem}>
                  <Link
                    href={d.recurso ? `/recursos/${d.recurso.id}` : "#"}
                    className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3.5 border-b border-white/6 last:border-b-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink truncate">
                        {d.recurso?.marca} {d.recurso?.modelo}
                      </p>
                      <p className="text-[11px] text-ink-faint truncate">{d.recurso?.tipo_recurso?.nombre}</p>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      {d.empleado && <Avatar nombre={d.empleado.nombre} apellido={d.empleado.apellido} size="sm" />}
                      <span className="text-[13px] text-ink truncate">
                        {d.empleado?.nombre} {d.empleado?.apellido}
                      </span>
                    </div>
                    <EstadoBadge estado={d.estado_devolucion} size="sm" />
                    {comp && Icon ? (
                      <span
                        className={cn("flex items-center gap-1 text-[12px] font-medium")}
                        style={{ color: comp.color }}
                      >
                        <Icon className="size-3.5" /> {comp.label}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[11.5px] text-ink-faint mono-data text-right sm:text-left">
                      {formatFechaHora(d.fecha_devolucion)}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
}
