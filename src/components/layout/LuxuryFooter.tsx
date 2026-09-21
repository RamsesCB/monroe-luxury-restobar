"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Instagram, Facebook, ArrowUp } from "lucide-react";
import { RESTAURANT_INFO } from "@/data/restaurantInfo";

export function LuxuryFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-obsidian-950 pt-16 pb-12 px-4 sm:px-8">
      
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-950 font-serif font-black text-sm shadow-gold-glow">
                M
              </div>
              <span className="font-serif font-bold text-xl tracking-[0.25em] text-ivory">
                MONROE
              </span>
            </div>

            <p className="text-xs text-platinum font-light leading-relaxed">
              {RESTAURANT_INFO.tagline}. La cumbre de las pastas frescas artesanales, carnes maduradas y coctelería sensorial en Chimbote, Perú.
            </p>

            <div className="text-xs text-gold-400 font-mono">
              {RESTAURANT_INFO.legalName}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs text-platinum">
            <div className="space-y-2.5">
              <div className="font-semibold text-ivory uppercase tracking-wider text-[11px]">
                Navegación
              </div>
              <ul className="space-y-2">
                <li>
                  <a href="#carta-digital" className="hover:text-gold-300 transition-colors">
                    Carta Digital 3D
                  </a>
                </li>
                <li>
                  <a href="#esencia-monroe" className="hover:text-gold-300 transition-colors">
                    Nuestra Esencia
                  </a>
                </li>
                <li>
                  <a href="#ubicacion" className="hover:text-gold-300 transition-colors">
                    Ubicación & Horarios
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="font-semibold text-ivory uppercase tracking-wider text-[11px]">
                Experiencias
              </div>
              <ul className="space-y-2">
                <li>
                  <span className="hover:text-gold-300 transition-colors">Cava Privada VIP</span>
                </li>
                <li>
                  <span className="hover:text-gold-300 transition-colors">Mesa del Chef</span>
                </li>
                <li>
                  <span className="hover:text-gold-300 transition-colors">Terraza Lounge Bahía</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="font-semibold text-ivory uppercase tracking-wider text-[11px]">
                Contacto
              </div>
              <ul className="space-y-2">
                <li>{RESTAURANT_INFO.phone}</li>
                <li>{RESTAURANT_INFO.email}</li>
                <li>{RESTAURANT_INFO.city}</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-platinum/60">
          <div>
            © {new Date().getFullYear()} MONROE Luxury Restobar. Todos los derechos reservados.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-gold-500/20 text-platinum hover:text-gold-300 border border-white/10 hover:border-gold-500/40 transition-all"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-gold-400" />
          </button>
        </div>

      </div>

    </footer>
  );
}
