import type { EstadoRecurso } from "@/lib/constants";

export interface RecursoOption {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  numero_serie: string | null;
  estado_actual: EstadoRecurso;
  tipo_recurso: { nombre: string } | null;
}

export interface EmpleadoOption {
  id: string;
  nombre: string;
  apellido: string;
  legajo: string | null;
  area: { id: string; nombre: string } | null;
}

export interface EntregaActivaOption {
  entregaId: string;
  recurso: RecursoOption;
  empleado: EmpleadoOption;
  estadoEntrega: EstadoRecurso;
}
