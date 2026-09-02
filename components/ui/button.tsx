"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/animations";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-ink-inverse hover:bg-accent-bright disabled:hover:bg-accent",
  secondary:
    "bg-elevated text-ink border border-white/10 hover:bg-surface-hover",
  ghost: "bg-transparent text-ink-muted hover:text-ink hover:bg-white/5",
  danger: "bg-danado/15 text-danado border border-danado/30 hover:bg-danado/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
};

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { scale: 1.02 }}
        whileTap={disabled || loading ? undefined : { scale: 0.97 }}
        transition={springSnappy}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-sm font-medium whitespace-nowrap",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
