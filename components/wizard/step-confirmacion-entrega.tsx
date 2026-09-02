"use client";

import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EstadoBadge } from "@/components/ui/estado-badge";
import { springSnappy } from "@/lib/animations";
import type { RecursoOption, EmpleadoOption } from "./types";
import type { FotoSlot } from "./step-fotos";

export function StepConfirmacionEntrega({
  recurso,
  empleado,
  estado,
  observaciones,
  fotos,
  aceptado,
  onAceptadoChange,
}: {
  recurso: RecursoOption;
  empleado: EmpleadoOption;
  estado: string;
  observaciones: string;
  fotos: FotoSlot[];
  aceptado: boolean;
  onAceptadoChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-md border border-white/8 bg-surface p-4 space-y-3.5">
        <Row label="Recurso" value={`${recurso.marca ?? ""} ${recurso.modelo ?? ""}`} />
        <Row
          label="Empleado"
          value={
            <span className="flex items-center gap-2">
              <Avatar nombre={empleado.nombre} apellido={empleado.apellido} size="sm" />
              {empleado.nombre} {empleado.apellido}
            </span>
          }
        />
        <Row label="Estado" value={<EstadoBadge estado={estado as never} size="sm" />} />
        {observaciones && <Row label="Observaciones" value={observaciones} />}
        {fotos.some((f) => f.preview) && (
          <div>
            <p className="text-[11px] text-ink-faint mb-2">Fotos</p>
            <div className="flex gap-2">
              {fotos
                .filter((f) => f.preview)
                .map((f) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={f.tipo}
                    src={f.preview!}
                    alt={f.tipo}
                    className="size-14 rounded-sm object-cover border border-white/10"
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      <motion.label
        whileTap={{ scale: 0.99 }}
        transition={springSnappy}
        className="flex items-start gap-3 rounded-md border border-accent/20 bg-accent/[0.05] p-4 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={aceptado}
          onChange={(e) => onAceptadoChange(e.target.checked)}
          className="mt-0.5 size-4 accent-[color:var(--accent)]"
        />
        <span className="text-[12.5px] leading-relaxed text-ink-muted">
          <ShieldCheck className="inline size-3.5 mb-0.5 mr-1 text-accent" />
          El empleado confirma haber recibido el recurso en el estado y condiciones descritas
          arriba.
        </span>
      </motion.label>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-ink-faint">{label}</span>
      <span className="text-[13px] text-ink font-medium text-right">{value}</span>
    </div>
  );
}
