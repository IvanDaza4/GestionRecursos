"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PackageCheck } from "lucide-react";
import { WizardShell } from "./wizard-shell";
import { StepSelectRecurso } from "./step-select-recurso";
import { StepSelectEmpleado } from "./step-select-empleado";
import { StepFotos, type FotoSlot } from "./step-fotos";
import { StepEstado } from "./step-estado";
import { StepConfirmacionEntrega } from "./step-confirmacion-entrega";
import { Button } from "@/components/ui/button";
import { createEntrega } from "@/lib/actions/movimientos";
import { springPanel } from "@/lib/animations";
import type { EstadoRecurso } from "@/lib/constants";
import type { RecursoOption, EmpleadoOption } from "./types";

const STEPS = ["Recurso", "Empleado", "Fotos", "Estado", "Confirmación"];

const FOTOS_INICIALES: FotoSlot[] = [
  { tipo: "frontal", file: null, preview: null },
  { tipo: "dorso", file: null, preview: null },
  { tipo: "detalle", file: null, preview: null },
  { tipo: "otro", file: null, preview: null },
];

export function EntregaWizard({
  recursos,
  empleados,
  recursoPreseleccionado,
}: {
  recursos: RecursoOption[];
  empleados: EmpleadoOption[];
  recursoPreseleccionado?: RecursoOption;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [recurso, setRecurso] = useState<RecursoOption | null>(recursoPreseleccionado ?? null);
  const [empleado, setEmpleado] = useState<EmpleadoOption | null>(null);
  const [fotos, setFotos] = useState<FotoSlot[]>(FOTOS_INICIALES);
  const [estado, setEstado] = useState<EstadoRecurso | null>(null);
  const [observaciones, setObservaciones] = useState("");
  const [aceptado, setAceptado] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const requeridasOk = fotos.find((f) => f.tipo === "frontal")?.file && fotos.find((f) => f.tipo === "dorso")?.file;

  const nextDisabled = [
    !recurso,
    !empleado,
    !requeridasOk,
    !estado,
    !aceptado,
  ][step];

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
    if (!recurso || !empleado || !estado) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.set("recursoId", recurso.id);
      formData.set("empleadoId", empleado.id);
      formData.set("areaId", empleado.area?.id ?? "");
      formData.set("estado", estado);
      formData.set("observaciones", observaciones);
      formData.set("aceptado", String(aceptado));
      fotos.forEach((f) => {
        if (f.file) {
          formData.append("fotos", f.file);
          formData.append("fotosTipo", f.tipo);
        }
      });

      const result = await createEntrega(formData);
      setDone(result.id);
    } catch {
      setErrorMsg("No se pudo registrar la entrega. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done && recurso) {
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
          className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-nuevo/12 border border-nuevo/30 glow-accent"
        >
          <PackageCheck className="size-6 text-nuevo" strokeWidth={2} />
        </motion.div>
        <h2 className="text-lg font-semibold text-ink">Entrega registrada</h2>
        <p className="text-[13px] text-ink-muted mt-1.5">
          Quedó documentada con evidencia fotográfica y estado inicial.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="secondary" onClick={() => router.push(`/recursos/${recurso.id}`)}>
            Ver recurso
          </Button>
          <Button onClick={() => router.push("/entregas")}>Ir a entregas</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <WizardShell
      title="Nueva entrega"
      steps={STEPS}
      currentStep={step}
      direction={direction}
      onBack={goBack}
      onNext={goNext}
      nextDisabled={Boolean(nextDisabled)}
      loading={submitting}
      nextLabel={step === STEPS.length - 1 ? "Confirmar entrega" : "Continuar"}
    >
      {step === 0 && (
        <StepSelectRecurso recursos={recursos} selectedId={recurso?.id ?? null} onSelect={setRecurso} />
      )}
      {step === 1 && (
        <StepSelectEmpleado empleados={empleados} selectedId={empleado?.id ?? null} onSelect={setEmpleado} />
      )}
      {step === 2 && <StepFotos value={fotos} onChange={setFotos} />}
      {step === 3 && (
        <StepEstado
          estado={estado}
          onEstadoChange={setEstado}
          observaciones={observaciones}
          onObservacionesChange={setObservaciones}
        />
      )}
      {step === 4 && recurso && empleado && estado && (
        <StepConfirmacionEntrega
          recurso={recurso}
          empleado={empleado}
          estado={estado}
          observaciones={observaciones}
          fotos={fotos}
          aceptado={aceptado}
          onAceptadoChange={setAceptado}
        />
      )}
      {errorMsg && <p className="mt-4 text-[12.5px] text-danado text-center">{errorMsg}</p>}
    </WizardShell>
  );
}
