// Tipos manuales alineados a supabase/migrations/0001_initial_schema.sql
// Reemplazar por `supabase gen types typescript` una vez creado el proyecto real.

export type EstadoRecurso = "nuevo" | "muy_bueno" | "bueno" | "regular" | "danado";
export type DisponibilidadRecurso = "disponible" | "asignado" | "en_reparacion" | "baja";
export type EstadoSolicitud = "pendiente" | "aprobada" | "entregada" | "rechazada";
export type TipoFoto = "frontal" | "dorso" | "detalle" | "otro";
export type TipoEvento =
  | "alta_recurso"
  | "entrega"
  | "devolucion"
  | "reparacion"
  | "cambio_estado"
  | "baja_recurso"
  | "solicitud_creada"
  | "solicitud_resuelta";
export type ComparacionEstado = "mejoro" | "igual" | "empeoro";
export type UserRole = "rrhh" | "jefe_area" | "administrador";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          email: string;
          role: UserRole;
          area_id: string | null;
          activo: boolean;
          creado_por: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          nombre: string;
          apellido: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      areas: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          responsable_id: string | null;
          activo: boolean;
          creado_por: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["areas"]["Row"]> & { nombre: string };
        Update: Partial<Database["public"]["Tables"]["areas"]["Row"]>;
        Relationships: [];
      };
      empleados: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          legajo: string | null;
          email: string | null;
          area_id: string | null;
          puesto: string | null;
          fecha_ingreso: string | null;
          activo: boolean;
          fecha_baja: string | null;
          motivo_baja: string | null;
          creado_por: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["empleados"]["Row"]> & {
          nombre: string;
          apellido: string;
        };
        Update: Partial<Database["public"]["Tables"]["empleados"]["Row"]>;
        Relationships: [];
      };
      tipos_recurso: {
        Row: {
          id: string;
          nombre: string;
          categoria: string;
          requiere_serie: boolean;
          requiere_imei: boolean;
          activo: boolean;
          fecha_creacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tipos_recurso"]["Row"]> & { nombre: string };
        Update: Partial<Database["public"]["Tables"]["tipos_recurso"]["Row"]>;
        Relationships: [];
      };
      recursos: {
        Row: {
          id: string;
          tipo_recurso_id: string;
          codigo_interno: string | null;
          marca: string | null;
          modelo: string | null;
          numero_serie: string | null;
          imei: string | null;
          descripcion: string | null;
          estado_actual: EstadoRecurso;
          disponibilidad: DisponibilidadRecurso;
          fecha_alta: string;
          activo: boolean;
          fecha_baja: string | null;
          motivo_baja: string | null;
          creado_por: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["recursos"]["Row"]> & {
          tipo_recurso_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["recursos"]["Row"]>;
        Relationships: [];
      };
      entregas: {
        Row: {
          id: string;
          recurso_id: string;
          empleado_id: string;
          area_id: string | null;
          entregado_por: string;
          fecha_entrega: string;
          estado_entrega: EstadoRecurso;
          observaciones: string | null;
          aceptado: boolean;
          fecha_aceptacion: string | null;
          firma_url: string | null;
          activo: boolean;
          creado_por: string | null;
          fecha_creacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["entregas"]["Row"]> & {
          recurso_id: string;
          empleado_id: string;
          entregado_por: string;
          estado_entrega: EstadoRecurso;
        };
        Update: Partial<Database["public"]["Tables"]["entregas"]["Row"]>;
        Relationships: [];
      };
      entrega_fotos: {
        Row: {
          id: string;
          entrega_id: string;
          tipo_foto: TipoFoto;
          url: string;
          orden: number;
          fecha_creacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["entrega_fotos"]["Row"]> & {
          entrega_id: string;
          tipo_foto: TipoFoto;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["entrega_fotos"]["Row"]>;
        Relationships: [];
      };
      devoluciones: {
        Row: {
          id: string;
          entrega_id: string | null;
          recurso_id: string;
          empleado_id: string;
          recibido_por: string;
          fecha_devolucion: string;
          estado_devolucion: EstadoRecurso;
          comparacion_resultado: ComparacionEstado | null;
          observaciones: string | null;
          activo: boolean;
          creado_por: string | null;
          fecha_creacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["devoluciones"]["Row"]> & {
          recurso_id: string;
          empleado_id: string;
          recibido_por: string;
          estado_devolucion: EstadoRecurso;
        };
        Update: Partial<Database["public"]["Tables"]["devoluciones"]["Row"]>;
        Relationships: [];
      };
      devolucion_fotos: {
        Row: {
          id: string;
          devolucion_id: string;
          tipo_foto: TipoFoto;
          url: string;
          orden: number;
          fecha_creacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["devolucion_fotos"]["Row"]> & {
          devolucion_id: string;
          tipo_foto: TipoFoto;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["devolucion_fotos"]["Row"]>;
        Relationships: [];
      };
      solicitudes: {
        Row: {
          id: string;
          empleado_id: string;
          area_id: string | null;
          tipo_recurso_id: string | null;
          descripcion: string | null;
          estado: EstadoSolicitud;
          solicitado_por: string | null;
          aprobado_por: string | null;
          entrega_id: string | null;
          fecha_solicitud: string;
          fecha_resolucion: string | null;
          observaciones: string | null;
          creado_por: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: Partial<Database["public"]["Tables"]["solicitudes"]["Row"]> & {
          empleado_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["solicitudes"]["Row"]>;
        Relationships: [];
      };
      eventos_recurso: {
        Row: {
          id: string;
          recurso_id: string;
          tipo_evento: TipoEvento;
          referencia_tabla: string | null;
          referencia_id: string | null;
          descripcion: string | null;
          actor_id: string | null;
          metadata: Record<string, unknown> | null;
          fecha_evento: string;
        };
        Insert: Partial<Database["public"]["Tables"]["eventos_recurso"]["Row"]> & {
          recurso_id: string;
          tipo_evento: TipoEvento;
        };
        Update: Partial<Database["public"]["Tables"]["eventos_recurso"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
