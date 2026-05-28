import { ContactBand } from "../../components/goldnoir/ContactBand";

export default function ContactPage() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">Ruta</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-white sm:text-5xl">Contacto</h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">Atajos directos para WhatsApp e Instagram, pensados para cerrar ventas rápido.</p>
        </div>
        <ContactBand />
      </div>
    </section>
  );
}