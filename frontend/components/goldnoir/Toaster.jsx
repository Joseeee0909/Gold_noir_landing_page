"use client";

export function Toaster({ message }) {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-[var(--gold)]/25 bg-black/90 px-5 py-3 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
      {message}
    </div>
  );
}