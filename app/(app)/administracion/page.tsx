import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Administración" };

export default function AdministracionPage() {
  return (
    <EmptyState
      icon={<Settings />}
      title="Administración en construcción"
      description="Gestión de usuarios, roles, permisos y catálogos (tipos de recurso, áreas, estados) se suma en la próxima etapa."
    />
  );
}
