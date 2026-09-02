// Generado con `generate_typescript_types` contra el proyecto Supabase real
// (fpfgxfnxkkpfwvkfuxpg). Volver a generar si cambia el esquema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          activo: boolean
          creado_por: string | null
          descripcion: string | null
          fecha_actualizacion: string
          fecha_creacion: string
          id: string
          nombre: string
          responsable_id: string | null
        }
        Insert: {
          activo?: boolean
          creado_por?: string | null
          descripcion?: string | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: string
          nombre: string
          responsable_id?: string | null
        }
        Update: {
          activo?: boolean
          creado_por?: string | null
          descripcion?: string | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: string
          nombre?: string
          responsable_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_areas_creado_por"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_areas_responsable"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devolucion_fotos: {
        Row: {
          devolucion_id: string
          fecha_creacion: string
          id: string
          orden: number
          tipo_foto: Database["public"]["Enums"]["tipo_foto"]
          url: string
        }
        Insert: {
          devolucion_id: string
          fecha_creacion?: string
          id?: string
          orden?: number
          tipo_foto: Database["public"]["Enums"]["tipo_foto"]
          url: string
        }
        Update: {
          devolucion_id?: string
          fecha_creacion?: string
          id?: string
          orden?: number
          tipo_foto?: Database["public"]["Enums"]["tipo_foto"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "devolucion_fotos_devolucion_id_fkey"
            columns: ["devolucion_id"]
            isOneToOne: false
            referencedRelation: "devoluciones"
            referencedColumns: ["id"]
          },
        ]
      }
      devoluciones: {
        Row: {
          activo: boolean
          comparacion_resultado:
            | Database["public"]["Enums"]["comparacion_estado"]
            | null
          creado_por: string | null
          empleado_id: string
          entrega_id: string | null
          estado_devolucion: Database["public"]["Enums"]["estado_recurso"]
          fecha_creacion: string
          fecha_devolucion: string
          id: string
          observaciones: string | null
          recibido_por: string
          recurso_id: string
        }
        Insert: {
          activo?: boolean
          comparacion_resultado?:
            | Database["public"]["Enums"]["comparacion_estado"]
            | null
          creado_por?: string | null
          empleado_id: string
          entrega_id?: string | null
          estado_devolucion: Database["public"]["Enums"]["estado_recurso"]
          fecha_creacion?: string
          fecha_devolucion?: string
          id?: string
          observaciones?: string | null
          recibido_por: string
          recurso_id: string
        }
        Update: {
          activo?: boolean
          comparacion_resultado?:
            | Database["public"]["Enums"]["comparacion_estado"]
            | null
          creado_por?: string | null
          empleado_id?: string
          entrega_id?: string | null
          estado_devolucion?: Database["public"]["Enums"]["estado_recurso"]
          fecha_creacion?: string
          fecha_devolucion?: string
          id?: string
          observaciones?: string | null
          recibido_por?: string
          recurso_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devoluciones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devoluciones_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devoluciones_entrega_id_fkey"
            columns: ["entrega_id"]
            isOneToOne: false
            referencedRelation: "entregas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devoluciones_recibido_por_fkey"
            columns: ["recibido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devoluciones_recurso_id_fkey"
            columns: ["recurso_id"]
            isOneToOne: false
            referencedRelation: "recursos"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados: {
        Row: {
          activo: boolean
          apellido: string
          area_id: string | null
          creado_por: string | null
          email: string | null
          fecha_actualizacion: string
          fecha_baja: string | null
          fecha_creacion: string
          fecha_ingreso: string | null
          id: string
          legajo: string | null
          motivo_baja: string | null
          nombre: string
          puesto: string | null
        }
        Insert: {
          activo?: boolean
          apellido: string
          area_id?: string | null
          creado_por?: string | null
          email?: string | null
          fecha_actualizacion?: string
          fecha_baja?: string | null
          fecha_creacion?: string
          fecha_ingreso?: string | null
          id?: string
          legajo?: string | null
          motivo_baja?: string | null
          nombre: string
          puesto?: string | null
        }
        Update: {
          activo?: boolean
          apellido?: string
          area_id?: string | null
          creado_por?: string | null
          email?: string | null
          fecha_actualizacion?: string
          fecha_baja?: string | null
          fecha_creacion?: string
          fecha_ingreso?: string | null
          id?: string
          legajo?: string | null
          motivo_baja?: string | null
          nombre?: string
          puesto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      entrega_fotos: {
        Row: {
          entrega_id: string
          fecha_creacion: string
          id: string
          orden: number
          tipo_foto: Database["public"]["Enums"]["tipo_foto"]
          url: string
        }
        Insert: {
          entrega_id: string
          fecha_creacion?: string
          id?: string
          orden?: number
          tipo_foto: Database["public"]["Enums"]["tipo_foto"]
          url: string
        }
        Update: {
          entrega_id?: string
          fecha_creacion?: string
          id?: string
          orden?: number
          tipo_foto?: Database["public"]["Enums"]["tipo_foto"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "entrega_fotos_entrega_id_fkey"
            columns: ["entrega_id"]
            isOneToOne: false
            referencedRelation: "entregas"
            referencedColumns: ["id"]
          },
        ]
      }
      entregas: {
        Row: {
          aceptado: boolean
          activo: boolean
          area_id: string | null
          creado_por: string | null
          empleado_id: string
          entregado_por: string
          estado_entrega: Database["public"]["Enums"]["estado_recurso"]
          fecha_aceptacion: string | null
          fecha_creacion: string
          fecha_entrega: string
          firma_url: string | null
          id: string
          observaciones: string | null
          recurso_id: string
        }
        Insert: {
          aceptado?: boolean
          activo?: boolean
          area_id?: string | null
          creado_por?: string | null
          empleado_id: string
          entregado_por: string
          estado_entrega: Database["public"]["Enums"]["estado_recurso"]
          fecha_aceptacion?: string | null
          fecha_creacion?: string
          fecha_entrega?: string
          firma_url?: string | null
          id?: string
          observaciones?: string | null
          recurso_id: string
        }
        Update: {
          aceptado?: boolean
          activo?: boolean
          area_id?: string | null
          creado_por?: string | null
          empleado_id?: string
          entregado_por?: string
          estado_entrega?: Database["public"]["Enums"]["estado_recurso"]
          fecha_aceptacion?: string | null
          fecha_creacion?: string
          fecha_entrega?: string
          firma_url?: string | null
          id?: string
          observaciones?: string | null
          recurso_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_entregado_por_fkey"
            columns: ["entregado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_recurso_id_fkey"
            columns: ["recurso_id"]
            isOneToOne: false
            referencedRelation: "recursos"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_recurso: {
        Row: {
          actor_id: string | null
          descripcion: string | null
          fecha_evento: string
          id: string
          metadata: Json | null
          recurso_id: string
          referencia_id: string | null
          referencia_tabla: string | null
          tipo_evento: Database["public"]["Enums"]["tipo_evento"]
        }
        Insert: {
          actor_id?: string | null
          descripcion?: string | null
          fecha_evento?: string
          id?: string
          metadata?: Json | null
          recurso_id: string
          referencia_id?: string | null
          referencia_tabla?: string | null
          tipo_evento: Database["public"]["Enums"]["tipo_evento"]
        }
        Update: {
          actor_id?: string | null
          descripcion?: string | null
          fecha_evento?: string
          id?: string
          metadata?: Json | null
          recurso_id?: string
          referencia_id?: string | null
          referencia_tabla?: string | null
          tipo_evento?: Database["public"]["Enums"]["tipo_evento"]
        }
        Relationships: [
          {
            foreignKeyName: "eventos_recurso_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_recurso_recurso_id_fkey"
            columns: ["recurso_id"]
            isOneToOne: false
            referencedRelation: "recursos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activo: boolean
          apellido: string
          area_id: string | null
          creado_por: string | null
          email: string
          fecha_actualizacion: string
          fecha_creacion: string
          id: string
          nombre: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          activo?: boolean
          apellido: string
          area_id?: string | null
          creado_por?: string | null
          email: string
          fecha_actualizacion?: string
          fecha_creacion?: string
          id: string
          nombre: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          activo?: boolean
          apellido?: string
          area_id?: string | null
          creado_por?: string | null
          email?: string
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: string
          nombre?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recursos: {
        Row: {
          activo: boolean
          codigo_interno: string | null
          creado_por: string | null
          descripcion: string | null
          disponibilidad: Database["public"]["Enums"]["disponibilidad_recurso"]
          estado_actual: Database["public"]["Enums"]["estado_recurso"]
          fecha_actualizacion: string
          fecha_alta: string
          fecha_baja: string | null
          fecha_creacion: string
          id: string
          imei: string | null
          marca: string | null
          modelo: string | null
          motivo_baja: string | null
          numero_serie: string | null
          tipo_recurso_id: string
        }
        Insert: {
          activo?: boolean
          codigo_interno?: string | null
          creado_por?: string | null
          descripcion?: string | null
          disponibilidad?: Database["public"]["Enums"]["disponibilidad_recurso"]
          estado_actual?: Database["public"]["Enums"]["estado_recurso"]
          fecha_actualizacion?: string
          fecha_alta?: string
          fecha_baja?: string | null
          fecha_creacion?: string
          id?: string
          imei?: string | null
          marca?: string | null
          modelo?: string | null
          motivo_baja?: string | null
          numero_serie?: string | null
          tipo_recurso_id: string
        }
        Update: {
          activo?: boolean
          codigo_interno?: string | null
          creado_por?: string | null
          descripcion?: string | null
          disponibilidad?: Database["public"]["Enums"]["disponibilidad_recurso"]
          estado_actual?: Database["public"]["Enums"]["estado_recurso"]
          fecha_actualizacion?: string
          fecha_alta?: string
          fecha_baja?: string | null
          fecha_creacion?: string
          id?: string
          imei?: string | null
          marca?: string | null
          modelo?: string | null
          motivo_baja?: string | null
          numero_serie?: string | null
          tipo_recurso_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recursos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recursos_tipo_recurso_id_fkey"
            columns: ["tipo_recurso_id"]
            isOneToOne: false
            referencedRelation: "tipos_recurso"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes: {
        Row: {
          aprobado_por: string | null
          area_id: string | null
          creado_por: string | null
          descripcion: string | null
          empleado_id: string
          entrega_id: string | null
          estado: Database["public"]["Enums"]["estado_solicitud"]
          fecha_actualizacion: string
          fecha_creacion: string
          fecha_resolucion: string | null
          fecha_solicitud: string
          id: string
          observaciones: string | null
          solicitado_por: string | null
          tipo_recurso_id: string | null
        }
        Insert: {
          aprobado_por?: string | null
          area_id?: string | null
          creado_por?: string | null
          descripcion?: string | null
          empleado_id: string
          entrega_id?: string | null
          estado?: Database["public"]["Enums"]["estado_solicitud"]
          fecha_actualizacion?: string
          fecha_creacion?: string
          fecha_resolucion?: string | null
          fecha_solicitud?: string
          id?: string
          observaciones?: string | null
          solicitado_por?: string | null
          tipo_recurso_id?: string | null
        }
        Update: {
          aprobado_por?: string | null
          area_id?: string | null
          creado_por?: string | null
          descripcion?: string | null
          empleado_id?: string
          entrega_id?: string | null
          estado?: Database["public"]["Enums"]["estado_solicitud"]
          fecha_actualizacion?: string
          fecha_creacion?: string
          fecha_resolucion?: string | null
          fecha_solicitud?: string
          id?: string
          observaciones?: string | null
          solicitado_por?: string | null
          tipo_recurso_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_aprobado_por_fkey"
            columns: ["aprobado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_empleado_id_fkey"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_entrega_id_fkey"
            columns: ["entrega_id"]
            isOneToOne: false
            referencedRelation: "entregas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_solicitado_por_fkey"
            columns: ["solicitado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_tipo_recurso_id_fkey"
            columns: ["tipo_recurso_id"]
            isOneToOne: false
            referencedRelation: "tipos_recurso"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_recurso: {
        Row: {
          activo: boolean
          categoria: string
          fecha_creacion: string
          id: string
          nombre: string
          requiere_imei: boolean
          requiere_serie: boolean
        }
        Insert: {
          activo?: boolean
          categoria?: string
          fecha_creacion?: string
          id?: string
          nombre: string
          requiere_imei?: boolean
          requiere_serie?: boolean
        }
        Update: {
          activo?: boolean
          categoria?: string
          fecha_creacion?: string
          id?: string
          nombre?: string
          requiere_imei?: boolean
          requiere_serie?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_area: { Args: never; Returns: string }
      current_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_rrhh_or_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      comparacion_estado: "mejoro" | "igual" | "empeoro"
      disponibilidad_recurso:
        | "disponible"
        | "asignado"
        | "en_reparacion"
        | "baja"
      estado_recurso: "nuevo" | "muy_bueno" | "bueno" | "regular" | "danado"
      estado_solicitud: "pendiente" | "aprobada" | "entregada" | "rechazada"
      tipo_evento:
        | "alta_recurso"
        | "entrega"
        | "devolucion"
        | "reparacion"
        | "cambio_estado"
        | "baja_recurso"
        | "solicitud_creada"
        | "solicitud_resuelta"
      tipo_foto: "frontal" | "dorso" | "detalle" | "otro"
      user_role: "rrhh" | "jefe_area" | "administrador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type EstadoRecurso = Database["public"]["Enums"]["estado_recurso"]
export type DisponibilidadRecurso = Database["public"]["Enums"]["disponibilidad_recurso"]
export type EstadoSolicitud = Database["public"]["Enums"]["estado_solicitud"]
export type TipoFoto = Database["public"]["Enums"]["tipo_foto"]
export type TipoEvento = Database["public"]["Enums"]["tipo_evento"]
export type ComparacionEstado = Database["public"]["Enums"]["comparacion_estado"]
export type UserRole = Database["public"]["Enums"]["user_role"]

type DefaultSchema = Database["public"]

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
  Row: infer R
}
  ? R
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
  Insert: infer I
}
  ? I
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
  Update: infer U
}
  ? U
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"],
> = DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
