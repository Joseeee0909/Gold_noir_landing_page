"use client";

import { useState } from "react";
import { PackagePlus, ShieldCheck, Trash2 } from "lucide-react";

export function AdminSection({ perfumes, setPerfumes, showToast }) {
  const [tab, setTab] = useState("add");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    gender: "Femenino",
    occasion: "",
    duration: "",
    notes: "",
    inspiration: "",
    image: "",
  });

  const addPerfume = () => {
    if (!form.name || !form.price) {
      showToast("Completa nombre y precio");
      return;
    }

    setPerfumes((previous) => [
      {
        id: crypto.randomUUID(),
        ...form,
        brand: form.brand || "GoldNoir",
      },
      ...previous,
    ]);
    setForm({ name: "", brand: "", price: "", gender: "Femenino", occasion: "", duration: "", notes: "", inspiration: "", image: "" });
    showToast("Perfume agregado al catálogo");
    setTab("list");
  };

  const removePerfume = (id) => {
    setPerfumes((previous) => previous.filter((item) => item.id !== id));
    showToast("Eliminado del catálogo");
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[var(--panel)]/90 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.4)] sm:p-8">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        {[
          { id: "add", label: "Agregar perfume", icon: PackagePlus },
          { id: "list", label: "Catálogo actual", icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.35em] transition ${tab === item.id ? "bg-[var(--gold)] text-black" : "border border-white/10 bg-white/5 text-stone-300 hover:text-[var(--gold)]"}`}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "add" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Field label="Nombre del perfume *" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="Ej: 212 VIP Rosé" />
          <Field label="Marca (opcional)" value={form.brand} onChange={(value) => setForm({ ...form, brand: value })} placeholder="Ej: Carolina Herrera" />
          <Field label="Precio (COP) *" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} placeholder="Ej: 120000" />
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Género</label>
            <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none">
              <option>Femenino</option>
              <option>Masculino</option>
              <option>Unisex</option>
            </select>
          </div>
          <Field label="Ocasión" value={form.occasion} onChange={(value) => setForm({ ...form, occasion: value })} placeholder="Ej: Noche & eventos" />
          <Field label="Duración" value={form.duration} onChange={(value) => setForm({ ...form, duration: value })} placeholder="Ej: 6-8 horas" />
          <Field label="Notas" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} placeholder="Ej: bergamota, ámbar, cedro" full />
          <Field label="Inspiración" value={form.inspiration} onChange={(value) => setForm({ ...form, inspiration: value })} placeholder="Ej: pensado para noches elegantes" full />
          <Field label="Imagen URL" value={form.image} onChange={(value) => setForm({ ...form, image: value })} placeholder="https://..." full />

          <div className="lg:col-span-2">
            <button type="button" disabled={!form.name || !form.price} onClick={addPerfume} className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-40">
              <PackagePlus size={14} />
              Agregar al catálogo
            </button>
          </div>
        </div>
      )}

      {tab === "list" && (
        <div className="mt-6 space-y-3">
          {perfumes.length === 0 ? (
            <p className="rounded-[1.6rem] border border-white/8 bg-white/5 p-8 text-center text-sm text-stone-400">No hay perfumes aún en el catálogo.</p>
          ) : (
            perfumes.map((perfume) => (
              <article key={perfume.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-white/8 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-light text-white">{perfume.name}</p>
                  <p className="mt-1 text-sm text-stone-400">{perfume.brand} · {perfume.gender} · {perfume.occasion || "Sin ocasión"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--gold)]">${Number(perfume.price).toLocaleString("es-CO")}</p>
                  <button type="button" onClick={() => removePerfume(perfume.id)} className="inline-flex items-center gap-2 rounded-full border border-red-500/20 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-red-300 transition hover:bg-red-500/10 hover:text-red-200">
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", full = false }) {
  return (
    <div className={full ? "lg:col-span-2" : ""}>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-stone-500 focus:border-[var(--gold)]/40"
      />
    </div>
  );
}