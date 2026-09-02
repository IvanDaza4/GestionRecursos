import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  ThumbsUp,
  CircleCheck,
  CircleAlert,
  CircleX,
  PlusCircle,
  PackageCheck,
  Undo2,
  Wrench,
  RefreshCw,
  Trash2,
  ClipboardList,
  ClipboardCheck,
} from "lucide-react";

export type EstadoRecurso = "nuevo" | "muy_bueno" | "bueno" | "regular" | "danado";

export const ESTADOS_RECURSO: EstadoRecurso[] = [
  "nuevo",
  "muy_bueno",
  "bueno",
  "regular",
  "danado",
];

export const ESTADO_RANK: Record<EstadoRecurso, number> = {
  nuevo: 5,
  muy_bueno: 4,
  bueno: 3,
  regular: 2,
  danado: 1,
};

export const ESTADO_CONFIG: Record<
  EstadoRecurso,
  { label: string; color: string; icon: LucideIcon }
> = {
  nuevo: { label: "Nuevo", color: "var(--nuevo)", icon: Sparkles },
  muy_bueno: { label: "Muy bueno", color: "var(--muybueno)", icon: CircleCheck },
  bueno: { label: "Bueno", color: "var(--bueno)", icon: ThumbsUp },
  regular: { label: "Regular", color: "var(--regular)", icon: CircleAlert },
  danado: { label: "Dañado", color: "var(--danado)", icon: CircleX },
};

export type DisponibilidadRecurso = "disponible" | "asignado" | "en_reparacion" | "baja";

export const DISPONIBILIDAD_CONFIG: Record<DisponibilidadRecurso, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "var(--nuevo)" },
  asignado: { label: "Asignado", color: "var(--accent)" },
  en_reparacion: { label: "En reparación", color: "var(--bueno)" },
  baja: { label: "Baja", color: "var(--danado)" },
};

export type EstadoSolicitud = "pendiente" | "aprobada" | "entregada" | "rechazada";

export const ESTADO_SOLICITUD_CONFIG: Record<
  EstadoSolicitud,
  { label: string; color: string }
> = {
  pendiente: { label: "Pendiente", color: "var(--regular)" },
  aprobada: { label: "Aprobada", color: "var(--accent)" },
  entregada: { label: "Entregada", color: "var(--nuevo)" },
  rechazada: { label: "Rechazada", color: "var(--danado)" },
};

export type TipoFoto = "frontal" | "dorso" | "detalle" | "otro";

export const TIPOS_FOTO: { value: TipoFoto; label: string }[] = [
  { value: "frontal", label: "Frontal" },
  { value: "dorso", label: "Dorso" },
  { value: "detalle", label: "Detalle" },
  { value: "otro", label: "Otro" },
];

export type TipoEvento =
  | "alta_recurso"
  | "entrega"
  | "devolucion"
  | "reparacion"
  | "cambio_estado"
  | "baja_recurso"
  | "solicitud_creada"
  | "solicitud_resuelta";

export const TIPO_EVENTO_CONFIG: Record<TipoEvento, { label: string; icon: LucideIcon; color: string }> = {
  alta_recurso: { label: "Alta de recurso", icon: PlusCircle, color: "var(--accent)" },
  entrega: { label: "Entrega", icon: PackageCheck, color: "var(--nuevo)" },
  devolucion: { label: "Devolución", icon: Undo2, color: "var(--accent)" },
  reparacion: { label: "Reparación", icon: Wrench, color: "var(--bueno)" },
  cambio_estado: { label: "Cambio de estado", icon: RefreshCw, color: "var(--regular)" },
  baja_recurso: { label: "Baja", icon: Trash2, color: "var(--danado)" },
  solicitud_creada: { label: "Solicitud creada", icon: ClipboardList, color: "var(--ink-muted)" },
  solicitud_resuelta: { label: "Solicitud resuelta", icon: ClipboardCheck, color: "var(--nuevo)" },
};

export type UserRole = "rrhh" | "jefe_area" | "administrador";

export const ROLE_LABEL: Record<UserRole, string> = {
  rrhh: "RRHH",
  jefe_area: "Jefe de área",
  administrador: "Administrador",
};
