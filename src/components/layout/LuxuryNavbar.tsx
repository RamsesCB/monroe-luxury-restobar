"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Bell } from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";

export function LuxuryNavbar() {
  const { itemCount, setDrawerOpen } = useOrderStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
        isScrolled ? "py-3 bg-obsidian-950/85 backdrop-blur-xl border-b border-white/[0.05]" : "py-5 sm:py-6"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center justify-between pointer-events-auto">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 flex items-center justify-center text-obsidian-950 font-serif font-black text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-xl tracking-[0.25em] text-ivory group-hover:text-gold-300 transition-colors">
              MONROE
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-400/90 font-medium -mt-1">
              Restobar
            </span>
          </div>
        </Link>

        {/* Subtle Action: Mi Mesa / Carrito */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-gold-500/15 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-gold-300 text-xs font-medium tracking-wide transition-all active:scale-95 shadow-lg"
          aria-label="Ver comanda de la mesa"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
          <span>Mi Mesa</span>
          {itemCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold flex items-center justify-center ml-1">
              {itemCount}
            </span>
          )}
        </button>

      </div>
    </header>
  );
}
