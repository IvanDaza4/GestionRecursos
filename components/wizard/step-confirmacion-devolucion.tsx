"use client";

import { Avatar } from "@/components/ui/avatar";
import { ComparisonReveal } from "./comparison-reveal";
import type { EstadoRecurso } from "@/lib/constants";
import type { RecursoOption, EmpleadoOption } from "./types";
import type { FotoSlot } from "./step-fotos";

export function StepConfirmacionDevolucion({
  recurso,
  empleado,
  estadoEntrega,
  estadoDevolucion,
  observaciones,
  fotos,
}: {
  recurso: RecursoOption;
  empleado: EmpleadoOption;
  estadoEntrega: EstadoRecurso;
  estadoDevolucion: EstadoRecurso;
  observaciones: string;
  fotos: FotoSlot[];
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

      <ComparisonReveal estadoEntrega={estadoEntrega} estadoDevolucion={estadoDevolucion} />
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
