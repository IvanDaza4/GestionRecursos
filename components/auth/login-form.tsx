"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { Zap, AlertCircle } from "lucide-react";
import { login, type LoginState } from "@/lib/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { springPanel } from "@/lib/animations";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPanel}
      className="w-full max-w-sm rounded-lg border border-white/10 bg-elevated p-8 elevation-3"
    >
      <div className="flex flex-col items-center mb-7">
        <div className="flex size-11 items-center justify-center rounded-md bg-accent/12 border border-accent/25 glow-accent mb-4">
          <Zap className="size-5 text-accent" strokeWidth={2.2} />
        </div>
        <h1 className="text-lg font-semibold text-ink tracking-tight">Recursos Ingnala</h1>
        <p className="text-[13px] text-ink-muted mt-1">Ingresá con tu cuenta de RRHH</p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="nombre@ingnala.com" required />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
        </div>

        {state.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 rounded-sm bg-danado/10 border border-danado/25 px-3 py-2 text-[12.5px] text-danado"
          >
            <AlertCircle className="size-3.5 shrink-0" />
            {state.error}
          </motion.div>
        )}

        <Button type="submit" size="lg" loading={pending} className="w-full mt-2">
          Iniciar sesión
        </Button>
      </form>
    </motion.div>
  );
}
