"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Plus, PackageCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EstadoBadge } from "@/components/ui/estado-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { formatFechaHora } from "@/lib/utils";
import type { EstadoRecurso } from "@/lib/constants";

interface Entrega {
  id: string;
  fecha_entrega: string;
  estado_entrega: EstadoRecurso;
  aceptado: boolean;
  recurso: { id: string; marca: string | null; modelo: string | null; tipo_recurso: { nombre: string } | null } | null;
  empleado: { id: string; nombre: string; apellido: string } | null;
}

export function EntregasTable({ entregas }: { entregas: Entrega[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-muted">{entregas.length} entregas registradas</p>
        <Link
          href="/entregas/nueva"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-accent text-ink-inverse text-[13px] font-medium hover:bg-accent-bright transition-colors"
        >
          <Plus className="size-4" /> Nueva entrega
        </Link>
      </div>

      {entregas.length === 0 ? (
        <EmptyState icon={<PackageCheck />} title="Sin entregas" description="Todavía no se registraron entregas de recursos." />
      ) : (
        <div className="rounded-md border border-white/8 bg-card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-2.5 border-b border-white/8 text-[11px] font-medium text-ink-faint uppercase tracking-wide">
            <span>Recurso</span>
            <span>Empleado</span>
            <span>Estado</span>
            <span>Fecha</span>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            {entregas.map((e) => (
              <motion.div key={e.id} variants={staggerItem}>
                <Link
                  href={e.recurso ? `/recursos/${e.recurso.id}` : "#"}
                  className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto_auto] gap-4 items-center px-4 py-3.5 border-b border-white/6 last:border-b-0 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-ink truncate">
                      {e.recurso?.marca} {e.recurso?.modelo}
                    </p>
                    <p className="text-[11px] text-ink-faint truncate">{e.recurso?.tipo_recurso?.nombre}</p>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    {e.empleado && <Avatar nombre={e.empleado.nombre} apellido={e.empleado.apellido} size="sm" />}
                    <span className="text-[13px] text-ink truncate">
                      {e.empleado?.nombre} {e.empleado?.apellido}
                    </span>
                  </div>
                  <EstadoBadge estado={e.estado_entrega} size="sm" />
                  <span className="text-[11.5px] text-ink-faint mono-data text-right sm:text-left">
                    {formatFechaHora(e.fecha_entrega)}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
