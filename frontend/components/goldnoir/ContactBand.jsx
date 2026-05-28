"use client";

import { Instagram, MessageCircleMore } from "lucide-react";
import { instagramLink, whatsappLink } from "../../lib/links";
import { trackClientEvent } from "../../lib/track";

export function ContactBand() {
  return (
    <section className="border-y border-white/5 bg-[#0b0b0b] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">WhatsApp e Instagram</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-white sm:text-5xl">
            Hablemos de <span className="italic text-[var(--gold)]">fragancias</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">
            Si tienes preguntas o quieres recomendaciones personalizadas, no dudes en contactarnos. Estamos aquí para ayudarte a encontrar tu aroma perfecto.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              trackClientEvent({ eventType: "click", action: "contact_band_whatsapp_click", label: "contact-band" });
              window.open(whatsappLink("Hola! Me gustaría conocer más sobre los perfumes de GoldNoir 🖤"), "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-black transition hover:opacity-90"
          >
            <MessageCircleMore size={14} />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => {
              trackClientEvent({ eventType: "click", action: "contact_band_instagram_click", label: "contact-band" });
              window.open(instagramLink(), "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/25 bg-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.35em] text-white transition hover:border-[var(--gold)]/50 hover:text-[var(--gold)]"
          >
            <Instagram size={14} />
            Instagram
          </button>
        </div>
      </div>
    </section>
  );
}