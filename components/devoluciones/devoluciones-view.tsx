"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ChevronRight, Upload } from "lucide-react";
import type { DevolucionConDetalle, EntregaActivaOption } from "@/lib/data/entregas";
import { ESTADO_CONFIG, ESTADOS_RECURSO } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFecha } from "@/lib/utils";
import { createDevolucion } from "@/lib/actions/movimientos";

const COMPARACION_LABEL: Record<string, string> = {
  mejoro: "Mejoró",
  igual: "Igual",
  empeoro: "Empeoró",
};

export function DevolucionesView({
  devoluciones,
  entregasActivas,
}: {
  devoluciones: DevolucionConDetalle[];
  entregasActivas: EntregaActivaOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(searchParams.get("nuevo") === "1");
  const [entregaId, setEntregaId] = useState("");

  const seleccionada = useMemo(
    () => entregasActivas.find((e) => e.entregaId === entregaId) ?? null,
    [entregasActivas, entregaId],
  );

  function closeModal() {
    setModalOpen(false);
    setEntregaId("");
    if (searchParams.get("nuevo")) router.replace("/devoluciones");
  }

  return (
    <div className="module">
      <div className="module-intro">
        <div>
          <p className="eyebrow">CONTROL DE RETORNOS</p>
          <h1>Devoluciones</h1>
          <p className="subtitle">Compará el antes y el después de cada activo.</p>
        </div>
        <button className="primary-button" onClick={() => setModalOpen(true)} disabled={entregasActivas.length === 0}>
          <Plus size={17} />
          Nueva devolución
        </button>
      </div>

      {devoluciones.length === 0 ? (
        <EmptyState title="Todavía no hay devoluciones registradas" description="Cuando alguien devuelva un recurso asignado, va a aparecer acá." />
      ) : (
        <div className="directory">
          {devoluciones.map((d) => {
            const estado = ESTADO_CONFIG[d.estado_devolucion];
            return (
              <article className="directory-row" key={d.id}>
                <div className="avatar large person-avatar">
                  {d.empleado ? `${d.empleado.nombre[0]}${d.empleado.apellido[0]}` : "?"}
                </div>
                <div>
                  <strong>{d.recurso ? [d.recurso.marca, d.recurso.modelo].filter(Boolean).join(" ") : "Recurso"}</strong>
                  <span>{d.empleado ? `${d.empleado.nombre} ${d.empleado.apellido}` : "—"}</span>
                </div>
                <Badge tono={estado.tono}>{estado.label}</Badge>
                <div className="row-meta">
                  <span>{formatFecha(d.fecha_devolucion)}</span>
                  <span>{d.comparacion_resultado ? COMPARACION_LABEL[d.comparacion_resultado] : "—"}</span>
                </div>
                <ChevronRight size={17} />
              </article>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <Modal eyebrow="NUEVO MOVIMIENTO" title="Devolución" onClose={closeModal}>
          <form
            action={async (formData) => {
              await createDevolucion(formData);
            }}
            onSubmit={() => setTimeout(closeModal, 0)}
          >
            <div className="modal-body">
              <label>
                Recurso entregado a devolver
                <select
                  name="entregaId"
                  required
                  value={entregaId}
                  onChange={(e) => setEntregaId(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccioná empleado y recurso
                  </option>
                  {entregasActivas.map((op) => (
                    <option key={op.entregaId} value={op.entregaId}>
                      {op.empleado.nombre} {op.empleado.apellido} ·{" "}
                      {[op.recurso.marca, op.recurso.modelo].filter(Boolean).join(" ")}
                    </option>
                  ))}
                </select>
              </label>
              <input type="hidden" name="recursoId" value={seleccionada?.recurso.id ?? ""} />
              <input type="hidden" name="empleadoId" value={seleccionada?.empleado.id ?? ""} />
              {seleccionada && (
                <div className="delivered-date">
                  <span>Estado registrado al entregar</span>
                  <strong>{ESTADO_CONFIG[seleccionada.estadoEntrega].label}</strong>
                </div>
              )}
              <div className="form-grid">
                <label>
                  Estado al devolver
                  <select name="estado" defaultValue="bueno">
                    {ESTADOS_RECURSO.map((e) => (
                      <option key={e} value={e}>
                        {ESTADO_CONFIG[e].label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Observaciones
                <textarea name="observaciones" placeholder="Notas adicionales (opcional)" />
              </label>
              <label className="upload-zone">
                <Upload size={21} />
                <strong>
                  Foto de devolución <small>(opcional)</small>
                </strong>
                <span>Documentá el estado recibido</span>
                <input type="file" name="fotos" accept="image/*" />
                <input type="hidden" name="fotosTipo" value="frontal" />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="outline-button" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="primary-button" disabled={!entregaId}>
                Registrar devolución
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
