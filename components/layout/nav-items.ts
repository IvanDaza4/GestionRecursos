import {
  LayoutDashboard,
  Package,
  ArrowUpRight,
  ArrowDownToLine,
  Users,
  ClipboardCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recursos", label: "Inventario", icon: Package },
  { href: "/entregas", label: "Entregas", icon: ArrowUpRight },
  { href: "/devoluciones", label: "Devoluciones", icon: ArrowDownToLine },
  { href: "/empleados", label: "Empleados", icon: Users },
  { href: "/solicitudes", label: "Solicitudes", icon: ClipboardCheck },
  { href: "/auditoria", label: "Auditoría", icon: ShieldCheck },
];
