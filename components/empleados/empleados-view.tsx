"use client";

import { useMemo, useState } from "react";
import { Plus, ChevronRight, Search } from "lucide-react";
import type { EmpleadoConArea } from "@/lib/data/catalogos";
import type { EntregaActivaOption } from "@/lib/data/entregas";
import type { Tables } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { createEmpleado } from "@/lib/actions/empleados";

type Area = Tables<"areas">;

export function EmpleadosView({
  empleados,
  areas,
  entregasActivas,
}: {
  empleados: EmpleadoConArea[];
  areas: Area[];
  entregasActivas: EntregaActivaOption[];
}) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detalle, setDetalle] = useState<EmpleadoConArea | null>(null);

  const recursosPorEmpleado = useMemo(() => {
    const map = new Map<string, EntregaActivaOption[]>();
    for (const op of entregasActivas) {
      const list = map.get(op.empleado.id) ?? [];
      list.push(op);
      map.set(op.empleado.id, list);
    }
    return map;
  }, [entregasActivas]);

  const filtrados = empleados.filter((e) =>
    `${e.nombre} ${e.apellido} ${e.area?.nombre ?? ""} ${e.puesto ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="module">
      <div className="module-intro">
        <div>
          <p className="eyebrow">DIRECTORIO OPERATIVO</p>
          <h1>Empleados</h1>
          <p className="subtitle">Personas, equipos y contexto en el mismo lugar.</p>
        </div>
        <button className="primary-button" onClick={() => setModalOpen(true)}>
          <Plus size={17} />
          Nuevo empleado
        </button>
      </div>

      <div className="module-stats">
        <div>
          <strong>{empleados.length}</strong>
          <span>registros activos</span>
        </div>
        <div>
          <strong>{new Set(empleados.map((e) => e.area?.id).filter(Boolean)).size}</strong>
          <span>áreas</span>
        </div>
      </div>

      <div className="module-tools">
        <div className="search-field">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar persona, área o puesto..." />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState title="No hay empleados que coincidan" description="Probá con otra búsqueda o sumá uno nuevo." />
      ) : (
        <div className="directory">
          {filtrados.map((e) => {
            const recursos = recursosPorEmpleado.get(e.id) ?? [];
            return (
              <article className="directory-row" key={e.id} onClick={() => setDetalle(e)}>
                <div className="avatar large person-avatar">
                  {e.nombre[0]}
                  {e.apellido[0]}
                </div>
                <div>
                  <strong>
                    {e.nombre} {e.apellido}
                  </strong>
                  <span>{e.puesto ?? "—"}</span>
                </div>
                <Badge>{e.area?.nombre ?? "Sin área"}</Badge>
                <div className="row-meta">
                  <span>{e.email ?? "—"}</span>
                  <span>{recursos.length} recurso(s) asignado(s)</span>
                </div>
                <ChevronRight size={17} />
              </article>
            );
          })}
        </div>
      )}

      {detalle && (
        <div className="detail-drawer">
          <div className="drawer-head">
            <div>
              <p className="eyebrow">FICHA COMPLETA</p>
              <h2>
                {detalle.nombre} {detalle.apellido}
              </h2>
            </div>
            <button className="icon-button" onClick={() => setDetalle(null)} aria-label="Cerrar">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="drawer-fields">
            {[
              ["Legajo", detalle.legajo],
              ["Área", detalle.area?.nombre],
              ["Puesto", detalle.puesto],
              ["Email", detalle.email],
              [
                "Recursos asignados",
                (recursosPorEmpleado.get(detalle.id) ?? [])
                  .map((r) => [r.recurso.marca, r.recurso.modelo].filter(Boolean).join(" "))
                  .join(", "),
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value || "—"}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <Modal eyebrow="NUEVO EMPLEADO" title="Alta de empleado" onClose={() => setModalOpen(false)}>
          <form action={createEmpleado} onSubmit={() => setTimeout(() => setModalOpen(false), 0)}>
            <div className="modal-body">
              <div className="form-grid">
                <label>
                  Nombre
                  <input name="nombre" required placeholder="Nombre" />
                </label>
                <label>
                  Apellido
                  <input name="apellido" required placeholder="Apellido" />
                </label>
              </div>
              <div className="form-grid">
                <label>
                  Legajo
                  <input name="legajo" placeholder="Opcional" />
                </label>
                <label>
                  Email
                  <input name="email" type="email" placeholder="nombre@empresa.com" />
                </label>
              </div>
              <div className="form-grid">
                <label>
                  Área
                  <select name="areaId" defaultValue="">
                    <option value="">Sin área</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Puesto
                  <input name="puesto" placeholder="Ej. Product Designer" />
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="outline-button" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="primary-button">
                Guardar empleado
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
