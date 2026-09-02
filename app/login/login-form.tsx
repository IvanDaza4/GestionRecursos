"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="next" value={next} />
      {state.error && <p className="form-error">{state.error}</p>}
      <label className="login-field">
        Email
        <input type="email" name="email" required autoComplete="email" placeholder="tu@empresa.com" />
      </label>
      <label className="login-field">
        Contraseña
        <input type="password" name="password" required autoComplete="current-password" placeholder="••••••••" />
      </label>
      <button type="submit" className="primary-button login-submit" disabled={pending}>
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
