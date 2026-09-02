export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * Interruptor de emergencia: saca el gate de login por completo.
 * Solo para desarrollo/preview — NUNCA activar en una instancia con datos
 * reales de la empresa (ver README, sección "Auth en stand-by").
 */
export const isAuthDisabled = process.env.DISABLE_AUTH === "true";

export const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
