"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogSection } from "./CatalogSection";
import { HeroSection } from "./HeroSection";
import { QuizSection } from "./QuizSection";
import { ContactBand } from "./ContactBand";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { floatingWhatsAppLink, whatsappLink } from "../../lib/links";
import { initialPerfumes } from "../../lib/goldnoir-data";
import { Toaster } from "./Toaster";
import { Reveal } from "./Reveal";
import { trackClientEvent } from "../../lib/track";

export default function GoldNoirLanding() {
  const [perfumes, setPerfumes] = useState([]);
  const [toast, setToast] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const toastTimer = useRef(null);

  const stats = useMemo(() => {
    const feminine = perfumes.filter((item) => item.gender === "Femenino").length;
    const masculine = perfumes.filter((item) => item.gender === "Masculino").length;
    const unisex = perfumes.filter((item) => item.gender === "Unisex").length;

    return {
      visits: 1247,
      leads: 89,
      catalog: perfumes.length,
      conversion: "7.1%",
      topGender: perfumes.length === 0 ? "Sin catálogo" : feminine >= masculine && feminine >= unisex ? "Femenino" : masculine >= unisex ? "Masculino" : "Unisex",
      topOccasion: perfumes.length === 0 ? "Sin catálogo" : perfumes[0]?.occasion || "Sin datos",
    };
  }, [perfumes]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          setPerfumes(data.products);
        }
      } catch {
        setPerfumes([]);
      }
    };

    loadProducts();
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    const timerId = window.setTimeout(() => setToast(""), 2400);
    toastTimer.current = timerId;
  };

  const sections = [
    { id: "inicio", label: "Inicio" },
    { id: "catalogo", label: "Catálogo" },
    { id: "quiz", label: "Quiz" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(210,177,93,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_20%)]" />
      <Navbar
        sections={sections}
        scrolled={scrolled}
        onJump={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
        onContact={() => {
          trackClientEvent({ eventType: "click", action: "navbar_contact_whatsapp", label: "navbar" });
          window.open(whatsappLink("Hola, me gustaría conocer más sobre GoldNoir"), "_blank", "noopener,noreferrer");
        }}
      />

      <main className="relative z-10">
        <Reveal>
          <HeroSection
            onCatalog={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
            onQuiz={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
          />
        </Reveal>
        <Reveal>
          <CatalogSection perfumes={perfumes} />
        </Reveal>
        <Reveal>
          <section id="quiz" className="border-t border-white/5 bg-[#0d0d0d] px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">Quiz inteligente</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light tracking-wide sm:text-5xl">
                Encuentra tu perfume <span className="italic text-[var(--gold)]">ideal</span>
              </h2>
    
            </div>
            <QuizSection perfumes={perfumes} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <ContactBand />
        </Reveal>

        <Footer />
      </main>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-xl text-black shadow-[0_12px_40px_rgba(37,211,102,0.32)] transition hover:scale-105"
        onClick={() => {
          trackClientEvent({ eventType: "click", action: "floating_whatsapp_click", label: "floating" });
          window.open(floatingWhatsAppLink("Hola GoldNoir, me interesa conocer más sobre sus perfumes 🖤"), "_blank", "noopener,noreferrer");
        }}
        aria-label="Contactar por WhatsApp"
      >
        <span>💬</span>
      </button>

      <Toaster message={toast} />
    </div>
  );
}