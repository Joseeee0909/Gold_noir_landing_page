"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import { quizQuestions } from "../../lib/goldnoir-data";
import { whatsappLink } from "../../lib/links";
import { recommendPerfumes } from "../../lib/recommendations";
import { getSessionId, trackClientEvent } from "../../lib/track";

export function QuizSection({ perfumes }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentQuestion = quizQuestions[step];
  const answered = answers[currentQuestion?.id];

  const progress = useMemo(() => quizQuestions.map((question, index) => Boolean(answers[question.id]) || (index < step && Boolean(answers[question.id]))), [answers, step]);

  const select = (questionId, value) => {
    setAnswers((state) => ({ ...state, [questionId]: value }));
  };

  const favoriteText = answers.favorites ?? "";

  const finish = async () => {
    setLoading(true);
    const fallback = recommendPerfumes(perfumes, answers);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          products: perfumes,
          sessionId: getSessionId(),
          page: "/quiz",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(Array.isArray(data.recommendations) ? data.recommendations : fallback);
      } else {
        setResults(fallback);
      }
    } catch {
      setResults(fallback);
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  const next = () => {
    if (step < quizQuestions.length - 1) setStep((value) => value + 1);
    else void finish();
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    setResults([]);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-[var(--panel)]/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.4)] sm:p-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--gold)]">Resultados</p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-white sm:text-5xl">Tu fragancia ideal</h3>
          <p className="mt-4 text-sm leading-7 text-stone-400">Recomendaciones automáticas simples, basadas en la lógica de tu selección.</p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {results.map((perfume) => (
            <article key={perfume.id} className="rounded-[1.6rem] border border-white/10 bg-[#141414] p-5">
              <p className="inline-flex rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-black">{perfume.match}% match</p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">{perfume.brand}</p>
              <h4 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-light text-white">{perfume.name}</h4>
              {perfume.occasion && <p className="mt-3 text-sm text-stone-400">Ocasión: {perfume.occasion}</p>}
              {perfume.gender && <p className="mt-1 text-sm text-stone-400">Género: {perfume.gender}</p>}
              <p className="mt-4 font-[family-name:var(--font-display)] text-3xl font-light text-[var(--gold)]">${Number(perfume.price).toLocaleString("es-CO")} <span className="text-sm text-stone-500">COP</span></p>
              <button
                type="button"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/40 px-4 py-3 text-[10px] uppercase tracking-[0.35em] text-[#25D366] transition hover:bg-[#25D366] hover:text-black"
                onClick={() => {
                  trackClientEvent({ eventType: "click", action: "quiz_result_whatsapp_click", label: perfume.id });
                  window.open(whatsappLink(`Hola, el quiz me recomendó *${perfume.name}*. ¿Está disponible?`), "_blank", "noopener,noreferrer");
                }}
              >
                <Search size={14} />
                Me interesa este
              </button>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.35em] text-stone-300 transition hover:border-[var(--gold)]/30 hover:text-[var(--gold)]">
            <RotateCcw size={14} />
            Repetir quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[var(--panel)]/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.4)] sm:p-8">
      <div className="flex gap-2">
        {progress.map((isDone, index) => (
          <span key={quizQuestions[index].id} className={`h-1 flex-1 rounded-full transition ${isDone ? "bg-[var(--gold)]" : "bg-white/10"}`} />
        ))}
      </div>

      <div className="mt-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500">Paso {step + 1} de {quizQuestions.length}</p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-light text-white sm:text-4xl">{currentQuestion.question}</h3>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {currentQuestion.type === "text" ? (
          <div className="sm:col-span-2 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
            <label className="block text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Escribe aquí</label>
            <input
              type="text"
              value={favoriteText}
              onChange={(event) => select(currentQuestion.id, event.target.value)}
              placeholder="Ej: Euphoria, Sì, Libre, 212 VIP, Invictus..."
              className="mt-3 w-full rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-stone-500 focus:border-[var(--gold)]/40"
            />
          </div>
        ) : (
          currentQuestion.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => select(currentQuestion.id, option.value)}
              className={`rounded-[1.3rem] border px-4 py-4 text-left transition ${answered === option.value ? "border-[var(--gold)]/60 bg-[var(--gold)]/8 text-[var(--gold)]" : "border-white/10 bg-white/5 text-stone-300 hover:border-[var(--gold)]/30 hover:text-white"}`}
            >
              <span className="block text-lg">{option.emoji}</span>
              <span className="mt-2 block text-sm leading-6">{option.label}</span>
            </button>
          ))
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-stone-400 transition hover:text-white">
          <RotateCcw size={14} />
          Reiniciar
        </button>

        <button
          type="button"
          disabled={!answered || loading}
          onClick={next}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step < quizQuestions.length - 1 ? "Siguiente" : loading ? "Analizando..." : "Ver resultados"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}