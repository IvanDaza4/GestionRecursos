"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { modalOverlay, modalPanel, drawerPanel } from "@/lib/animations";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function useEscapeToClose(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
}

export function Modal({ open, onClose, children, className }: OverlayProps) {
  useEscapeToClose(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={modalPanel}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              "relative w-full max-w-lg rounded-lg border border-white/10 bg-elevated elevation-3 max-h-[90vh] overflow-y-auto",
              className,
            )}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 text-ink-faint hover:text-ink transition-colors"
            >
              <X className="size-4.5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Drawer({ open, onClose, children, className }: OverlayProps) {
  useEscapeToClose(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={drawerPanel}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              "relative h-full w-full max-w-md border-l border-white/10 bg-elevated elevation-3 overflow-y-auto",
              className,
            )}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 text-ink-faint hover:text-ink transition-colors z-10"
            >
              <X className="size-4.5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
