"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <motion.div
                animate={{
                  scale: active ? 1.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                  done && "bg-accent border-accent text-ink-inverse",
                  active && !done && "border-accent text-accent glow-accent",
                  !active && !done && "border-white/15 text-ink-faint",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "text-[11px] font-medium hidden sm:block whitespace-nowrap",
                  active ? "text-ink" : "text-ink-faint",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-2 bg-white/10 relative top-[-10px] sm:top-[-14px]">
                <motion.div
                  className="h-full bg-accent"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
