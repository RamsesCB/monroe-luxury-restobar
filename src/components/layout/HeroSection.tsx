"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowDown,
  Calendar,
  Box,
  Flame,
  UtensilsCrossed,
  Wine,
  GlassWater,
} from "lucide-react";
import { GoldBadge } from "@/components/ui/GoldBadge";
import { useOrderStore } from "@/hooks/useOrderStore";

export function HeroSection() {
  const { setReservationOpen } = useOrderStore();

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-8 overflow-hidden">
      
      {/* Background Hero Photography with Dark Luxury Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=90"
          alt="Monroe Restobar Gastronomía de Autor"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-[0.28] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/80 via-obsidian-900/60 to-obsidian-950" />
        <div className="absolute inset-0 bg-glass-radial opacity-70" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center"
        >
          <div className="px-4 py-1.5 rounded-full bg-obsidian-950/80 backdrop-blur-xl border border-gold-500/40 text-gold-300 text-xs font-semibold uppercase tracking-[0.25em] shadow-gold-glow flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
            <span>Chimbote, Perú • Restobar de Autor</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black text-ivory tracking-tight leading-[1.08]">
            El Arte del Fuego, <br />
            <span className="gold-text-shimmer">la Pasta y el Mar</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-platinum/90 max-w-2xl mx-auto font-light leading-relaxed">
            Una experiencia multisensorial donde la tradición de las pastas artesanales hechas a mano y los cortes Prime madurados en seco convergen con la coctelería de vanguardia.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <a
            href="#carta-digital"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-gold-glow-lg hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Explorar Carta Digital</span>
          </a>

          <button
            onClick={() => setReservationOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-gold-500/40 text-ivory font-semibold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 backdrop-blur-xl transition-all"
          >
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>Reservar Mesa VIP</span>
          </button>
        </motion.div>

        {/* Key Features Ribbons */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 max-w-4xl mx-auto"
        >
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-left">
            <div className="flex items-center gap-2 text-gold-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-bold font-serif text-ivory">Dry-Aged 45D</span>
            </div>
            <p className="text-[11px] text-platinum/70">Cámara propia de maduración en sal marina</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-left">
            <div className="flex items-center gap-2 text-gold-400 mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span className="text-xs font-bold font-serif text-ivory">Fatta a Mano</span>
            </div>
            <p className="text-[11px] text-platinum/70">Pastas frescas trefiladas al bronce al día</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-left">
            <div className="flex items-center gap-2 text-gold-400 mb-1">
              <GlassWater className="w-4 h-4" />
              <span className="text-xs font-bold font-serif text-ivory">Mixología Sensorial</span>
            </div>
            <p className="text-[11px] text-platinum/70">Cócteles con humo, fuego y botánicos</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-left">
            <div className="flex items-center gap-2 text-gold-400 mb-1">
              <Box className="w-4 h-4" />
              <span className="text-xs font-bold font-serif text-ivory">Visor AR 1:1</span>
            </div>
            <p className="text-[11px] text-platinum/70">Proyección en mesa real con tu teléfono</p>
          </div>
        </motion.div>

      </div>

      {/* Scroll Down Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase tracking-[0.2em] text-platinum">Descubre</span>
        <ArrowDown className="w-3.5 h-3.5 text-gold-400 animate-bounce" />
      </div>

    </section>
  );
}
