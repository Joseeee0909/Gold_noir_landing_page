"use client";

import Link from "next/link";
import { X, MessageCircle, Sparkles } from "lucide-react";
import { whatsappLink } from "../../lib/links";
import { trackClientEvent } from "../../lib/track";

export function PerfumeModal({ perfume, onClose }) {
  if (!perfume) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--gold)]/20 bg-[#0f0f0f] shadow-[0_30px_100px_rgba(0,0,0,0.7)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-white/5 p-6 sm:p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">Detalle del perfume</p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-light text-white">{perfume.name}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.35em] text-stone-500">{perfume.brand}</p>
          </div>
          <button type="button" className="rounded-full border border-white/10 p-2 text-stone-400 transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#151515]">
            {perfume.image ? (
              <img src={perfume.image} alt={perfume.name} className="h-full min-h-[320px] w-full object-cover" />
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-stone-500">
                <Sparkles className="mb-3 text-[var(--gold)]/50" size={26} />
                <p className="text-xs uppercase tracking-[0.35em]">Sin imagen</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {perfume.inspiration && (
              <p className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm leading-7 text-stone-300">
                <span className="font-[family-name:var(--font-display)] text-lg italic text-[var(--gold)]">Inspirado en:</span> {perfume.inspiration}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Notas" value={perfume.notes} />
              <Detail label="Duración" value={perfume.duration} />
              <Detail label="Ocasión" value={perfume.occasion} />
              <Detail label="Género" value={perfume.gender} />
            </div>

            <div className="rounded-2xl border border-[var(--gold)]/12 bg-[var(--gold)]/5 p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Precio</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-light text-[var(--gold)]">
                ${Number(perfume.price).toLocaleString("es-CO")}
                <span className="ml-2 text-sm text-stone-500">COP</span>
              </p>
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-xs font-semibold uppercase tracking-[0.35em] text-black transition hover:opacity-90"
              onClick={() => {
                trackClientEvent({ eventType: "click", action: "modal_whatsapp_click", label: perfume.id });
                window.open(whatsappLink(`Hola, me interesa el perfume *${perfume.name}* de ${perfume.brand}. ¿Está disponible?`), "_blank", "noopener,noreferrer");
              }}
            >
              <MessageCircle size={16} />
              Quiero este perfume
            </button>

            <Link
              href={`/perfumes/${perfume.id}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.35em] text-stone-300 transition hover:border-[var(--gold)]/35 hover:text-[var(--gold)]"
            >
              Ver ficha completa
            </Link>
          </div>
        </div>
      </div>
    </div>
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