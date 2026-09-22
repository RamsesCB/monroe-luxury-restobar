"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { DISHES } from "@/data/menuData";
import { DishCard } from "./DishCard";

export function MenuSection() {
  const featuredDish = DISHES[0];

  if (!featuredDish) return null;

  return (
    <section id="carta-digital" className="relative py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto flex flex-col items-center">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header (Minimalist) */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-300 text-[11px] font-semibold uppercase tracking-[0.25em]">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>Plato Insignia</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ivory tracking-wide leading-tight">
          Alta Cocina de Autor
        </h1>
      </div>

      {/* The Dish */}
      <DishCard dish={featuredDish} />

    </section>
  );
}
