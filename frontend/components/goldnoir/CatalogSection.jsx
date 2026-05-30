"use client";

import { useMemo, useState } from "react";
import { MessageCircle, PackageSearch, Quote, Sparkles } from "lucide-react";
import { whatsappLink } from "../../lib/links";
import { trackClientEvent } from "../../lib/track";
import { PerfumeModal } from "./PerfumeModal";

const tabs = ["Todos", "Femenino", "Masculino", "Unisex"];

export function CatalogSection({ perfumes }) {
  const [tab, setTab] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (tab === "Todos") return perfumes;
    return perfumes.filter((perfume) => perfume.gender === tab);
  }, [perfumes, tab]);

  return (
    <section id="catalogo" className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">Catálogo</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light tracking-wide sm:text-5xl">
            Fragancias que <span className="italic text-[var(--gold)]">llaman la atención</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">
            Cada perfume puede mostrar imagen, notas, duración, ocasión, género, inspiración y precio. Los botones de WhatsApp quedan visibles en cada tarjeta.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.3em] transition ${tab === item ? "bg-[var(--gold)] text-black" : "border border-white/10 bg-white/5 text-stone-300 hover:border-[var(--gold)]/30 hover:text-[var(--gold)]"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
              <PackageSearch className="mx-auto text-[var(--gold)]" size={34} />
              <p className="mt-5 font-[family-name:var(--font-display)] text-3xl font-light">Catálogo en preparación</p>
              <p className="mt-3 text-sm text-stone-400">Aquí quedará tu catálogo integrado, listo para crecer con nuevos perfumes.</p>
            </div>
          ) : (
            filtered.map((perfume) => (
              <article
                key={perfume.id}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--panel)]/90 shadow-[0_20px_70px_rgba(0,0,0,0.4)] transition duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/30"
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="block w-full cursor-pointer text-left outline-none"
                  onClick={() => {
                    trackClientEvent({ eventType: "click", action: "catalog_open_modal", label: perfume.id });
                    setSelected(perfume);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    trackClientEvent({ eventType: "click", action: "catalog_open_modal", label: perfume.id });
                    setSelected(perfume);
                  }}
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#151515] via-[#0d0d0d] to-[#1b1b1b]">
                    {perfume.image ? (
                      <img src={perfume.image} alt={perfume.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center text-stone-500">
                        <div>
                          <Sparkles className="mx-auto mb-3 text-[var(--gold)]/50" size={24} />
                          <p className="text-xs uppercase tracking-[0.35em]">Ver detalles</p>
                        </div>
                      </div>
                    )}

                    <span className="absolute right-4 top-4 rounded-full border border-[var(--gold)]/35 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
                      {perfume.gender}
                    </span>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">{perfume.brand}</p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-light text-white">{perfume.name}</h3>
                    </div>

                    <p className="flex items-start gap-2 text-sm leading-6 text-stone-400">
                      <Quote className="mt-0.5 shrink-0 text-[var(--gold)]" size={16} />
                      {perfume.inspiration || "Inspiración pendiente por definir."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {perfume.notes && <Chip label={perfume.notes} />}
                      {perfume.duration && <Chip label={perfume.duration} />}
                      {perfume.occasion && <Chip label={perfume.occasion} />}
                    </div>

                    <div className="flex items-end justify-between gap-4 border-t border-white/8 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Precio</p>
                        <p className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--gold)]">
                          ${Number(perfume.price).toLocaleString("es-CO")}
                          <span className="ml-2 text-xs text-stone-500">COP</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#25D366] transition hover:bg-[#25D366] hover:text-black"
                        onClick={(event) => {
                          event.stopPropagation();
                          trackClientEvent({ eventType: "click", action: "catalog_whatsapp_click", label: perfume.id });
                          window.open(whatsappLink(`Hola, me interesa el perfume *${perfume.name}* de ${perfume.brand}. ¿Está disponible?`), "_blank", "noopener,noreferrer");
                        }}
                      >
                        <MessageCircle size={14} />
                        Quiero este perfume
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function Chip({ label }) {
  return <span className="rounded-full border border-[var(--gold)]/10 bg-[var(--gold)]/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-stone-300">{label}</span>;
}