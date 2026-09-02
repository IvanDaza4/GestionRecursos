"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Undo2 } from "lucide-react";
import { WizardShell } from "./wizard-shell";
import { StepSelectActivo } from "./step-select-activo";
import { StepFotos, type FotoSlot } from "./step-fotos";
import { StepEstado } from "./step-estado";
import { StepConfirmacionDevolucion } from "./step-confirmacion-devolucion";
import { Button } from "@/components/ui/button";
import { createDevolucion } from "@/lib/actions/movimientos";
import { springPanel } from "@/lib/animations";
import type { EstadoRecurso } from "@/lib/constants";
import type { EntregaActivaOption } from "./types";

const STEPS = ["Recurso", "Fotos", "Estado", "Confirmación"];

const FOTOS_INICIALES: FotoSlot[] = [
  { tipo: "frontal", file: null, preview: null },
  { tipo: "dorso", file: null, preview: null },
  { tipo: "detalle", file: null, preview: null },
  { tipo: "otro", file: null, preview: null },
];

export function DevolucionWizard({
  entregasActivas,
  entregaPreseleccionada,
}: {
  entregasActivas: EntregaActivaOption[];
  entregaPreseleccionada?: EntregaActivaOption;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [entrega, setEntrega] = useState<EntregaActivaOption | null>(entregaPreseleccionada ?? null);
  const [fotos, setFotos] = useState<FotoSlot[]>(FOTOS_INICIALES);
  const [estado, setEstado] = useState<EstadoRecurso | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const requeridasOk = fotos.find((f) => f.tipo === "frontal")?.file && fotos.find((f) => f.tipo === "dorso")?.file;

  const nextDisabled = [!entrega, !requeridasOk, !estado, false][step];

  function goNext() {
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      submit();
    }
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  async function submit() {
    if (!entrega || !estado) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.set("entregaId", entrega.entregaId);
      formData.set("recursoId", entrega.recurso.id);
      formData.set("empleadoId", entrega.empleado.id);
      formData.set("estado", estado);
      formData.set("observaciones", observaciones);
      fotos.forEach((f) => {
        if (f.file) {
          formData.append("fotos", f.file);
          formData.append("fotosTipo", f.tipo);
        }
      });

      const result = await createDevolucion(formData);
      setDone(result.id);
    } catch {
      setErrorMsg("No se pudo registrar la devolución. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done && entrega) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springPanel}
        className="max-w-md mx-auto text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...springPanel, delay: 0.1 }}
          className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-accent/12 border border-accent/30 glow-accent"
        >
          <Undo2 className="size-6 text-accent" strokeWidth={2} />
        </motion.div>
        <h2 className="text-lg font-semibold text-ink">Devolución registrada</h2>
        <p className="text-[13px] text-ink-muted mt-1.5">
          El recurso vuelve a estar disponible en el inventario.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="secondary" onClick={() => router.push(`/recursos/${entrega.recurso.id}`)}>
            Ver recurso
          </Button>
          <Button onClick={() => router.push("/devoluciones")}>Ir a devoluciones</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <WizardShell
      title="Nueva devolución"
      steps={STEPS}
      currentStep={step}
      direction={direction}
      onBack={goBack}
      onNext={goNext}
      nextDisabled={Boolean(nextDisabled)}
      loading={submitting}
      nextLabel={step === STEPS.length - 1 ? "Confirmar devolución" : "Continuar"}
    >
      {step === 0 && (
        <StepSelectActivo
          entregas={entregasActivas}
          selectedId={entrega?.entregaId ?? null}
          onSelect={setEntrega}
        />
      )}
      {step === 1 && <StepFotos value={fotos} onChange={setFotos} />}
      {step === 2 && (
        <StepEstado
          estado={estado}
          onEstadoChange={setEstado}
          observaciones={observaciones}
          onObservacionesChange={setObservaciones}
          estadoReferencia={entrega?.estadoEntrega}
        />
      )}
      {step === 3 && entrega && estado && (
        <StepConfirmacionDevolucion
          recurso={entrega.recurso}
          empleado={entrega.empleado}
          estadoEntrega={entrega.estadoEntrega}
          estadoDevolucion={estado}
          observaciones={observaciones}
          fotos={fotos}
        />
      )}
      {errorMsg && <p className="mt-4 text-[12.5px] text-danado text-center">{errorMsg}</p>}
    </WizardShell>
  );
}
