"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, ShoppingBag, Sparkles, Phone } from "lucide-react";
import { trackClientEvent } from "../../lib/track";

const publicLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/catalogo", label: "Catálogo", icon: ShoppingBag },
  { href: "/quiz", label: "Quiz", icon: Sparkles },
  { href: "/contacto", label: "Contacto", icon: Phone },
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;
    trackClientEvent({
      eventType: "page_view",
      action: "page_view",
      label: pathname,
      page: pathname,
    });
  }, [isAdminRoute, pathname]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-stone-100">
      <aside className="group fixed left-4 top-4 z-50 hidden h-[calc(100vh-2rem)] w-20 flex-col overflow-hidden rounded-[1.75rem] border border-white/5 bg-black/55 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-300 hover:w-72 hover:bg-black/70 focus-within:w-72 lg:flex">
        <div className="rounded-[1.35rem] border border-white/5 bg-white/[0.03] p-3 transition group-hover:border-[var(--gold)]/15">
          <p className="text-[9px] uppercase tracking-[0.4em] text-stone-500">GoldNoir</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-light leading-none text-stone-100 opacity-90 transition group-hover:text-white">
            G<em className="italic text-[var(--gold)]">N</em>
          </p>
        </div>

        <nav className="mt-4 space-y-2">
          {publicLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  trackClientEvent({
                    eventType: "click",
                    action: "sidebar_nav_click",
                    label: item.href,
                    page: pathname,
                  })
                }
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200 ${active ? "border-white/10 bg-white/[0.06] text-[var(--gold)]" : "border-white/[0.04] bg-white/[0.02] text-stone-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-stone-200"}`}
              >
                <Icon size={16} className={active ? "text-[var(--gold)]" : "text-stone-400"} />
                <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.28em] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[1.35rem] border border-white/5 bg-white/[0.03] p-3 text-sm text-stone-500">
          <p className="text-[9px] uppercase tracking-[0.35em] text-stone-500 opacity-0 transition group-hover:opacity-100">Atajos</p>
          <p className="mt-2 text-xs leading-5 opacity-0 transition group-hover:opacity-100">
            Pasa el mouse para expandir.
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.35em] text-[var(--gold)]">GoldNoir</p>
          <Menu size={18} className="text-stone-300" />
        </div>
      </header>

      <main className="pb-20 lg:pl-[6rem]">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-black/90 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          {publicLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  trackClientEvent({
                    eventType: "click",
                    action: "mobile_nav_click",
                    label: item.href,
                    page: pathname,
                  })
                }
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[10px] uppercase tracking-[0.25em] ${active ? "text-[var(--gold)]" : "text-stone-400"}`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}