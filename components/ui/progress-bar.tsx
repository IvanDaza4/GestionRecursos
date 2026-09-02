"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
}: {
  value: number; // 0-100
  className?: string;
}) {
  return (
    <div className={cn("h-1 w-full rounded-full bg-white/8 overflow-hidden", className)}>
      <motion.div
        className="h-full rounded-full bg-accent"
        style={{ boxShadow: "0 0 12px -1px var(--accent-bright)" }}
        initial={false}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      />
    </div>
  );
}
