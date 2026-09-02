"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { StepIndicator } from "./step-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { wizardStepVariants } from "@/lib/animations";

export function WizardShell({
  title,
  steps,
  currentStep,
  direction,
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled,
  loading,
  children,
}: {
  title: string;
  steps: string[];
  currentStep: number;
  direction: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-ink tracking-tight mb-6">{title}</h2>

      <StepIndicator steps={steps} current={currentStep} />
      <ProgressBar value={((currentStep + 1) / steps.length) * 100} className="mt-5 mb-8" />

      <div className="relative min-h-[380px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={wizardStepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={currentStep === 0 || loading}
          className={currentStep === 0 ? "invisible" : ""}
        >
          <ChevronLeft className="size-4" />
          Atrás
        </Button>
        <Button type="button" onClick={onNext} disabled={nextDisabled} loading={loading}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
