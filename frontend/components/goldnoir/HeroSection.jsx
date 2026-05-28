"use client";

import { ArrowRight, BadgePercent, CircleDashed, MapPin } from "lucide-react";

const heroBullets = [
  { icon: BadgePercent, label: "Catálogo con oferta y WhatsApp" },
  { icon: CircleDashed, label: "Quiz de recomendación desde el inicio" },
  { icon: MapPin, label: "Marca elegante para crecer en Colombia" },
];

export function HeroSection({ onCatalog, onQuiz }) {
  return (
    <section id="inicio" className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-[var(--gold)]/20 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
            Perfumería de lujo · negro y dorado
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-light leading-[0.9] tracking-wide sm:text-7xl lg:text-8xl">
            Gold<span className="italic text-[var(--gold)]">Noir</span>
          </h1>
          <div className="mt-6 h-px w-16 bg-[var(--gold)]/70" />
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
            Descubre perfumes de diseñador, recibe recomendación personalizada y compra rápido con acompañamiento real por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCatalog}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px] hover:bg-[var(--gold-soft)]"
            >
              Ver catálogo <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={onQuiz}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-medium uppercase tracking-[0.3em] text-white transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
            >
              Encontrar mi aroma
            </button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroBullets.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <Icon className="mb-4 text-[var(--gold)]" size={18} />
                  <p className="text-sm leading-6 text-stone-300">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(210,177,93,0.18),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] blur-2xl" />
          <div className="rounded-[2rem] border border-[var(--gold)]/15 bg-[var(--panel)]/80 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0f0f0f] p-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">Colección destacada</p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-light tracking-wide text-white">
                Fragancias que dejan huella desde el primer instante.
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-400">
                Explora perfumes de diseñador reconocidos, compara estilos y encuentra tu aroma ideal con una experiencia elegante y fluida.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">WhatsApp</p>
                  <p className="mt-2 text-sm text-stone-200">Asesoría 1:1 en minutos para elegir aroma, precio y disponibilidad.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Instagram</p>
                  <p className="mt-2 text-sm text-stone-200">Novedades y referencias visuales para decidir con más confianza.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}