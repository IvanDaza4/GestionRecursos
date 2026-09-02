"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, X, Menu, ChevronRight, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { logout } from "@/lib/actions/auth";
import { ROLE_LABEL, type UserRole } from "@/lib/constants";
import { iniciales } from "@/lib/utils";

interface AppShellProps {
  user: { nombre: string; apellido: string; role: UserRole };
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => pathname.startsWith(item.href));

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Box size={21} />
          </div>
          <div>
            <strong>Recursos</strong>
            <span>Gestión operativa</span>
          </div>
          <button className="mobile-close icon-button" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <X size={18} />
          </button>
        </div>
        <p className="nav-label">ESPACIO DE TRABAJO</p>
        <nav>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{iniciales(user.nombre, user.apellido)}</div>
            <div>
              <strong>
                {user.nombre} {user.apellido}
              </strong>
              <span>{ROLE_LABEL[user.role]}</span>
            </div>
            <form action={logout}>
              <button type="submit" className="icon-button" aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <button className="menu-toggle icon-button" onClick={() => setOpen(true)} aria-label="Abrir menú">
            <Menu size={21} />
          </button>
          <div className="crumb">
            <span>Gestión de recursos</span>
            <ChevronRight size={14} />
            <b>{current?.label ?? "Vista general"}</b>
          </div>
        </header>
        {open && <button className="sidebar-overlay" aria-label="Cerrar menú" onClick={() => setOpen(false)} />}
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
