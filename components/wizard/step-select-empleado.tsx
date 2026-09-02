"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/estado-badge";
import { SelectableList } from "./selectable-list";
import type { EmpleadoOption } from "./types";

export function StepSelectEmpleado({
  empleados,
  selectedId,
  onSelect,
}: {
  empleados: EmpleadoOption[];
  selectedId: string | null;
  onSelect: (empleado: EmpleadoOption) => void;
}) {
  return (
    <div>
      <p className="text-[13px] text-ink-muted mb-4">
        ¿A quién se le entrega este recurso?
      </p>
      <SelectableList
        items={empleados}
        selectedId={selectedId}
        onSelect={onSelect}
        searchPlaceholder="Buscar por nombre o legajo…"
        emptyLabel="No se encontraron empleados"
        filter={(e, q) =>
          [e.nombre, e.apellido, e.legajo, e.area?.nombre]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(q))
        }
        renderItem={(e) => (
          <div className="flex items-center gap-3">
            <Avatar nombre={e.nombre} apellido={e.apellido} size="sm" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink truncate">
                {e.nombre} {e.apellido}
              </p>
              <p className="text-[11px] text-ink-faint mono-data truncate">
                {e.legajo ?? "s/legajo"}
              </p>
            </div>
            {e.area && <Badge className="ml-auto shrink-0">{e.area.nombre}</Badge>}
          </div>
        )}
      />
    </div>
  );
}
