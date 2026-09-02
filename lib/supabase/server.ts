import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";
import { isAuthDisabled, hasServiceRoleKey } from "./config";

export async function createClient() {
  if (isAuthDisabled && hasServiceRoleKey) {
    // Sin sesión de usuario (auth en stand-by): usamos la service role key
    // para que las lecturas/escrituras no choquen contra RLS. Esto bypassa
    // toda la seguridad de fila — ver README, sección "Auth en stand-by".
    return createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Se llama desde un Server Component sin permiso de escritura;
            // el proxy ya se encarga de refrescar la sesión en ese caso.
          }
        },
      },
    },
  );
}
