"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/animations";
import { TIPOS_FOTO, type TipoFoto } from "@/lib/constants";

export interface FotoSlot {
  tipo: TipoFoto;
  file: File | null;
  preview: string | null;
}

const REQUERIDAS: TipoFoto[] = ["frontal", "dorso"];

export function StepFotos({
  value,
  onChange,
}: {
  value: FotoSlot[];
  onChange: (next: FotoSlot[]) => void;
}) {
  return (
    <div>
      <p className="text-[13px] text-ink-muted mb-4">
        Fotografiá el recurso antes de entregarlo. Frontal y dorso son obligatorias — esto
        es lo que evita disputas a futuro.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {value.map((slot, i) => (
          <PhotoSlotCard
            key={slot.tipo}
            slot={slot}
            requerida={REQUERIDAS.includes(slot.tipo)}
            onCapture={(file) => {
              const next = [...value];
              next[i] = { ...slot, file, preview: URL.createObjectURL(file) };
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoSlotCard({
  slot,
  requerida,
  onCapture,
}: {
  slot: FotoSlot;
  requerida: boolean;
  onCapture: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = TIPOS_FOTO.find((t) => t.value === slot.tipo)?.label ?? slot.tipo;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={springSnappy}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative aspect-[4/3] rounded-md border overflow-hidden flex flex-col items-center justify-center gap-1.5 text-center",
        slot.preview
          ? "border-accent/30"
          : "border-dashed border-white/15 hover:border-white/25 bg-surface",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onCapture(file);
          e.target.value = "";
        }}
      />

      <AnimatePresence mode="wait">
        {slot.preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={springSnappy}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slot.preview} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-xs bg-accent/90 px-1.5 py-0.5 text-[10px] font-semibold text-ink-inverse">
              <Check className="size-3" strokeWidth={3} />
              {label}
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-xs bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              <RotateCcw className="size-3" />
              Repetir
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-1.5"
          >
            <Camera className="size-5 text-ink-faint" strokeWidth={1.75} />
            <span className="text-[12px] font-medium text-ink-muted">{label}</span>
            <span className={cn("text-[10px]", requerida ? "text-accent" : "text-ink-faint")}>
              {requerida ? "Requerida" : "Opcional"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
