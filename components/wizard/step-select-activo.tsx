"use client";

import { Laptop } from "lucide-react";
import { SelectableList } from "./selectable-list";
import { EstadoBadge } from "@/components/ui/estado-badge";
import { Avatar } from "@/components/ui/avatar";
import type { EntregaActivaOption } from "./types";

export function StepSelectActivo({
  entregas,
  selectedId,
  onSelect,
}: {
  entregas: EntregaActivaOption[];
  selectedId: string | null;
  onSelect: (entrega: EntregaActivaOption) => void;
}) {
  return (
    <div>
      <p className="text-[13px] text-ink-muted mb-4">
        Elegí el recurso que se está devolviendo.
      </p>
      <SelectableList
        items={entregas.map((e) => ({ ...e, id: e.entregaId }))}
        selectedId={selectedId}
        onSelect={onSelect}
        searchPlaceholder="Buscar por recurso o empleado…"
        emptyLabel="No hay recursos asignados actualmente"
        filter={(e, q) =>
          [e.recurso.marca, e.recurso.modelo, e.empleado.nombre, e.empleado.apellido]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(q))
        }
        renderItem={(e) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-sm bg-white/5 shrink-0">
              <Laptop className="size-4 text-ink-muted" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink truncate">
                {e.recurso.marca} {e.recurso.modelo}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Avatar nombre={e.empleado.nombre} apellido={e.empleado.apellido} size="sm" className="size-4 text-[8px]" />
                <span className="text-[11px] text-ink-faint truncate">
                  {e.empleado.nombre} {e.empleado.apellido}
                </span>
              </div>
            </div>
            <EstadoBadge estado={e.estadoEntrega} size="sm" className="ml-auto shrink-0" />
          </div>
        )}
      />
    </div>
  );
}
