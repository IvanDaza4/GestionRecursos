import { createClient } from "@/lib/supabase/server";
import type { EstadoRecurso } from "@/lib/constants";

export async function getTiposRecurso() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tipos_recurso")
    .select("*")
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;
  return data;
}

export async function getAreas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;
  return data;
}

export interface EmpleadoConArea {
  id: string;
  nombre: string;
  apellido: string;
  legajo: string | null;
  email: string | null;
  puesto: string | null;
  area: { id: string; nombre: string } | null;
}

export async function getEmpleados() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empleados")
    .select("id, nombre, apellido, legajo, email, puesto, area:areas(id, nombre)")
    .eq("activo", true)
    .order("apellido")
    .returns<EmpleadoConArea[]>();

  if (error) throw error;
  return data;
}

export async function getEmpleadoById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empleados")
    .select("id, nombre, apellido, legajo, email, puesto, area:areas(id, nombre)")
    .eq("id", id)
    .maybeSingle()
    .returns<EmpleadoConArea>();

  if (error) throw error;
  return data;
}

export interface RecursoDisponible {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  numero_serie: string | null;
  estado_actual: EstadoRecurso;
  tipo_recurso: { nombre: string } | null;
}

export async function getRecursosDisponibles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recursos")
    .select("id, marca, modelo, codigo_interno, numero_serie, estado_actual, tipo_recurso:tipos_recurso(id, nombre)")
    .eq("activo", true)
    .eq("disponibilidad", "disponible")
    .order("fecha_creacion", { ascending: false })
    .returns<RecursoDisponible[]>();

  if (error) throw error;
  return data;
}
