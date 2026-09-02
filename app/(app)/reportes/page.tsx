import type { Metadata } from "next";
import { FileBarChart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Reportes" };

export default function ReportesPage() {
  return (
    <EmptyState
      icon={<FileBarChart />}
      title="Reportes en construcción"
      description="Los exportables en PDF/Excel de recursos por estado, entregas por período e incidencias se suman en la próxima etapa."
    />
  );
}
