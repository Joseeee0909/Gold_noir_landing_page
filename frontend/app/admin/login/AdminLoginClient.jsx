"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";
export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo iniciar sesión");
      }
      router.replace(nextUrl);
    } catch (submitError) {
      setError(submitError.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen px-4 py-12 text-stone-100 sm:px-6 lg:px-8">
      {" "}
      <div className="mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-[var(--panel)]/90 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
        {" "}
        <div className="text-center">
          {" "}
          <Sparkles className="mx-auto text-[var(--gold)]" size={30} />{" "}
          <p className="mt-4 text-[10px] uppercase tracking-[0.45em] text-[var(--gold)]">
            Acceso privado
          </p>{" "}
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-white">
            Panel de administración
          </h1>{" "}
          <p className="mt-3 text-sm leading-7 text-stone-400">
            Ingresa para ver métricas reales, pedidos y contactos.
          </p>{" "}
        </div>{" "}
        <form onSubmit={submit} className="mt-8 space-y-4">
          {" "}
          <label className="block">
            {" "}
            <span className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
              Contraseña
            </span>{" "}
            <div className="flex gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 focus-within:border-[var(--gold)]/40">
              {" "}
              <LockKeyhole className="mt-0.5 text-stone-500" size={16} />{" "}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-500"
                placeholder="Ingresa la clave"
              />{" "}
            </div>{" "}
          </label>{" "}
          {error ? <p className="text-sm text-red-300">{error}</p> : null}{" "}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {" "}
            {loading ? "Ingresando..." : "Entrar"}{" "}
          </button>{" "}
          <div className="text-center text-xs text-stone-500">
            {" "}
            <Link href="/" className="transition hover:text-[var(--gold)]">
              Volver a la landing
            </Link>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </main>
  );
}
