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

export type Tono = "blue" | "green" | "amber" | "rose";

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

export const ESTADO_CONFIG: Record<EstadoRecurso, { label: string; tono: Tono; icon: LucideIcon }> = {
  nuevo: { label: "Nuevo", tono: "blue", icon: Sparkles },
  muy_bueno: { label: "Muy bueno", tono: "green", icon: CircleCheck },
  bueno: { label: "Bueno", tono: "green", icon: ThumbsUp },
  regular: { label: "Regular", tono: "amber", icon: CircleAlert },
  danado: { label: "Dañado", tono: "rose", icon: CircleX },
};

export type DisponibilidadRecurso = "disponible" | "asignado" | "en_reparacion" | "baja";

export const DISPONIBILIDAD_CONFIG: Record<DisponibilidadRecurso, { label: string; tono: Tono }> = {
  disponible: { label: "Disponible", tono: "green" },
  asignado: { label: "Asignado", tono: "blue" },
  en_reparacion: { label: "En reparación", tono: "amber" },
  baja: { label: "Baja", tono: "rose" },
};

export type EstadoSolicitud = "pendiente" | "aprobada" | "entregada" | "rechazada";

export const ESTADO_SOLICITUD_CONFIG: Record<EstadoSolicitud, { label: string; tono: Tono }> = {
  pendiente: { label: "Pendiente", tono: "amber" },
  aprobada: { label: "Aprobada", tono: "blue" },
  entregada: { label: "Entregada", tono: "green" },
  rechazada: { label: "Rechazada", tono: "rose" },
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

export const TIPO_EVENTO_CONFIG: Record<TipoEvento, { label: string; icon: LucideIcon; tono: Tono }> = {
  alta_recurso: { label: "Alta de recurso", icon: PlusCircle, tono: "blue" },
  entrega: { label: "Entrega", icon: PackageCheck, tono: "green" },
  devolucion: { label: "Devolución", icon: Undo2, tono: "blue" },
  reparacion: { label: "Reparación", icon: Wrench, tono: "amber" },
  cambio_estado: { label: "Cambio de estado", icon: RefreshCw, tono: "amber" },
  baja_recurso: { label: "Baja", icon: Trash2, tono: "rose" },
  solicitud_creada: { label: "Solicitud creada", icon: ClipboardList, tono: "blue" },
  solicitud_resuelta: { label: "Solicitud resuelta", icon: ClipboardCheck, tono: "green" },
};

export type UserRole = "rrhh" | "jefe_area" | "administrador";

export const ROLE_LABEL: Record<UserRole, string> = {
  rrhh: "RRHH",
  jefe_area: "Jefe de área",
  administrador: "Administrador",
};
