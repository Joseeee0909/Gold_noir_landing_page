"use client";

import { instagramLink, whatsappLink } from "../../lib/links";
import { trackClientEvent } from "../../lib/track";

export function Footer() {
  return (
    <footer className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/5 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.35em] text-[var(--gold)]">GoldNoir</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-stone-500">Perfumería de diseñador · Colombia</p>
        </div>

        <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.35em] text-stone-400">
          <button
            type="button"
            onClick={() => {
              trackClientEvent({ eventType: "click", action: "footer_whatsapp_click", label: "footer" });
              window.open(whatsappLink("Hola GoldNoir!"), "_blank", "noopener,noreferrer");
            }}
            className="transition hover:text-[var(--gold)]"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => {
              trackClientEvent({ eventType: "click", action: "footer_instagram_click", label: "footer" });
              window.open(instagramLink(), "_blank", "noopener,noreferrer");
            }}
            className="transition hover:text-[var(--gold)]"
          >
            Instagram
          </button>
        </div>
      </div>
    </footer>
  );
}