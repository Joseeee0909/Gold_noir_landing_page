import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MessageCircle, Sparkles } from "lucide-react";
import { initialPerfumes } from "../../../lib/goldnoir-data";
import { whatsappLink } from "../../../lib/links";
import { OrderForm } from "../../../components/goldnoir/OrderForm";

export const dynamic = "force-dynamic";

export default function PerfumePage({ params }) {
  const perfume = initialPerfumes.find((item) => item.id === params.id);

  if (!perfume) notFound();

  return (
    <main className="min-h-screen px-4 py-10 text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-stone-400 transition hover:text-[var(--gold)]">
          <ArrowLeft size={14} />
          Volver a GoldNoir
        </Link>

        <section className="mt-6 grid gap-8 rounded-[2rem] border border-white/10 bg-[var(--panel)]/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)] lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#151515]">
            {perfume.image ? (
              <img src={perfume.image} alt={perfume.name} className="h-full min-h-[420px] w-full object-cover" />
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-stone-500">
                <Sparkles className="mb-3 text-[var(--gold)]/50" size={28} />
                <p className="text-xs uppercase tracking-[0.35em]">Sin imagen</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">Página de perfume</p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl font-light leading-tight text-white sm:text-6xl">{perfume.name}</h1>
              <p className="mt-3 text-sm uppercase tracking-[0.35em] text-stone-500">{perfume.brand}</p>
            </div>

            <p className="rounded-2xl border border-[var(--gold)]/12 bg-[var(--gold)]/5 p-5 text-sm leading-7 text-stone-300">
              <span className="font-[family-name:var(--font-display)] text-lg italic text-[var(--gold)]">Inspiración:</span> {perfume.inspiration || "Sin inspiración definida todavía."}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Notas" value={perfume.notes} />
              <Detail label="Duración" value={perfume.duration} />
              <Detail label="Ocasión" value={perfume.occasion} />
              <Detail label="Género" value={perfume.gender} />
            </div>

            <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Precio</p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-light text-[var(--gold)]">
                  ${Number(perfume.price).toLocaleString("es-CO")}
                  <span className="ml-2 text-sm text-stone-500">COP</span>
                </p>
              </div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-emerald-300">
                <BadgeCheck size={14} />
                Disponible para pedido
              </p>
            </div>

            <a
              href={whatsappLink(`Hola, me interesa el perfume *${perfume.name}* de ${perfume.brand}. ¿Está disponible?`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-xs font-semibold uppercase tracking-[0.35em] text-black transition hover:opacity-90"
            >
              <MessageCircle size={16} />
              Quiero este perfume
            </a>

            <OrderForm perfume={perfume} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-stone-300">{value}</p>
    </div>
  );
}