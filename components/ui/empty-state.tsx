"use client";

import { motion } from "motion/react";
import { springPanel } from "@/lib/animations";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPanel}
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-md border border-dashed border-white/10"
    >
      <div className="relative mb-4 flex size-12 items-center justify-center rounded-full bg-accent/10 border border-accent/20 [&>svg]:size-5.5 [&>svg]:stroke-[1.75] [&>svg]:text-accent">
        {icon}
        <div className="absolute inset-0 rounded-full glow-accent opacity-40" />
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
