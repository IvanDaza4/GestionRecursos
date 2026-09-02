"use client";

import { motion } from "motion/react";
import { ArrowRight, TrendingDown, TrendingUp, Equal } from "lucide-react";
import { ESTADO_CONFIG, ESTADO_RANK, type EstadoRecurso } from "@/lib/constants";
import { springPanel } from "@/lib/animations";

export function ComparisonReveal({
  estadoEntrega,
  estadoDevolucion,
}: {
  estadoEntrega: EstadoRecurso;
  estadoDevolucion: EstadoRecurso;
}) {
  const rankEntrega = ESTADO_RANK[estadoEntrega];
  const rankDevolucion = ESTADO_RANK[estadoDevolucion];
  const resultado = rankDevolucion < rankEntrega ? "empeoro" : rankDevolucion > rankEntrega ? "mejoro" : "igual";

  const entregaConfig = ESTADO_CONFIG[estadoEntrega];
  const devolucionConfig = ESTADO_CONFIG[estadoDevolucion];

  const resultadoUi = {
    empeoro: {
      label: "El estado empeoró respecto a la entrega",
      color: "var(--danado)",
      Icon: TrendingDown,
    },
    igual: {
      label: "El estado se mantuvo igual",
      color: "var(--ink-muted)",
      Icon: Equal,
    },
    mejoro: {
      label: "El estado mejoró respecto a la entrega",
      color: "var(--nuevo)",
      Icon: TrendingUp,
    },
  }[resultado];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPanel}
      className="rounded-md border p-4"
      style={{
        borderColor: `color-mix(in srgb, ${resultadoUi.color} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${resultadoUi.color} 6%, transparent)`,
      }}
    >
      <div className="flex items-center justify-center gap-4">
        <EstadoPill config={entregaConfig} muted />
        <motion.div
          animate={resultado === "empeoro" ? { x: [0, 3, 0] } : undefined}
          transition={{ duration: 0.5, repeat: resultado === "empeoro" ? 2 : 0 }}
        >
          <ArrowRight className="size-4" style={{ color: resultadoUi.color }} />
        </motion.div>
        <EstadoPill config={devolucionConfig} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-1.5 mt-3 text-[12.5px] font-medium"
        style={{ color: resultadoUi.color }}
      >
        <resultadoUi.Icon className="size-3.5" />
        {resultadoUi.label}
      </motion.div>
    </motion.div>
  );
}

function EstadoPill({
  config,
  muted,
}: {
  config: (typeof ESTADO_CONFIG)[EstadoRecurso];
  muted?: boolean;
}) {
  const Icon = config.icon;
  return (
    <div
      className="flex flex-col items-center gap-1.5 opacity-100"
      style={{ opacity: muted ? 0.6 : 1 }}
    >
      <div
        className="flex size-9 items-center justify-center rounded-full border"
        style={{
          color: config.color,
          backgroundColor: `color-mix(in srgb, ${config.color} 14%, transparent)`,
          borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
        }}
      >
        <Icon className="size-4" strokeWidth={2} />
      </div>
      <span className="text-[11px] font-medium text-ink-muted">{config.label}</span>
    </div>
  );
}
