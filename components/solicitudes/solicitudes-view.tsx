"use client";

import { useState, useTransition } from "react";
import { Plus, Check, X } from "lucide-react";
import type { SolicitudConDetalle } from "@/lib/data/solicitudes";
import type { EmpleadoConArea } from "@/lib/data/catalogos";
import type { Tables } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { createSolicitud, resolverSolicitud } from "@/lib/actions/solicitudes";

type Area = Tables<"areas">;
type TipoRecurso = Tables<"tipos_recurso">;

export function SolicitudesView({
  solicitudes,
  empleados,
  areas,
  tipos,
}: {
  solicitudes: SolicitudConDetalle[];
  empleados: EmpleadoConArea[];
  areas: Area[];
  tipos: TipoRecurso[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const enCurso = solicitudes.filter((s) => s.estado !== "pendiente");

  function resolver(id: string, estado: "aprobada" | "rechazada") {
    startTransition(() => {
      resolverSolicitud(id, estado);
    });
  }

  return (
    <div className="module">
      <div className="module-intro">
        <div>
          <p className="eyebrow">BANDEJA DE DECISIONES</p>
          <h1>Solicitudes</h1>
          <p className="subtitle">Priorizá lo que necesita una respuesta.</p>
        </div>
        <button className="primary-button" onClick={() => setModalOpen(true)}>
          <Plus size={17} />
          Nueva solicitud
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <EmptyState title="No hay solicitudes todavía" description="Cuando alguien pida un recurso, va a aparecer acá." />
      ) : (
        <div className="request-board">
          <div className="request-column urgent">
            <div className="column-head">
              <span>Requieren decisión</span>
              <b>{pendientes.length}</b>
            </div>
            {pendientes.map((s) => (
              <article className="request-card" key={s.id}>
                <h3>{s.tipo_recurso?.nombre ?? "Recurso"}</h3>
                <p>
                  {s.empleado ? `${s.empleado.nombre} ${s.empleado.apellido}` : "—"}
                  {s.area ? ` · ${s.area.nombre}` : ""}
                </p>
                {s.descripcion && <small>{s.descripcion}</small>}
                <div>
                  <button className="approve" disabled={isPending} onClick={() => resolver(s.id, "aprobada")}>
                    <Check size={14} />
                    Aprobar
                  </button>
                  <button className="reject" disabled={isPending} onClick={() => resolver(s.id, "rechazada")}>
                    <X size={14} />
                    Rechazar
                  </button>
                </div>
              </article>
            ))}
            {pendientes.length === 0 && <p className="subtitle">No hay solicitudes pendientes.</p>}
          </div>
          <div className="request-column">
            <div className="column-head">
              <span>Resueltas</span>
              <b>{enCurso.length}</b>
            </div>
            {enCurso.map((s) => (
              <article className="request-card compact-card" key={s.id}>
                <h3>{s.tipo_recurso?.nombre ?? "Recurso"}</h3>
                <Badge tono={s.estado === "rechazada" ? "rose" : s.estado === "entregada" ? "green" : "blue"}>
                  {s.estado}
                </Badge>
              </article>
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <Modal eyebrow="NUEVA SOLICITUD" title="Solicitud de recurso" onClose={() => setModalOpen(false)}>
          <form action={createSolicitud} onSubmit={() => setTimeout(() => setModalOpen(false), 0)}>
            <div className="modal-body">
              <label>
                Empleado
                <select name="empleadoId" required defaultValue="">
                  <option value="" disabled>
                    Seleccioná un empleado
                  </option>
                  {empleados.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre} {e.apellido}
                    </option>
                  ))}
                </select>
              </label>
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
                  Tipo de recurso
                  <select name="tipoRecursoId" defaultValue="">
                    <option value="">Sin especificar</option>
                    {tipos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Descripción
                <textarea name="descripcion" placeholder="¿Qué necesita y por qué?" />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="outline-button" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="primary-button">
                Registrar solicitud
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
