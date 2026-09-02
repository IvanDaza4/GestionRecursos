import type { Metadata } from "next";
import { Boxes, PackageCheck, Wrench, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { DisponibilidadChart } from "@/components/dashboard/disponibilidad-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AlertList } from "@/components/dashboard/alert-list";
import { SupabaseSetupNotice } from "@/components/ui/setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDashboardStats } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice resource="indicadores del dashboard" />;
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Boxes />} label="Recursos activos" value={stats.totalRecursos} color="var(--accent)" index={0} />
        <StatCard icon={<PackageCheck />} label="Entregas este mes" value={stats.entregasDelMes} color="var(--nuevo)" index={1} />
        <StatCard icon={<Wrench />} label="En reparación" value={stats.enReparacion} color="var(--bueno)" index={2} />
        <StatCard icon={<ClipboardList />} label="Solicitudes pendientes" value={stats.solicitudesPendientes} color="var(--regular)" index={3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <DisponibilidadChart
          total={stats.totalRecursos}
          segmentos={[
            { label: "Disponibles", value: stats.disponibles, color: "var(--nuevo)" },
            { label: "Asignados", value: stats.asignados, color: "var(--accent)" },
            { label: "En reparación", value: stats.enReparacion, color: "var(--bueno)" },
          ]}
        />
        <AlertList
          titulo="Estado deteriorado"
          recursos={stats.recursosDeteriorados}
          variant="estado"
        />
        <AlertList
          titulo="Antigüedad elevada"
          recursos={stats.recursosAntiguos}
          variant="antiguedad"
        />
      </div>

      <ActivityFeed eventos={stats.eventosRecientes} />
    </div>
  );
}
