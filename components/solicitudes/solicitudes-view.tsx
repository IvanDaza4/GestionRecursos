"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Plus, ClipboardList, Check, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/estado-badge";
import { Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { formatFecha } from "@/lib/utils";
import { ESTADO_SOLICITUD_CONFIG, type EstadoSolicitud } from "@/lib/constants";
import { createSolicitud, resolverSolicitud } from "@/lib/actions/solicitudes";

interface Solicitud {
  id: string;
  descripcion: string | null;
  estado: EstadoSolicitud;
  fecha_solicitud: string;
  empleado: { id: string; nombre: string; apellido: string } | null;
  area: { id: string; nombre: string } | null;
  tipo_recurso: { id: string; nombre: string } | null;
}

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  area: { id: string; nombre: string } | null;
}

interface TipoRecurso {
  id: string;
  nombre: string;
}

export function SolicitudesView({
  solicitudes,
  empleados,
  tiposRecurso,
}: {
  solicitudes: Solicitud[];
  empleados: Empleado[];
  tiposRecurso: TipoRecurso[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [resolvingId, startResolve] = useTransition();

  function resolver(id: string, estado: EstadoSolicitud) {
    startResolve(async () => {
      await resolverSolicitud(id, estado);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-muted">{solicitudes.length} solicitudes</p>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" /> Nueva solicitud
        </Button>
      </div>

      {solicitudes.length === 0 ? (
        <EmptyState icon={<ClipboardList />} title="Sin solicitudes" description="Todavía no se cargaron pedidos de recursos." />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-2.5">
          {solicitudes.map((s) => {
            const config = ESTADO_SOLICITUD_CONFIG[s.estado];
            return (
              <motion.div
                key={s.id}
                variants={staggerItem}
                className="flex items-center gap-4 rounded-md border border-white/8 bg-card px-4 py-3.5"
              >
                {s.empleado && <Avatar nombre={s.empleado.nombre} apellido={s.empleado.apellido} size="sm" />}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-ink truncate">
                    {s.tipo_recurso?.nombre ?? "Recurso"} · {s.empleado?.nombre} {s.empleado?.apellido}
                  </p>
                  <p className="text-[11.5px] text-ink-faint truncate">
                    {s.descripcion ?? "Sin descripción"} · {formatFecha(s.fecha_solicitud)}
                  </p>
                </div>
                {s.area && <Badge className="shrink-0">{s.area.nombre}</Badge>}
                <span
                  className="shrink-0 inline-flex items-center h-6 px-2.5 rounded-xs text-[11px] font-medium border"
                  style={{
                    color: config.color,
                    backgroundColor: `color-mix(in srgb, ${config.color} 14%, transparent)`,
                    borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
                  }}
                >
                  {config.label}
                </span>
                {s.estado === "pendiente" && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => resolver(s.id, "aprobada")}
                      disabled={resolvingId}
                      className="flex size-7 items-center justify-center rounded-sm bg-nuevo/12 text-nuevo hover:bg-nuevo/20 transition-colors"
                      aria-label="Aprobar"
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      onClick={() => resolver(s.id, "rechazada")}
                      disabled={resolvingId}
                      className="flex size-7 items-center justify-center rounded-sm bg-danado/12 text-danado hover:bg-danado/20 transition-colors"
                      aria-label="Rechazar"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <NuevaSolicitudModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        empleados={empleados}
        tiposRecurso={tiposRecurso}
      />
    </div>
  );
}

function NuevaSolicitudModal({
  open,
  onClose,
  empleados,
  tiposRecurso,
}: {
  open: boolean;
  onClose: () => void;
  empleados: Empleado[];
  tiposRecurso: TipoRecurso[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [empleadoId, setEmpleadoId] = useState("");
  const empleadoSeleccionado = empleados.find((e) => e.id === empleadoId);

  function handleSubmit(formData: FormData) {
    formData.set("areaId", empleadoSeleccionado?.area?.id ?? "");
    startTransition(async () => {
      await createSolicitud(formData);
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form action={handleSubmit} className="p-6 space-y-4">
        <h2 className="text-base font-semibold text-ink">Nueva solicitud</h2>

        <div>
          <Label htmlFor="empleadoId">Empleado</Label>
          <Select id="empleadoId" name="empleadoId" required value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}>
            <option value="" disabled>
              Elegir empleado…
            </option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} {e.apellido}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="tipoRecursoId">Tipo de recurso</Label>
          <Select id="tipoRecursoId" name="tipoRecursoId" defaultValue="">
            <option value="">Sin especificar</option>
            {tiposRecurso.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="descripcion">Motivo</Label>
          <Textarea id="descripcion" name="descripcion" placeholder="Ej: notebook de reemplazo por rotura de pantalla" />
        </div>

        <Button type="submit" loading={pending} className="w-full">
          Crear solicitud
        </Button>
      </form>
    </Modal>
  );
}
