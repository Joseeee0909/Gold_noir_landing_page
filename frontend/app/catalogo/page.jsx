import { CatalogSection } from "../../components/goldnoir/CatalogSection";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const response = await fetch(`${backendUrl}/products`, { cache: "no-store" });
  const data = response.ok ? await response.json() : { products: [] };
  const perfumes = Array.isArray(data.products) ? data.products : [];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">Ruta</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-white sm:text-5xl">Catálogo completo</h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">Accede a la colección desde una ruta separada y navega rápido desde el sidebar.</p>
        </div>
        <CatalogSection perfumes={perfumes} />
      </div>
    </section>
  );
}