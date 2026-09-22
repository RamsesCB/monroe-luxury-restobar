"use client";

import React from "react";
import { RESTAURANT_INFO } from "@/data/restaurantInfo";

export function LuxuryFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-obsidian-950 py-8 px-4 text-center">
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gold-500 text-obsidian-950 font-serif font-bold text-xs flex items-center justify-center">
            M
          </div>
          <span className="font-serif font-bold tracking-[0.2em] text-sm text-ivory">
            MONROE
          </span>
        </div>
        <p className="text-[11px] text-platinum/60">
          {RESTAURANT_INFO.address} • {RESTAURANT_INFO.city}
        </p>
        <p className="text-[10px] text-platinum/40">
          © {new Date().getFullYear()} MONROE Restobar. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
