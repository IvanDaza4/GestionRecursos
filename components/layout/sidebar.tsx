"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Boxes,
  PackageCheck,
  Undo2,
  Users,
  ClipboardList,
  FileBarChart,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recursos", label: "Recursos", icon: Boxes },
  { href: "/entregas", label: "Entregas", icon: PackageCheck },
  { href: "/devoluciones", label: "Devoluciones", icon: Undo2 },
  { href: "/empleados", label: "Empleados", icon: Users },
  { href: "/solicitudes", label: "Solicitudes", icon: ClipboardList },
  { href: "/reportes", label: "Reportes", icon: FileBarChart },
  { href: "/administracion", label: "Administración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/8 bg-surface">
      <div className="flex items-center gap-2 h-16 px-5 border-b border-white/8">
        <div className="flex size-7 items-center justify-center rounded-sm bg-accent/15 border border-accent/25">
          <Zap className="size-3.5 text-accent" strokeWidth={2.25} />
        </div>
        <span className="text-sm font-semibold tracking-tight text-ink">
          Ingnala <span className="text-ink-faint font-normal">· Recursos</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-sm px-3 h-9 text-[13px] font-medium transition-colors",
                active ? "text-ink" : "text-ink-muted hover:text-ink hover:bg-white/5",
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-sm bg-accent/10 border border-accent/20"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="size-4 relative z-10" strokeWidth={1.9} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
