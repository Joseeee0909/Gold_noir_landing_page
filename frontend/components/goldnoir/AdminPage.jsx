"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Bot, CalendarDays, Mail, MessageCircle, MousePointerClick, Package, ShoppingCart, Sparkles, Users } from "lucide-react";
import { AdminSection } from "./AdminSection";
import { initialPerfumes } from "../../lib/goldnoir-data";

const EMPTY_ANALYTICS = { daily: [], topActions: [] };

export default function AdminPage() {
  const router = useRouter();
  const [perfumes, setPerfumes] = useState(initialPerfumes);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    source: "local-json",
    configured: false,
    stats: null,
    analytics: EMPTY_ANALYTICS,
    contacts: [],
    orders: [],
    quizResponses: [],
    products: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setDashboard({
            source: data.source || "local-json",
            configured: Boolean(data.configured),
            stats: data.stats || null,
            analytics: data.analytics || EMPTY_ANALYTICS,
            contacts: data.contacts || [],
            orders: data.orders || [],
            quizResponses: data.quizResponses || [],
            products: data.products || [],
          });
          if (Array.isArray(data.products) && data.products.length > 0) {
            setPerfumes(data.products);
          }
          if (data.stats?.catalog != null) {
            setToast(`Catalogo cargado · ${data.stats.catalog} perfumes`);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => ({
      visits: dashboard.stats?.visits ?? 0,
      uniqueVisitors: dashboard.stats?.uniqueVisitors ?? 0,
      activeVisitors: dashboard.stats?.activeVisitors ?? 0,
      totalClicks: dashboard.stats?.totalClicks ?? 0,
      leads: dashboard.stats?.leads ?? 0,
      catalog: perfumes.length,
      conversion: dashboard.stats?.conversion ?? "0%",
      clickRate: dashboard.stats?.clickRate ?? "0%",
      topGender: dashboard.stats?.topGender ?? "Femenino",
      topOccasion: dashboard.stats?.topOccasion || perfumes[0]?.occasion || "Noche & eventos",
      categories: dashboard.stats?.categories ?? 0,
      orders: dashboard.stats?.orders ?? 0,
      contacts: dashboard.stats?.contacts ?? 0,
      quizResponses: dashboard.stats?.quizResponses ?? 0,
    }),
    [dashboard, perfumes],
  );

  const syncPerfumes = (updater) => {
    setPerfumes((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      void fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: next }),
      });
      void fetch("/api/dashboard", { cache: "no-store" }).then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        setDashboard((state) => ({
          ...state,
          source: data.source || state.source,
          configured: data.configured ?? state.configured,
          stats: data.stats || state.stats,
          analytics: data.analytics || state.analytics,
          contacts: data.contacts || state.contacts,
          orders: data.orders || state.orders,
          quizResponses: data.quizResponses || state.quizResponses,
          products: data.products || state.products,
        }));
      });
      return next;
    });
  };

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/");
  }

  return (
    <main className="min-h-screen px-4 py-10 text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-stone-400 transition hover:text-[var(--gold)]">
          <ArrowLeft size={14} />
          Volver a la landing
        </Link>

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">Admin privado</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light tracking-wide sm:text-5xl">
            Panel de <span className="italic text-[var(--gold)]">administracion</span>
          </h1>
          <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">
            Metricas utiles, pedidos, contactos, respuestas del quiz y catalogo editable desde una sola vista.
          </p>
          <button type="button" onClick={logout} className="mt-5 inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2 text-[10px] uppercase tracking-[0.35em] text-stone-300 transition hover:border-[var(--gold)]/30 hover:text-[var(--gold)]">
            Cerrar sesion
          </button>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-[var(--panel)]/90 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.4)] sm:p-8">
          {loading ? (
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-10 text-center text-sm text-stone-400">
              Cargando panel...
            </div>
          ) : (
            <div className="space-y-8">
              {!dashboard.configured ? (
                <article className="rounded-[1.6rem] border border-amber-400/30 bg-amber-500/10 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200">Base de datos pendiente</p>
                  <p className="mt-2 text-sm leading-6 text-stone-200">
                    El panel esta en modo local. Configura `BACKEND_URL` en el frontend y `DATABASE_URL` en el backend para usar PostgreSQL.
                  </p>
                </article>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Sesiones", value: stats.visits.toLocaleString(), hint: "page views registradas", icon: BarChart3 },
                  { label: "Visitantes unicos", value: stats.uniqueVisitors.toLocaleString(), hint: "sesiones distintas", icon: Users },
                  { label: "Clicks", value: stats.totalClicks.toLocaleString(), hint: "interacciones CTA", icon: MousePointerClick },
                  { label: "Leads", value: stats.leads, hint: "WhatsApp, contactos y quiz", icon: MessageCircle },
                  { label: "Pedidos", value: stats.orders, hint: "ordenes registradas", icon: ShoppingCart },
                  { label: "Quiz", value: stats.quizResponses, hint: "respuestas guardadas", icon: Sparkles },
                  { label: "Productos", value: stats.catalog, hint: "en catalogo", icon: Package },
                  { label: "Top ocasion", value: stats.topOccasion, hint: "mas fuerte en catalogo", icon: CalendarDays },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <article key={metric.label} className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">{metric.label}</p>
                          <p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-[var(--gold)]">{metric.value}</p>
                          <p className="mt-2 text-sm text-stone-400">{metric.hint}</p>
                        </div>
                        <Icon className="text-[var(--gold)]/80" size={18} />
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                <DailyChart data={dashboard.analytics?.daily || []} />
                <TopActionsChart actions={dashboard.analytics?.topActions || []} />
              </div>

              <AdminSection perfumes={perfumes} setPerfumes={syncPerfumes} showToast={setToast} />

              <div className="grid gap-4 xl:grid-cols-3">
                <ListCard
                  title="Pedidos recientes"
                  icon={ShoppingCart}
                  items={dashboard.orders.slice(0, 5).map((order) => `${order.name} · ${order.phone} · ${order.status}`)}
                  emptyText="Aun no hay pedidos."
                />
                <ListCard
                  title="Contactos recientes"
                  icon={MessageCircle}
                  items={dashboard.contacts.slice(0, 5).map((contact) => contact.message)}
                  emptyText="Aun no hay contactos."
                />
                <ListCard
                  title="Quiz recientes"
                  icon={Bot}
                  items={dashboard.quizResponses.slice(0, 5).map((response) => `${Object.keys(response.answers || {}).length} respuestas · ${new Date(response.createdAt).toLocaleDateString("es-CO")}`)}
                  emptyText="Aun no hay resultados de quiz."
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Conversion</p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-light text-white">{stats.conversion}</p>
                  <p className="mt-2 text-sm text-stone-400">De visitas a lead.</p>
                </article>
                <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">CTR</p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-light text-white">{stats.clickRate}</p>
                  <p className="mt-2 text-sm text-stone-400">Clicks sobre sesiones.</p>
                </article>
                <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Top genero</p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-light text-white">{stats.topGender}</p>
                  <p className="mt-2 text-sm text-stone-400">Segmento con mas catalogo activo.</p>
                </article>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Usuarios activos</p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-light text-white">{stats.activeVisitors.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-stone-400">Sesiones con al menos un click.</p>
                </article>
                <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Fuente de datos</p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-light text-white">{dashboard.source}</p>
                  <p className="mt-2 text-sm text-stone-400">El backend responde con `postgres` cuando detecta `DATABASE_URL`.</p>
                </article>
              </div>
            </div>
          )}
        </div>

        {toast ? <p className="mt-4 text-center text-xs uppercase tracking-[0.35em] text-[var(--gold)]">{toast}</p> : null}
      </div>
    </main>
  );
}

function ListCard({ title, icon: Icon, items, emptyText }) {
  return (
    <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">{title}</p>
        {Icon ? <Icon className="text-[var(--gold)]/80" size={16} /> : null}
      </div>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-stone-400">{emptyText}</p>
        ) : (
          items.map((item, index) => (
            <p key={`${title}-${index}`} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm leading-6 text-stone-300">
              {item}
            </p>
          ))
        )}
      </div>
    </article>
  );
}

function DailyChart({ data }) {
  const safeData = Array.isArray(data) ? data : [];
  const peak = Math.max(1, ...safeData.map((item) => Math.max(item.views || 0, item.clicks || 0, item.conversions || 0)));

  return (
    <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Ultimos 7 dias</p>
      <p className="mt-2 text-sm text-stone-400">Sesiones, clicks y conversiones diarias.</p>
      <div className="mt-6 grid grid-cols-7 gap-3">
        {safeData.map((item) => {
          const viewsHeight = Math.max(4, Math.round(((item.views || 0) / peak) * 80));
          const clicksHeight = Math.max(4, Math.round(((item.clicks || 0) / peak) * 80));
          const conversionsHeight = Math.max(4, Math.round(((item.conversions || 0) / peak) * 80));

          return (
            <div key={item.date} className="flex flex-col items-center gap-2">
              <div className="flex h-[92px] items-end gap-1">
                <span title={`Sesiones: ${item.views || 0}`} className="w-2 rounded-full bg-[var(--gold)]/85" style={{ height: `${viewsHeight}px` }} />
                <span title={`Clicks: ${item.clicks || 0}`} className="w-2 rounded-full bg-emerald-400/85" style={{ height: `${clicksHeight}px` }} />
                <span title={`Conversiones: ${item.conversions || 0}`} className="w-2 rounded-full bg-sky-300/85" style={{ height: `${conversionsHeight}px` }} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">{item.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-400">
        <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[var(--gold)]/85" /> Sesiones</span>
        <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-emerald-400/85" /> Clicks</span>
        <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-sky-300/85" /> Conversiones</span>
      </div>
    </article>
  );
}

function TopActionsChart({ actions }) {
  const safeActions = Array.isArray(actions) ? actions : [];
  const max = Math.max(1, ...safeActions.map((item) => item.count || 0));

  return (
    <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Top clicks</p>
      <p className="mt-2 text-sm text-stone-400">Que acciones hacen mas los usuarios.</p>
      <div className="mt-5 space-y-3">
        {safeActions.length === 0 ? (
          <p className="text-sm text-stone-400">Sin datos aun.</p>
        ) : (
          safeActions.map((item) => (
            <div key={item.action}>
              <div className="mb-1 flex items-center justify-between text-xs text-stone-300">
                <span>{item.action}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[var(--gold)]" style={{ width: `${Math.max(5, Math.round((item.count / max) * 100))}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
