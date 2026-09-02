import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, apellido, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <AppShell
      user={{
        nombre: profile?.nombre ?? "Usuario",
        apellido: profile?.apellido ?? "",
        role: profile?.role ?? "rrhh",
      }}
    >
      {children}
    </AppShell>
  );
}
