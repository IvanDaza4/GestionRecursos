"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ROLE_LABEL, type UserRole } from "@/lib/constants";

const TITLES: { match: string; label: string }[] = [
  { match: "/dashboard", label: "Dashboard" },
  { match: "/recursos", label: "Recursos" },
  { match: "/entregas", label: "Entregas" },
  { match: "/devoluciones", label: "Devoluciones" },
  { match: "/empleados", label: "Empleados" },
  { match: "/solicitudes", label: "Solicitudes" },
  { match: "/reportes", label: "Reportes" },
  { match: "/administracion", label: "Administración" },
];

export function Topbar({
  nombre,
  apellido,
  role,
}: {
  nombre: string;
  apellido: string;
  role: UserRole;
}) {
  const pathname = usePathname();
  const title = TITLES.find((t) => pathname.startsWith(t.match))?.label ?? "Recursos";

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-white/8 bg-surface/60 backdrop-blur-sm sticky top-0 z-30">
      <h1 className="text-[15px] font-semibold text-ink tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notificaciones"
          className="relative flex size-8 items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-white/5 transition-colors"
        >
          <Bell className="size-4" strokeWidth={1.9} />
        </button>
        <div className="flex items-center gap-2.5">
          <Avatar nombre={nombre} apellido={apellido} size="sm" />
          <div className="leading-tight">
            <p className="text-[13px] font-medium text-ink">
              {nombre} {apellido}
            </p>
            <p className="text-[11px] text-ink-faint">{ROLE_LABEL[role]}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
