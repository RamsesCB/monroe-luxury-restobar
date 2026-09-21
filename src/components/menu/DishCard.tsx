"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Plus, Eye, Box, Wine, ChefHat } from "lucide-react";
import { Dish } from "@/types/menu";
import { formatPEN } from "@/lib/utils";
import { GoldBadge } from "@/components/ui/GoldBadge";
import { useOrderStore } from "@/hooks/useOrderStore";

interface DishCardProps {
  dish: Dish;
  onSelect: (dish: Dish) => void;
  onOpen3d: (dish: Dish) => void;
}

export function DishCard({ dish, onSelect, onOpen3d }: DishCardProps) {
  const { addItem } = useOrderStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(dish, 1);
  };

  const handleQuick3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen3d(dish);
  };

  return (
    <div
      onClick={() => onSelect(dish)}
      className="group relative cursor-pointer rounded-[2rem] p-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-gold-500/40 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.95),0_0_25px_-5px_rgba(212,175,55,0.2)] hover:-translate-y-1.5 flex flex-col h-full"
    >
      <div className="relative w-full h-full rounded-[calc(2rem-0.375rem)] overflow-hidden bg-gradient-to-b from-[#151519]/95 via-[#111114]/95 to-[#0A0A0B]/98 border border-white/[0.04] p-5 flex flex-col justify-between">
        
        {/* Top Media Container */}
        <div>
          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 bg-obsidian-950 border border-white/[0.06]">
            {dish.video ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                poster={dish.image}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              >
                {dish.videoWebm && <source src={dish.videoWebm} type="video/webm" />}
                <source src={dish.video} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            )}
            
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-black/20 to-transparent opacity-80 pointer-events-none" />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {dish.isSignature && (
                  <GoldBadge size="sm" variant="gold">
                    Signature
                  </GoldBadge>
                )}
                {dish.tags.includes("Dry Aged") && (
                  <GoldBadge size="sm" variant="obsidian">
                    Dry Aged 45D
                  </GoldBadge>
                )}
                {dish.tags.includes("Pasta Fresca Fatta a Mano") && (
                  <GoldBadge size="sm" variant="obsidian">
                    Fatta a Mano
                  </GoldBadge>
                )}
              </div>

              {dish.is3dAvailable && (
                <button
                  onClick={handleQuick3D}
                  className="px-2.5 py-1 rounded-full bg-obsidian-950/90 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)] hover:scale-105"
                  title="Explorar modelo 3D & Realidad Aumentada"
                >
                  <Box className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: "10s" }} />
                  <span>3D / AR</span>
                </button>
              )}
            </div>

            {/* Price Tag in Bottom Right of Image */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-obsidian-950/90 backdrop-blur-md border border-gold-500/30 text-gold-300 font-serif font-bold text-base shadow-lg">
              {formatPEN(dish.price)}
            </div>
          </div>

          {/* Dish Information */}
          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory group-hover:text-gold-300 transition-colors duration-300 line-clamp-1">
              {dish.name}
            </h3>
            
            <p className="text-xs text-gold-400/90 font-medium tracking-wide">
              {dish.subtitle}
            </p>

            <p className="text-xs text-platinum/90 leading-relaxed line-clamp-2 pt-1 font-light">
              {dish.description}
            </p>
          </div>
        </div>

        {/* Card Footer: Pairing & Quick Action */}
        <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-platinum truncate">
            <Wine className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="truncate">
              Maridaje: <span className="text-ivory font-medium">{dish.pairingSuggestion.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleQuickAdd}
              className="px-3.5 py-2 rounded-full bg-gold-500/15 hover:bg-gold-500 text-gold-300 hover:text-obsidian-950 border border-gold-500/30 hover:border-gold-500 text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] active:scale-95"
              aria-label={`Añadir ${dish.name} a la mesa`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mesa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
