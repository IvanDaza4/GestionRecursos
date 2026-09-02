"use client";

import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { springPanel } from "@/lib/animations";

interface Segmento {
  label: string;
  value: number;
  color: string;
}

export function DisponibilidadChart({ segmentos, total }: { segmentos: Segmento[]; total: number }) {
  const data = segmentos.filter((s) => s.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPanel}
      className="rounded-md border border-white/8 bg-card p-5"
    >
      <h3 className="text-[13px] font-semibold text-ink mb-1">Inventario por disponibilidad</h3>
      <p className="text-[11.5px] text-ink-faint mb-2">{total} recursos activos</p>

      <div className="relative h-[180px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[12px] text-ink-faint">
            Sin datos
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  strokeWidth={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {data.map((s) => (
                    <Cell key={s.label} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-semibold text-ink mono-data">{total}</span>
              <span className="text-[10px] text-ink-faint">total</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-3">
        {segmentos.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2 text-ink-muted">
              <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="text-ink font-medium mono-data">{s.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
