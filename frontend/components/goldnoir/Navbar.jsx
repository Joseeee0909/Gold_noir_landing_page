"use client";

import { Sparkles } from "lucide-react";

export function Navbar({ sections, scrolled, onJump, onContact }) {
  return (
    <header className={`sticky top-0 z-40 border-b border-transparent px-4 py-4 transition ${scrolled ? "bg-black/85 backdrop-blur-xl border-white/10" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button type="button" className="flex items-center gap-2" onClick={() => onJump("inicio")}>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--gold)]/40 bg-white/5 text-[var(--gold)]">
            <Sparkles size={16} />
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-[0.35em] text-[var(--gold)]">GoldNoir</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="text-[10px] uppercase tracking-[0.35em] text-stone-300/80 transition hover:text-[var(--gold)]"
              onClick={() => onJump(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full border border-[var(--gold)]/50 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black"
          onClick={onContact}
        >
          Contactar
        </button>
      </div>
    </header>
  );
}