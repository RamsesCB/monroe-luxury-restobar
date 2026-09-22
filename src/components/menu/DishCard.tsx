"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Bell, Check, Sparkles } from "lucide-react";
import { Dish } from "@/types/menu";
import { formatPEN } from "@/lib/utils";
import { useOrderStore } from "@/hooks/useOrderStore";

interface DishCardProps {
  dish: Dish;
  onSelect?: (dish: Dish) => void;
}

export function DishCard({ dish }: DishCardProps) {
  const { addItem, setDrawerOpen } = useOrderStore();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);

  const handleOrder = () => {
    addItem(dish, 1);
    setIsOrdered(true);
    setDrawerOpen(true);
    setTimeout(() => setIsOrdered(false), 2500);
  };

  const handleCallWaiter = () => {
    setIsCallingWaiter(true);
    setTimeout(() => setIsCallingWaiter(false), 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center px-4 sm:px-6 py-4">
      
      {/* Visual Stage: Fully Contained, Floating with Drop Shadow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] flex items-center justify-center my-2 select-none"
      >
        {/* Soft Radial Ambient Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-gold-500/15 via-transparent to-transparent opacity-80 blur-2xl pointer-events-none" />

        {/* High-Resolution Plate Image with Drop-Shadow */}
        <div className="relative w-full h-full p-4 sm:p-6 flex items-center justify-center">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 320px, 400px"
            priority
            className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] transition-transform duration-700 hover:scale-105"
          />
        </div>
      </motion.div>

      {/* Typography & Details: Minimalist, High Impact */}
      <div className="space-y-3 mt-4 max-w-md">
        
        {/* Dish Title (Refined Serif) */}
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ivory tracking-wide leading-tight">
          {dish.name}
        </h2>

        {/* Highlighted Price (Champagne Gold) */}
        <div className="font-serif font-bold text-2xl sm:text-3xl text-gold-300">
          {formatPEN(dish.price)}
        </div>

        {/* Concise Description (1-2 lines) */}
        <p className="text-xs sm:text-sm text-platinum/80 font-light leading-relaxed px-2">
          {dish.description}
        </p>
      </div>

      {/* Primary Action Buttons (Clean CTAs) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mt-8">
        
        {/* CTA 1: Pedir este plato */}
        <button
          onClick={handleOrder}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {isOrdered ? (
            <>
              <Check className="w-4 h-4" />
              <span>Añadido a la Mesa</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Pedir este plato</span>
            </>
          )}
        </button>

        {/* CTA 2: Llamar al mozo */}
        <button
          onClick={handleCallWaiter}
          className="w-full py-3.5 px-6 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-gold-500/30 text-platinum hover:text-ivory text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Bell className="w-3.5 h-3.5 text-gold-400" />
          <span>{isCallingWaiter ? "Mozo notificado..." : "Llamar al mozo"}</span>
        </button>

      </div>

    </div>
  );
}
