"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Laptop, Boxes } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EstadoBadge } from "@/components/ui/estado-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ESTADOS_RECURSO, ESTADO_CONFIG, DISPONIBILIDAD_CONFIG, type EstadoRecurso, type DisponibilidadRecurso } from "@/lib/constants";
import { createRecurso } from "@/lib/actions/recursos-crud";

interface Recurso {
  id: string;
  marca: string | null;
  modelo: string | null;
  codigo_interno: string | null;
  numero_serie: string | null;
  estado_actual: EstadoRecurso;
  disponibilidad: DisponibilidadRecurso;
  tipo_recurso: { id: string; nombre: string } | null;
}

interface TipoRecurso {
  id: string;
  nombre: string;
}

export function RecursosView({ recursos, tiposRecurso }: { recursos: Recurso[]; tiposRecurso: TipoRecurso[] }) {
  const [query, setQuery] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoRecurso | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtrados = useMemo(
    () =>
      recursos.filter((r) => {
        const matchQuery = query.trim()
          ? [r.marca, r.modelo, r.codigo_interno, r.numero_serie, r.tipo_recurso?.nombre]
              .filter(Boolean)
              .some((v) => v!.toLowerCase().includes(query.trim().toLowerCase()))
          : true;
        const matchEstado = estadoFiltro ? r.estado_actual === estadoFiltro : true;
        return matchQuery && matchEstado;
      }),
    [recursos, query, estadoFiltro],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-faint" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar recurso…" className="pl-9" />
        </div>
        <Button onClick={() => setModalOpen(true)} size="md">
          <Plus className="size-4" /> Nuevo recurso
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={estadoFiltro === null} onClick={() => setEstadoFiltro(null)}>
          Todos
        </FilterChip>
        {ESTADOS_RECURSO.map((e) => (
          <FilterChip key={e} active={estadoFiltro === e} onClick={() => setEstadoFiltro(e)} color={ESTADO_CONFIG[e].color}>
            {ESTADO_CONFIG[e].label}
          </FilterChip>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={<Boxes />} title="Sin recursos" description="No hay recursos que coincidan con la búsqueda." />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtrados.map((r) => (
              <motion.div key={r.id} variants={staggerItem} exit="exit" layout>
                <Link href={`/recursos/${r.id}`}>
                  <Card interactive className="h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-medium text-ink-faint uppercase tracking-wide">
                        {r.tipo_recurso?.nombre ?? "Recurso"}
                      </span>
                      <EstadoBadge estado={r.estado_actual} size="sm" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-sm bg-white/5 shrink-0">
                        <Laptop className="size-4 text-ink-muted" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-ink truncate">
                          {r.marca} {r.modelo}
                        </p>
                        <p className="text-[11px] text-ink-faint mono-data truncate">
                          {r.codigo_interno ?? r.numero_serie ?? "s/código"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/6">
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: DISPONIBILIDAD_CONFIG[r.disponibilidad].color }}
                      >
                        {DISPONIBILIDAD_CONFIG[r.disponibilidad].label}
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <NuevoRecursoModal open={modalOpen} onClose={() => setModalOpen(false)} tiposRecurso={tiposRecurso} />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-7 px-3 rounded-full text-[12px] font-medium border transition-colors",
        active ? "border-transparent text-ink-inverse" : "border-white/10 text-ink-muted hover:text-ink hover:border-white/20",
      )}
      style={active ? { backgroundColor: color ?? "var(--accent)" } : undefined}
    >
      {children}
    </button>
  );
}

function NuevoRecursoModal({
  open,
  onClose,
  tiposRecurso,
}: {
  open: boolean;
  onClose: () => void;
  tiposRecurso: TipoRecurso[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createRecurso(formData);
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form action={handleSubmit} className="p-6 space-y-4">
        <h2 className="text-base font-semibold text-ink">Nuevo recurso</h2>

        <div>
          <Label htmlFor="tipoRecursoId">Tipo</Label>
          <Select id="tipoRecursoId" name="tipoRecursoId" required defaultValue="">
            <option value="" disabled>
              Elegir tipo…
            </option>
            {tiposRecurso.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" name="marca" placeholder="Dell, Apple…" />
          </div>
          <div>
            <Label htmlFor="modelo">Modelo</Label>
            <Input id="modelo" name="modelo" placeholder="Latitude 5420" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="numeroSerie">N° de serie</Label>
            <Input id="numeroSerie" name="numeroSerie" />
          </div>
          <div>
            <Label htmlFor="codigoInterno">Código interno</Label>
            <Input id="codigoInterno" name="codigoInterno" placeholder="ING-NB-0042" />
          </div>
        </div>

        <div>
          <Label htmlFor="imei">IMEI (si aplica)</Label>
          <Input id="imei" name="imei" />
        </div>

        <div>
          <Label htmlFor="estado">Estado inicial</Label>
          <Select id="estado" name="estado" defaultValue="nuevo">
            {ESTADOS_RECURSO.map((e) => (
              <option key={e} value={e}>
                {ESTADO_CONFIG[e].label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción (opcional)</Label>
          <Textarea id="descripcion" name="descripcion" />
        </div>

        <Button type="submit" loading={pending} className="w-full">
          Crear recurso
        </Button>
      </form>
    </Modal>
  );
}
