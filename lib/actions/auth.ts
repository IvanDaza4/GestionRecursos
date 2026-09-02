"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed" || /email.*not.*confirm/i.test(error.message)) {
      return {
        error:
          "Tu email todavía no está confirmado. En Supabase, Authentication → Users → tu usuario → confirmá el email (o recreá el usuario tildando \"Auto Confirm User\").",
      };
    }
    return { error: "Credenciales inválidas. Verificá tu email y contraseña." };
  }

  redirect(next);
}

export interface DemoLoginState {
  error?: string;
}

/**
 * Login de un click con una cuenta fija, solo para mostrar el sistema.
 * Las credenciales viven en variables de entorno del servidor (nunca llegan
 * al navegador) y el botón ni siquiera se renderiza si no están seteadas.
 */
export async function loginDemo(): Promise<DemoLoginState> {
  const email = process.env.DEMO_LOGIN_EMAIL;
  const password = process.env.DEMO_LOGIN_PASSWORD;

  if (!email || !password) {
    return { error: "El acceso demo no está configurado en este entorno." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "El acceso demo falló. Revisá la cuenta configurada en DEMO_LOGIN_EMAIL." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
