"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ChevronRight, Upload } from "lucide-react";
import type { EntregaConDetalle } from "@/lib/data/entregas";
import type { RecursoDisponible, EmpleadoConArea } from "@/lib/data/catalogos";
import { ESTADO_CONFIG, ESTADOS_RECURSO } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFecha } from "@/lib/utils";
import { createEntrega } from "@/lib/actions/movimientos";

export function EntregasView({
  entregas,
  recursosDisponibles,
  empleados,
}: {
  entregas: EntregaConDetalle[];
  recursosDisponibles: RecursoDisponible[];
  empleados: EmpleadoConArea[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(searchParams.get("nuevo") === "1");

  function closeModal() {
    setModalOpen(false);
    if (searchParams.get("nuevo")) router.replace("/entregas");
  }

  return (
    <div className="module">
      <div className="module-intro">
        <div>
          <p className="eyebrow">DESPACHOS Y CONSTANCIAS</p>
          <h1>Entregas</h1>
          <p className="subtitle">Seguimiento de entregas y documentos físicos.</p>
        </div>
        <button className="primary-button" onClick={() => setModalOpen(true)} disabled={recursosDisponibles.length === 0}>
          <Plus size={17} />
          Nueva entrega
        </button>
      </div>

      {entregas.length === 0 ? (
        <EmptyState title="Todavía no hay entregas registradas" description="Registrá la primera entrega de un recurso disponible." />
      ) : (
        <div className="directory">
          {entregas.map((e) => {
            const estado = ESTADO_CONFIG[e.estado_entrega];
            return (
              <article className="directory-row" key={e.id}>
                <div className="avatar large person-avatar">
                  {e.empleado ? `${e.empleado.nombre[0]}${e.empleado.apellido[0]}` : "?"}
                </div>
                <div>
                  <strong>{e.recurso ? [e.recurso.marca, e.recurso.modelo].filter(Boolean).join(" ") : "Recurso"}</strong>
                  <span>
                    {e.empleado ? `${e.empleado.nombre} ${e.empleado.apellido}` : "—"} · {e.recurso?.tipo_recurso?.nombre}
                  </span>
                </div>
                <Badge tono={estado.tono}>{estado.label}</Badge>
                <div className="row-meta">
                  <span>{formatFecha(e.fecha_entrega)}</span>
                  <span>{e.aceptado ? "Aceptada" : "Sin confirmar"}</span>
                </div>
                <ChevronRight size={17} />
              </article>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <Modal eyebrow="NUEVO MOVIMIENTO" title="Entrega" onClose={closeModal}>
          <form
            action={async (formData) => {
              await createEntrega(formData);
            }}
            onSubmit={() => setTimeout(closeModal, 0)}
          >
            <div className="modal-body">
              <label>
                Empleado destinatario
                <select name="empleadoId" required defaultValue="">
                  <option value="" disabled>
                    Seleccioná un empleado
                  </option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre} {emp.apellido}
                      {emp.area ? ` · ${emp.area.nombre}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Recurso a entregar
                <select name="recursoId" required defaultValue="">
                  <option value="" disabled>
                    Seleccioná un recurso disponible
                  </option>
                  {recursosDisponibles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {[r.marca, r.modelo].filter(Boolean).join(" ") || r.tipo_recurso?.nombre} ·{" "}
                      {r.codigo_interno ?? r.id.slice(0, 8)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-grid">
                <label>
                  Estado al entregar
                  <select name="estado" defaultValue="bueno">
                    {ESTADOS_RECURSO.map((e) => (
                      <option key={e} value={e}>
                        {ESTADO_CONFIG[e].label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Aceptación
                  <select name="aceptado" defaultValue="false">
                    <option value="false">Pendiente de firma</option>
                    <option value="true">Aceptada en el momento</option>
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
                  Foto del estado del producto <small>(opcional)</small>
                </strong>
                <span>Subí una evidencia antes de entregar</span>
                <input type="file" name="fotos" accept="image/*" />
                <input type="hidden" name="fotosTipo" value="frontal" />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="outline-button" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="primary-button">
                Generar entrega
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
