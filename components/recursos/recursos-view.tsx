"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Plus, Search, ChevronRight } from "lucide-react";
import type { RecursoDetalle } from "@/lib/data/recursos";
import type { Tables } from "@/lib/supabase/types";
import { ESTADO_CONFIG, ESTADOS_RECURSO, DISPONIBILIDAD_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { createRecurso } from "@/lib/actions/recursos-crud";

type TipoRecurso = Tables<"tipos_recurso">;

export function RecursosView({ recursos, tipos }: { recursos: RecursoDetalle[]; tipos: TipoRecurso[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("Todos");
  const [detalle, setDetalle] = useState<RecursoDetalle | null>(null);
  const [modalOpen, setModalOpen] = useState(searchParams.get("nuevo") === "1");

  const filtrados = useMemo(() => {
    const q = query.toLowerCase();
    return recursos.filter((r) => {
      const texto = [r.marca, r.modelo, r.codigo_interno, r.numero_serie, r.tipo_recurso?.nombre]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchQuery = texto.includes(q);
      const matchTipo = tipoFiltro === "Todos" || r.tipo_recurso?.nombre === tipoFiltro;
      return matchQuery && matchTipo;
    });
  }, [recursos, query, tipoFiltro]);

  const disponibles = recursos.filter((r) => r.disponibilidad === "disponible").length;
  const enRevision = recursos.filter((r) => r.disponibilidad === "en_reparacion").length;

  function closeModal() {
    setModalOpen(false);
    if (searchParams.get("nuevo")) router.replace("/recursos");
  }

  return (
    <div className="module">
      <div className="module-intro">
        <div>
          <p className="eyebrow">MAPA DE ACTIVOS</p>
          <h1>Inventario</h1>
          <p className="subtitle">Cada recurso tiene una historia.</p>
        </div>
        <button className="primary-button" onClick={() => setModalOpen(true)}>
          <Plus size={17} />
          Dar de alta
        </button>
      </div>

      <div className="module-stats">
        <div>
          <strong>{recursos.length}</strong>
          <span>activos totales</span>
        </div>
        <div>
          <strong>{disponibles}</strong>
          <span>disponibles</span>
        </div>
        <div>
          <strong>{enRevision}</strong>
          <span>en revisión</span>
        </div>
      </div>

      <div className="inventory-filters" aria-label="Filtrar por tipo de recurso">
        <button
          className={`inventory-filter ${tipoFiltro === "Todos" ? "active" : ""}`}
          onClick={() => setTipoFiltro("Todos")}
        >
          <Package size={17} />
          <span>Todos</span>
        </button>
        {tipos.map((t) => (
          <button
            key={t.id}
            className={`inventory-filter ${tipoFiltro === t.nombre ? "active" : ""}`}
            onClick={() => setTipoFiltro(t.nombre)}
          >
            <span>{t.nombre}</span>
          </button>
        ))}
      </div>

      <div className="module-tools">
        <div className="search-field">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, código o número de serie..."
          />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState title="No hay recursos que coincidan" description="Probá con otra búsqueda o dá de alta uno nuevo." />
      ) : (
        <div className="asset-grid">
          {filtrados.map((r) => {
            const estado = ESTADO_CONFIG[r.estado_actual];
            const disponibilidad = DISPONIBILIDAD_CONFIG[r.disponibilidad];
            return (
              <article className="asset-card" key={r.id} onClick={() => setDetalle(r)}>
                <div className="asset-card-top">
                  <span className={`asset-symbol ${disponibilidad.tono === "blue" ? "" : disponibilidad.tono}`}>
                    <Package size={22} />
                  </span>
                  <Badge tono={disponibilidad.tono}>{disponibilidad.label}</Badge>
                </div>
                <p className="asset-code">{r.codigo_interno ?? r.id.slice(0, 8)}</p>
                <h3>{[r.marca, r.modelo].filter(Boolean).join(" ") || r.tipo_recurso?.nombre}</h3>
                <p>
                  {r.tipo_recurso?.nombre} · <Badge tono={estado.tono}>{estado.label}</Badge>
                </p>
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
              <h2>{[detalle.marca, detalle.modelo].filter(Boolean).join(" ") || detalle.tipo_recurso?.nombre}</h2>
            </div>
            <button className="icon-button" onClick={() => setDetalle(null)} aria-label="Cerrar">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="drawer-fields">
            {[
              ["Código interno", detalle.codigo_interno],
              ["Tipo", detalle.tipo_recurso?.nombre],
              ["Marca / modelo", [detalle.marca, detalle.modelo].filter(Boolean).join(" ")],
              ["Número de serie", detalle.numero_serie],
              ["IMEI", detalle.imei],
              ["Estado", ESTADO_CONFIG[detalle.estado_actual].label],
              ["Disponibilidad", DISPONIBILIDAD_CONFIG[detalle.disponibilidad].label],
              ["Fecha de alta", detalle.fecha_alta],
              ["Descripción", detalle.descripcion],
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
        <Modal eyebrow="NUEVO RECURSO" title="Dar de alta" onClose={closeModal}>
          <form action={createRecurso} onSubmit={() => setTimeout(closeModal, 0)}>
            <div className="modal-body">
              <label>
                Tipo de recurso
                <select name="tipoRecursoId" required defaultValue="">
                  <option value="" disabled>
                    Seleccioná un tipo
                  </option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-grid">
                <label>
                  Marca
                  <input name="marca" placeholder="Ej. Lenovo" />
                </label>
                <label>
                  Modelo
                  <input name="modelo" placeholder="Ej. ThinkPad T14" />
                </label>
              </div>
              <div className="form-grid">
                <label>
                  Número de serie
                  <input name="numeroSerie" placeholder="Identificador único" />
                </label>
                <label>
                  Código interno
                  <input name="codigoInterno" placeholder="Ej. ING-NB-0042" />
                </label>
              </div>
              <label>
                Estado inicial
                <select name="estado" defaultValue="nuevo">
                  {ESTADOS_RECURSO.map((e) => (
                    <option key={e} value={e}>
                      {ESTADO_CONFIG[e].label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Descripción
                <textarea name="descripcion" placeholder="Notas adicionales (opcional)" />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="outline-button" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="primary-button">
                Dar de alta
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
