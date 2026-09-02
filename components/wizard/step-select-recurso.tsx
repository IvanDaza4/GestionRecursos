"use client";

import { Laptop } from "lucide-react";
import { SelectableList } from "./selectable-list";
import { EstadoBadge } from "@/components/ui/estado-badge";
import type { RecursoOption } from "./types";

export function StepSelectRecurso({
  recursos,
  selectedId,
  onSelect,
}: {
  recursos: RecursoOption[];
  selectedId: string | null;
  onSelect: (recurso: RecursoOption) => void;
}) {
  return (
    <div>
      <p className="text-[13px] text-ink-muted mb-4">
        Elegí el recurso disponible que vas a entregar.
      </p>
      <SelectableList
        items={recursos}
        selectedId={selectedId}
        onSelect={onSelect}
        searchPlaceholder="Buscar por marca, modelo o N° de serie…"
        emptyLabel="No hay recursos disponibles con ese criterio"
        filter={(r, q) =>
          [r.marca, r.modelo, r.codigo_interno, r.numero_serie, r.tipo_recurso?.nombre]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(q))
        }
        renderItem={(r) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-sm bg-white/5 shrink-0">
              <Laptop className="size-4 text-ink-muted" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink truncate">
                {r.marca} {r.modelo}
              </p>
              <p className="text-[11px] text-ink-faint mono-data truncate">
                {r.tipo_recurso?.nombre} · {r.codigo_interno ?? r.numero_serie ?? "s/n"}
              </p>
            </div>
            <div className="ml-auto shrink-0">
              <EstadoBadge estado={r.estado_actual} size="sm" />
            </div>
          </div>
        )}
      />
    </div>
  );
}
