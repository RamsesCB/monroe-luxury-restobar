"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Box, Wine, ChefHat, Eye, Video, Layers } from "lucide-react";
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
  const [activeMedia, setActiveMedia] = useState<"video" | number>("video");

  const views = [
    { id: "video", label: "Rotación 360°", icon: Video },
    { id: 0, label: "Vista 45°", src: dish.galleryImages?.[0] || dish.image },
    { id: 1, label: "Vista 15°", src: dish.galleryImages?.[1] || dish.image },
    { id: 2, label: "Vista 90°", src: dish.galleryImages?.[2] || dish.image },
  ];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(dish, 1);
  };

  const handleLaunchAR = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen3d(dish);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 py-6">
      
      {/* Visual Stage: Unobstructed, Floating, Borderless */}
      <div className="w-full lg:w-1/2 flex flex-col items-center">
        <div 
          onClick={() => onSelect(dish)}
          className="group relative w-full aspect-square max-w-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer bg-gradient-to-b from-white/[0.03] to-transparent transition-all duration-500 hover:scale-[1.01]"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-gold-500/10 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Active Media Renderer */}
          {activeMedia === "video" && dish.video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              poster={dish.image}
              className="w-full h-full object-cover rounded-[2.5rem] pointer-events-none transition-transform duration-700 group-hover:scale-105"
            >
              {dish.videoWebm && <source src={dish.videoWebm} type="video/webm" />}
              <source src={dish.video} type="video/mp4" />
            </video>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={
                  typeof activeMedia === "number" && dish.galleryImages?.[activeMedia]
                    ? dish.galleryImages[activeMedia]
                    : dish.image
                }
                alt={dish.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-[2.5rem] transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          )}

          {/* Soft Organic Edge Vignette */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex flex-wrap gap-1.5">
              {dish.isSignature && <GoldBadge size="sm" variant="gold">Signature Monroe</GoldBadge>}
              <GoldBadge size="sm" variant="obsidian">Fatta a Mano</GoldBadge>
            </div>

            <div className="px-3 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-gold-500/30 text-gold-300 text-xs font-mono font-bold">
              {formatPEN(dish.price)}
            </div>
          </div>
        </div>

        {/* Perspective Switcher Pills */}
        <div className="flex items-center gap-2 mt-4 bg-white/[0.03] backdrop-blur-md p-1.5 rounded-full border border-white/[0.06]">
          {dish.video && (
            <button
              onClick={() => setActiveMedia("video")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeMedia === "video"
                  ? "bg-gold-500 text-obsidian-950 font-bold shadow-gold-glow"
                  : "text-platinum/70 hover:text-ivory hover:bg-white/[0.04]"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>360° Video</span>
            </button>
          )}

          {dish.galleryImages?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMedia(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeMedia === idx
                  ? "bg-gold-500 text-obsidian-950 font-bold shadow-gold-glow"
                  : "text-platinum/70 hover:text-ivory hover:bg-white/[0.04]"
              }`}
            >
              {idx === 0 ? "45° Mesa" : idx === 1 ? "15° Frontal" : "90° Cenital"}
            </button>
          ))}
        </div>
      </div>

      {/* Culinary Narrative & AR Action */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 text-left">
        <div className="space-y-2">
          <div className="text-xs font-mono text-gold-400/90 tracking-widest uppercase">
            {dish.origin || "Creación de Autor • Monroe"}
          </div>

          <h3 
            onClick={() => onSelect(dish)}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory hover:text-gold-300 cursor-pointer transition-colors duration-300 leading-tight"
          >
            {dish.name}
          </h3>

          <p className="text-sm sm:text-base text-gold-300/90 font-medium">
            {dish.subtitle}
          </p>
        </div>

        <p className="text-sm text-platinum/90 font-light leading-relaxed">
          {dish.description}
        </p>

        {/* Sommelier & Chef Note */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
          <div className="flex items-center gap-2 text-xs text-gold-400 font-medium">
            <Wine className="w-4 h-4 text-gold-400" />
            <span>Maridaje Sugerido: <span className="text-ivory">{dish.pairingSuggestion.name}</span></span>
          </div>
          <p className="text-xs text-platinum/70 italic">
            "{dish.chefNotes}"
          </p>
        </div>

        {/* Actions: Direct AR + Add to Table */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {dish.is3dAvailable && (
            <button
              onClick={handleLaunchAR}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all"
            >
              <Box className="w-4 h-4" />
              <span>Proyectar en tu Mesa (AR 1:1)</span>
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-gold-500/30 text-ivory text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Añadir a mi Mesa • {formatPEN(dish.price)}</span>
          </button>
        </div>

        {/* AR Dimension Notice */}
        <div className="flex items-center gap-2 text-[11px] text-platinum/60 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Realidad Aumentada calibrada a escala real (28cm Ø) con anclaje automático sobre mesa plana</span>
        </div>
      </div>

    </div>
  );
}
