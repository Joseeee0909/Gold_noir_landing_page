"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu,
  ShoppingBag,
  Sparkles,
  Phone,
} from "lucide-react";

import { trackClientEvent } from "../../lib/track";
import { BrandMark } from "./BrandMark";

const publicLinks = [
  { href: "#inicio", label: "Inicio", icon: Home },
  { href: "#catalogo", label: "Catálogo", icon: ShoppingBag },
  { href: "#quiz", label: "Quiz", icon: Sparkles },
  { href: "#contacto", label: "Contacto", icon: Phone },
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
    <div className="min-h-screen scroll-smooth bg-black text-stone-100">
      {/* Desktop Sidebar */}
      <aside className="group fixed left-4 top-4 z-50 hidden h-[calc(100vh-2rem)] w-24 flex-col overflow-hidden rounded-[1.75rem] border border-white/5 bg-black/55 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-300 hover:w-80 hover:bg-black/70 focus-within:w-80 lg:flex">
        
        {/* Brand */}
        <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/5 bg-white/[0.03] p-2.5 transition group-hover:border-[var(--gold)]/15">
          <BrandMark className="h-14 w-14 shrink-0" />

          <div className="min-w-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <p className="text-[9px] uppercase tracking-[0.4em] text-stone-500">
              GoldNoir
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-stone-300">
              Perfumeria
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-2">
          {publicLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
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
                className="flex h-14 w-full items-center justify-center gap-0 rounded-2xl bg-white/[0.02] px-3 text-stone-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-stone-200 group-hover:justify-start group-hover:gap-3"
              >
                <span className="mx-auto grid h-10 w-10 flex-none place-items-center rounded-2xl transition group-hover:mx-0">
                  <Icon
                    size={19}
                    className="text-stone-300"
                  />
                </span>

                <span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] uppercase tracking-[0.28em] opacity-0 transition-all duration-200 group-hover:max-w-[12rem] group-hover:opacity-100">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="h-12 w-12 shrink-0" />

            <p className="font-[family-name:var(--font-display)] text-xl tracking-[0.28em] text-[var(--gold)]">
              GoldNoir
            </p>
          </div>

          <Menu
            size={18}
            className="text-stone-300"
          />
        </div>
      </header>

      {/* Main */}
      <main className="pb-20 lg:pl-[7rem]">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-black/90 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          {publicLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
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
                className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[10px] uppercase tracking-[0.25em] text-stone-400"
              >
                <Icon size={16} />

                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}