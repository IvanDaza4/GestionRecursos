"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/ui/count-up";
import { springPanel } from "@/lib/animations";

export function StatCard({
  icon,
  label,
  value,
  suffix = "",
  color = "var(--accent)",
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPanel, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="rounded-md border border-white/8 bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-medium text-ink-muted">{label}</span>
        <div
          className="flex size-7 items-center justify-center rounded-sm [&>svg]:size-3.5 [&>svg]:stroke-2"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
        >
          {icon}
        </div>
      </div>
      <CountUp value={value} suffix={suffix} className="text-2xl font-semibold text-ink tracking-tight mono-data" />
    </motion.div>
  );
}
