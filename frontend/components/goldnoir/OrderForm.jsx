"use client";

import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { getSessionId, trackClientEvent } from "../../lib/track";

export function OrderForm({ perfume }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = name && phone;

  async function submitOrder(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      trackClientEvent({ eventType: "click", action: "order_submit_click", label: perfume.id, page: `/perfumes/${perfume.id}` });

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: perfume.id,
          name,
          phone,
          city,
          notes,
          channel: "web",
          perfumeName: perfume.name,
          perfumeBrand: perfume.brand,
          price: perfume.price,
          sessionId: getSessionId(),
          page: `/perfumes/${perfume.id}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo guardar el pedido");
      }

      setDone(true);
      setName("");
      setPhone("");
      setCity("");
      setNotes("");
    } catch (submitError) {
      setError(submitError.message || "Error al enviar el pedido");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[1.6rem] border border-emerald-500/20 bg-emerald-500/10 p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Pedido enviado</p>
        <p className="mt-2 text-sm leading-6 text-stone-200">Guardamos tu solicitud. Te contactaremos para confirmar disponibilidad.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submitOrder} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2">
        <PhoneCall size={16} className="text-[var(--gold)]" />
        <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Hacer pedido</p>
      </div>

      <div className="mt-4 grid gap-3">
        <FieldInput label="Tu nombre" value={name} onChange={setName} placeholder="Tu nombre completo" />
        <FieldInput label="Tu teléfono" value={phone} onChange={setPhone} placeholder="Ej: 3001234567" />
        <FieldInput label="Ciudad" value={city} onChange={setCity} placeholder="Ej: Medellín" />
        <FieldInput label="Notas" value={notes} onChange={setNotes} placeholder="Ej: para regalo, entrega rápida..." textarea />
      </div>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Enviando..." : "Enviar pedido"}
      </button>
    </form>
  );
}

function FieldInput({ label, value, onChange, placeholder, textarea = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-stone-500">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-stone-500 focus:border-[var(--gold)]/40"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-stone-500 focus:border-[var(--gold)]/40"
        />
      )}
    </label>
  );
}