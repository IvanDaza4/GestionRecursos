import { DatabaseZap } from "lucide-react";

export function SupabaseSetupNotice({ resource = "datos" }: { resource?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-accent/20 bg-accent/[0.06] px-4 py-3.5">
      <DatabaseZap className="size-4 text-accent mt-0.5 shrink-0" strokeWidth={1.9} />
      <div className="text-[13px] leading-relaxed">
        <p className="font-medium text-ink">Conectá un proyecto de Supabase</p>
        <p className="text-ink-muted mt-0.5">
          No se pudieron cargar los {resource}: faltan{" "}
          <code className="mono-data text-accent">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
          <code className="mono-data text-accent">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{" "}
          <code className="mono-data">.env.local</code>. Corré la migración en{" "}
          <code className="mono-data">supabase/migrations/0001_initial_schema.sql</code> y
          completá las variables (ver <code className="mono-data">.env.local.example</code>).
        </p>
      </div>
    </div>
  );
}
