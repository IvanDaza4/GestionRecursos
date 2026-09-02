import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Clock3, Plus } from "lucide-react";
import { getDashboardStats } from "@/lib/data/dashboard";
import { TIPO_EVENTO_CONFIG } from "@/lib/constants";
import { formatFechaHora } from "@/lib/utils";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const pctDisponibles = stats.totalRecursos
    ? Math.round((stats.disponibles / stats.totalRecursos) * 100)
    : 0;

  return (
    <>
      <div className="hero">
        <div>
          <p className="eyebrow">GESTIÓN DE RECURSOS</p>
          <h1>
            Pulso operativo <span>—</span>
          </h1>
          <p className="subtitle">El estado de tus recursos, en una sola mirada.</p>
        </div>
        <Link href="/recursos?nuevo=1" className="primary-button">
          <Plus size={17} />
          Dar de alta
        </Link>
      </div>

      <div className="signal-grid">
        <article className="signal-card signal-main">
          <div className="signal-head">
            <span className="kicker">RECURSOS BAJO GESTIÓN</span>
          </div>
          <strong>{stats.totalRecursos}</strong>
          <span>{pctDisponibles}% disponible</span>
          <div className="pulse-line">
            {Array.from({ length: 12 }, (_, i) => (
              <b key={i} />
            ))}
          </div>
          <div className="signal-foot">
            <span>{stats.disponibles} disponibles</span>
            <span>{stats.asignados} asignados</span>
          </div>
        </article>
        <article className="signal-card">
          <span className="signal-icon amber">
            <Clock3 size={19} />
          </span>
          <strong>{stats.enReparacion}</strong>
          <span>En reparación</span>
          <Link href="/recursos">
            Ver inventario <ArrowUpRight size={14} />
          </Link>
        </article>
        <article className="signal-card">
          <span className="signal-icon rose">
            <AlertTriangle size={19} />
          </span>
          <strong>{stats.solicitudesPendientes}</strong>
          <span>Solicitudes pendientes</span>
          <Link href="/solicitudes">
            Revisar <ArrowUpRight size={14} />
          </Link>
        </article>
      </div>

      <section className="panel movement-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">NUEVO MOVIMIENTO</p>
            <h2>¿Qué necesitás registrar?</h2>
          </div>
          <span className="panel-count">3 opciones</span>
        </div>
        <div className="movement-choices">
          <Link href="/entregas?nuevo=1" className="movement-choice indigo">
            <span>
              <ArrowUpRight size={22} />
            </span>
            <div>
              <strong>Entregar recurso</strong>
              <small>Asigná un activo a una persona</small>
            </div>
          </Link>
          <Link href="/devoluciones?nuevo=1" className="movement-choice sage">
            <span>
              <ArrowUpRight size={22} style={{ transform: "rotate(90deg)" }} />
            </span>
            <div>
              <strong>Recibir devolución</strong>
              <small>Registrá estado y evidencia</small>
            </div>
          </Link>
          <Link href="/recursos?nuevo=1" className="movement-choice sand">
            <span>
              <Plus size={22} />
            </span>
            <div>
              <strong>Dar de alta recurso</strong>
              <small>Sumá un nuevo activo al inventario</small>
            </div>
          </Link>
        </div>
      </section>

      <section className="panel activity-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">RECIENTE</p>
            <h2>Actividad del sistema</h2>
          </div>
          <Link href="/auditoria" className="text-button">
            Ver auditoría <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="update-list">
          {stats.eventosRecientes.length === 0 && (
            <p className="subtitle">Todavía no hay movimientos registrados.</p>
          )}
          {stats.eventosRecientes.map((evento) => {
            const config = TIPO_EVENTO_CONFIG[evento.tipo_evento];
            return (
              <div className="update" key={evento.id}>
                <span className={`update-dot ${config.tono === "blue" ? "" : config.tono}`} />
                <div>
                  <strong>{config.label}</strong>
                  <p>
                    {evento.recurso
                      ? [evento.recurso.marca, evento.recurso.modelo].filter(Boolean).join(" ") ||
                        evento.recurso.codigo_interno
                      : evento.descripcion}
                  </p>
                  <small>
                    {formatFechaHora(evento.fecha_evento)}
                    {evento.actor ? ` · ${evento.actor.nombre} ${evento.actor.apellido}` : ""}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
