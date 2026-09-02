"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/animations";

export interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -2, borderColor: "rgba(34,211,238,0.25)" } : undefined}
        transition={springSnappy}
        className={cn(
          "rounded-md border border-white/8 bg-card p-5",
          interactive && "cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
Card.displayName = "Card";
