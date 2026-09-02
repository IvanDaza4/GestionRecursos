"use client";

import { motion } from "motion/react";
import { ESTADOS_RECURSO, ESTADO_CONFIG, type EstadoRecurso } from "@/lib/constants";
import { Textarea, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/animations";

export function StepEstado({
  estado,
  onEstadoChange,
  observaciones,
  onObservacionesChange,
  estadoReferencia,
}: {
  estado: EstadoRecurso | null;
  onEstadoChange: (estado: EstadoRecurso) => void;
  observaciones: string;
  onObservacionesChange: (value: string) => void;
  /** Estado de la entrega original, para contextuar una devolución */
  estadoReferencia?: EstadoRecurso;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[13px] text-ink-muted mb-3">
          ¿En qué condición está el recurso
          {estadoReferencia ? " en este momento" : ""}?
          {estadoReferencia && (
            <>
              {" "}
              Se entregó como{" "}
              <span className="font-medium" style={{ color: ESTADO_CONFIG[estadoReferencia].color }}>
                {ESTADO_CONFIG[estadoReferencia].label.toLowerCase()}
              </span>
              .
            </>
          )}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {ESTADOS_RECURSO.map((e) => {
            const config = ESTADO_CONFIG[e];
            const Icon = config.icon;
            const selected = estado === e;
            return (
              <motion.button
                key={e}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={springSnappy}
                onClick={() => onEstadoChange(e)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-sm border px-1.5 py-3 text-center transition-colors",
                  selected ? "border-transparent" : "border-white/8 hover:border-white/15",
                )}
                style={
                  selected
                    ? {
                        backgroundColor: `color-mix(in srgb, ${config.color} 14%, transparent)`,
                        borderColor: `color-mix(in srgb, ${config.color} 40%, transparent)`,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${config.color} 30%, transparent)`,
                      }
                    : undefined
                }
              >
                <Icon
                  className="size-4"
                  strokeWidth={2}
                  style={{ color: selected ? config.color : "var(--ink-faint)" }}
                />
                <span
                  className="text-[11px] font-medium leading-tight"
                  style={{ color: selected ? config.color : "var(--ink-muted)" }}
                >
                  {config.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones (opcional)</Label>
        <Textarea
          id="observaciones"
          value={observaciones}
          onChange={(e) => onObservacionesChange(e.target.value)}
          placeholder="Detalles visibles, rayones, accesorios entregados, etc."
        />
      </div>
    </div>
  );
}
