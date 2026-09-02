"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ImageOff } from "lucide-react";
import { cn, formatFechaHora } from "@/lib/utils";
import { TIPO_EVENTO_CONFIG, type TipoEvento } from "@/lib/constants";
import { staggerContainer, staggerItem, springSnappy } from "@/lib/animations";
import { getFotosEvento } from "@/lib/actions/timeline";

export interface EventoTimeline {
  id: string;
  tipo_evento: TipoEvento;
  descripcion: string | null;
  fecha_evento: string;
  actor: { nombre: string; apellido: string } | null;
}

const CON_FOTOS: TipoEvento[] = ["entrega", "devolucion"];

export function ResourceTimeline({ eventos }: { eventos: EventoTimeline[] }) {
  if (eventos.length === 0) {
    return (
      <p className="text-[13px] text-ink-faint py-8 text-center">
        Todavía no hay eventos registrados para este recurso.
      </p>
    );
  }

  return (
    <motion.ol
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="relative"
    >
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/8" />
      {eventos.map((evento) => (
        <TimelineRow key={evento.id} evento={evento} />
      ))}
    </motion.ol>
  );
}

function TimelineRow({ evento }: { evento: EventoTimeline }) {
  const [open, setOpen] = useState(false);
  const [fotos, setFotos] = useState<{ id: string; tipo_foto: string; signedUrl: string | null }[] | null>(null);
  const [pending, startTransition] = useTransition();
  const config = TIPO_EVENTO_CONFIG[evento.tipo_evento];
  const Icon = config.icon;
  const expandible = CON_FOTOS.includes(evento.tipo_evento);

  function toggle() {
    if (!expandible) return;
    setOpen((v) => !v);
    if (!fotos) {
      startTransition(async () => {
        const data = await getFotosEvento(evento.tipo_evento, evento.id);
        setFotos(data as never);
      });
    }
  }

  return (
    <motion.li variants={staggerItem} className="relative pl-10 pb-6 last:pb-0">
      <div
        className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border z-10"
        style={{
          color: config.color,
          backgroundColor: `color-mix(in srgb, ${config.color} 14%, var(--base))`,
          borderColor: `color-mix(in srgb, ${config.color} 35%, transparent)`,
        }}
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </div>

      <button
        type="button"
        onClick={toggle}
        className={cn(
          "w-full text-left rounded-md border border-white/8 bg-card px-4 py-3 transition-colors",
          expandible && "hover:border-white/15 cursor-pointer",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink">{config.label}</p>
            {evento.descripcion && (
              <p className="text-[12.5px] text-ink-muted mt-0.5">{evento.descripcion}</p>
            )}
            <p className="text-[11px] text-ink-faint mono-data mt-1.5">
              {formatFechaHora(evento.fecha_evento)}
              {evento.actor && ` · ${evento.actor.nombre} ${evento.actor.apellido}`}
            </p>
          </div>
          {expandible && (
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={springSnappy}
              className="shrink-0 mt-0.5 text-ink-faint"
            >
              <ChevronDown className="size-4" />
            </motion.div>
          )}
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={springSnappy}
              className="overflow-hidden"
            >
              <div className="flex gap-2 pt-3 mt-3 border-t border-white/8 flex-wrap">
                {pending && <p className="text-[11px] text-ink-faint">Cargando fotos…</p>}
                {!pending && fotos?.length === 0 && (
                  <p className="flex items-center gap-1.5 text-[11px] text-ink-faint">
                    <ImageOff className="size-3.5" /> Sin fotos registradas
                  </p>
                )}
                {!pending &&
                  fotos?.map((f) =>
                    f.signedUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={f.id}
                        src={f.signedUrl}
                        alt={f.tipo_foto}
                        className="size-16 rounded-sm object-cover border border-white/10"
                      />
                    ) : null,
                  )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
}
