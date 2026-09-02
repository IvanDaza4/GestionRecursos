import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recursos | Gestión operativa",
  description: "Sistema de gestión de inventario, entregas y devoluciones.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f6fb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-background">
      <body className="antialiased">{children}</body>
    </html>
  );
}
