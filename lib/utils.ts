import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Node (SSR) y los navegadores pueden usar espacios distintos (angosto vs.
 * normal) en el mismo formato de Intl — normalizamos para evitar mismatches
 * de hidratación entre servidor y cliente.
 */
function normalizarEspacios(value: string) {
  return value.replace(/[  ]/g, " ");
}

export function formatFecha(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return normalizarEspacios(
    new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date),
  );
}

export function formatFechaHora(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return normalizarEspacios(
    new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date),
  );
}

export function iniciales(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}
