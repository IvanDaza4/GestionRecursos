import { cn } from "@/lib/utils";
import { ESTADO_CONFIG, type EstadoRecurso } from "@/lib/constants";

export function EstadoBadge({
  estado,
  size = "md",
  className,
}: {
  estado: EstadoRecurso;
  size?: "sm" | "md";
  className?: string;
}) {
  const config = ESTADO_CONFIG[estado];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs font-medium border",
        size === "sm" ? "h-6 px-2 text-[11px]" : "h-7 px-2.5 text-xs",
        className,
      )}
      style={{
        color: config.color,
        backgroundColor: `color-mix(in srgb, ${config.color} 14%, transparent)`,
        borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
      }}
    >
      <Icon className={size === "sm" ? "size-3" : "size-3.5"} strokeWidth={2} />
      {config.label}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 rounded-xs text-[11px] font-medium border",
        tone === "neutral" && "text-ink-muted bg-white/5 border-white/10",
        tone === "accent" && "text-accent bg-accent/10 border-accent/25",
        className,
      )}
    >
      {children}
    </span>
  );
}
