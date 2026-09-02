import { getCurrentProfile } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PageTransition } from "@/components/layout/page-transition";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <div className="flex h-full min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          nombre={profile?.nombre ?? "Usuario"}
          apellido={profile?.apellido ?? ""}
          role={profile?.role ?? "rrhh"}
        />
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8 max-w-[1400px] w-full mx-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
