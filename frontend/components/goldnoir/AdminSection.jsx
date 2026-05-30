"use client";

import { useState } from "react";
import { PackagePlus, Pencil, ShieldCheck, Trash2, Upload, X } from "lucide-react";

export function AdminSection({ perfumes, setPerfumes, showToast }) {
  const [tab, setTab] = useState("add");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", brand: "", price: "", gender: "Femenino", occasion: "", duration: "", notes: "", inspiration: "", image: "" });
  };

  const startEdit = (perfume) => {
    setEditingId(perfume.id);
    setForm({
      name: perfume.name || "",
      brand: perfume.brand || "",
      price: String(perfume.price ?? ""),
      gender: perfume.gender || "Femenino",
      occasion: perfume.occasion || "",
      duration: perfume.duration || "",
      notes: perfume.notes || "",
      inspiration: perfume.inspiration || "",
      image: perfume.image || "",
    });
    setTab("add");
  };

  const uploadImage = async (file) => {
    if (!file) return;

    if (!String(file.type || "").startsWith("image/")) {
      showToast("Selecciona una imagen válida");
      return;
    }

    setUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo convertir la imagen");
      }

      const data = await response.json();
      setForm((current) => ({ ...current, image: data.url || "" }));
      showToast("Imagen convertida a WebP");
    } catch (error) {
      showToast(error.message || "Error subiendo la imagen");
    } finally {
      setUploading(false);
    }
  };

  const addPerfume = () => {
    if (!form.name || !form.price) {
      showToast("Completa nombre y precio");
      return;
    }

    const payload = {
      id: editingId || crypto.randomUUID(),
      ...form,
      brand: form.brand || "GoldNoir",
      price: Number(form.price) || 0,
    };

    setPerfumes((previous) => {
      const next = editingId
        ? previous.map((item) => (item.id === editingId ? payload : item))
        : [payload, ...previous];
      return next;
    });

    resetForm();
    showToast(editingId ? "Perfume actualizado" : "Perfume agregado al catálogo");
    setTab("list");
  };

  const removePerfume = (id) => {
    setPerfumes((previous) => previous.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
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
          {editingId ? (
            <div className="lg:col-span-2 flex items-center justify-between rounded-[1.2rem] border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-3 text-sm text-stone-200">
              <span>Editando perfume existente</span>
              <button type="button" onClick={() => resetForm()} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] transition hover:text-white">
                <X size={14} />
                Cancelar
              </button>
            </div>
          ) : null}
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
            <label className="mb-2 block text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">Subir imagen</label>
            <div className="flex flex-col gap-3 rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-stone-200">Convierte PNG o JPG a WebP y lo sube a Supabase Storage.</p>
                <p className="mt-1 text-xs text-stone-500">Se guarda una versión optimizada, pública y lista para usar en la ficha del perfume.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--gold)]/30 px-4 py-3 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black">
                <Upload size={14} />
                {uploading ? "Subiendo..." : "Elegir archivo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => uploadImage(event.target.files?.[0])}
                />
              </label>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button type="button" disabled={!form.name || !form.price} onClick={addPerfume} className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-[var(--gold-soft)] disabled:cursor-not-allowed disabled:opacity-40">
              <PackagePlus size={14} />
              {editingId ? "Guardar cambios" : "Agregar al catálogo"}
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
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    {perfume.image ? (
                      <img src={perfume.image} alt={perfume.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-stone-500">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl font-light text-white">{perfume.name}</p>
                    <p className="mt-1 text-sm text-stone-400">{perfume.brand} · {perfume.gender} · {perfume.occasion || "Sin ocasión"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--gold)]">${Number(perfume.price).toLocaleString("es-CO")}</p>
                  <button type="button" onClick={() => startEdit(perfume)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-stone-300 transition hover:border-[var(--gold)]/30 hover:text-[var(--gold)]">
                    <Pencil size={14} />
                    Editar
                  </button>
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