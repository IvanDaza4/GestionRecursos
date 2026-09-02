import { cn } from "@/lib/utils";

export function Avatar({
  nombre,
  apellido,
  size = "md",
  className,
}: {
  nombre: string;
  apellido: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "size-7 text-[10px]",
    md: "size-9 text-xs",
    lg: "size-12 text-sm",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold shrink-0",
        "bg-accent/12 text-accent border border-accent/20",
        sizes[size],
        className,
      )}
    >
      {nombre.charAt(0)}
      {apellido.charAt(0)}
    </div>
  );
}
