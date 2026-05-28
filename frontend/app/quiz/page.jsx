import { QuizSection } from "../../components/goldnoir/QuizSection";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const response = await fetch(`${backendUrl}/products`, { cache: "no-store" });
  const data = response.ok ? await response.json() : { products: [] };
  const perfumes = Array.isArray(data.products) ? data.products : [];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">Ruta</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-white sm:text-5xl">Quiz de recomendaciones</h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">Preguntas simples, lógica básica y resultados accionables para vender más.</p>
        </div>
        <QuizSection perfumes={perfumes} />
      </div>
    </section>
  );
}