"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/estado-badge";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { createEmpleado } from "@/lib/actions/empleados";

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  legajo: string | null;
  puesto: string | null;
  area: { id: string; nombre: string } | null;
}

interface Area {
  id: string;
  nombre: string;
}

export function EmpleadosView({ empleados, areas }: { empleados: Empleado[]; areas: Area[] }) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtrados = useMemo(
    () =>
      query.trim()
        ? empleados.filter((e) =>
            [e.nombre, e.apellido, e.legajo, e.area?.nombre]
              .filter(Boolean)
              .some((v) => v!.toLowerCase().includes(query.trim().toLowerCase())),
          )
        : empleados,
    [empleados, query],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-faint" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar empleado…" className="pl-9" />
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" /> Nuevo empleado
        </Button>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState icon={<Users />} title="Sin empleados" description="No hay empleados que coincidan con la búsqueda." />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtrados.map((e) => (
              <motion.div key={e.id} variants={staggerItem} exit="exit" layout>
                <Card>
                  <div className="flex items-center gap-3">
                    <Avatar nombre={e.nombre} apellido={e.apellido} />
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-ink truncate">
                        {e.nombre} {e.apellido}
                      </p>
                      <p className="text-[11px] text-ink-faint mono-data">{e.legajo ?? "s/legajo"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/6">
                    {e.area && <Badge>{e.area.nombre}</Badge>}
                    {e.puesto && <span className="text-[11px] text-ink-faint">{e.puesto}</span>}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <NuevoEmpleadoModal open={modalOpen} onClose={() => setModalOpen(false)} areas={areas} />
    </div>
  );
}

function NuevoEmpleadoModal({ open, onClose, areas }: { open: boolean; onClose: () => void; areas: Area[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createEmpleado(formData);
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form action={handleSubmit} className="p-6 space-y-4">
        <h2 className="text-base font-semibold text-ink">Nuevo empleado</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" required />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" name="apellido" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="legajo">Legajo</Label>
            <Input id="legajo" name="legajo" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
        </div>

        <div>
          <Label htmlFor="areaId">Área</Label>
          <Select id="areaId" name="areaId" defaultValue="">
            <option value="">Sin asignar</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="puesto">Puesto</Label>
          <Input id="puesto" name="puesto" />
        </div>

        <Button type="submit" loading={pending} className="w-full">
          Crear empleado
        </Button>
      </form>
    </Modal>
  );
}
