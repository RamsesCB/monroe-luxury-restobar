"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Wine,
  Clock,
  MapPin,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  Box,
  Share2,
  Flame,
} from "lucide-react";
import { Dish } from "@/types/menu";
import { formatPEN } from "@/lib/utils";
import { GoldBadge } from "@/components/ui/GoldBadge";
import { useOrderStore } from "@/hooks/useOrderStore";

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onOpen3d: (dish: Dish) => void;
}

export function DishDetailModal({ dish, onClose, onOpen3d }: DishDetailModalProps) {
  const { addItem, setDrawerOpen } = useOrderStore();
  const [quantity, setQuantity] = useState(1);
  const [includePairing, setIncludePairing] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!dish) return null;

  const images = dish.galleryImages || [dish.image];

  const handleAddToCart = () => {
    addItem(dish, quantity, specialInstructions, includePairing);
    setDrawerOpen(true);
    onClose();
  };

  const unitTotal = dish.price + (includePairing && dish.pairingSuggestion.price ? dish.pairingSuggestion.price : 0);
  const totalAmount = unitTotal * quantity;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/90 backdrop-blur-2xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-[2.5rem] bg-gradient-to-b from-[#18181D] via-[#111115] to-[#0A0A0B] border border-gold-500/30 p-1.5 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.15)] my-auto"
        >
          <div className="relative rounded-[calc(2.5rem-0.375rem)] bg-obsidian-900/95 p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-obsidian-950/80 hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory flex items-center justify-center backdrop-blur-md transition-all"
              aria-label="Cerrar detalle"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Image Gallery & 3D */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden bg-obsidian-950 border border-white/10 shadow-2xl">
                  {dish.video && activeImageIndex === 0 ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      poster={dish.image}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    >
                      {dish.videoWebm && <source src={dish.videoWebm} type="video/webm" />}
                      <source src={dish.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={images[activeImageIndex] || dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* 3D Action Overlay */}
                  {dish.is3dAvailable && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpen3d(dish);
                      }}
                      className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold-glow hover:scale-105 active:scale-95 transition-all"
                    >
                      <Box className="w-4 h-4 animate-spin" style={{ animationDuration: "8s" }} />
                      Ver en 3D / Realidad Aumentada
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden border transition-all ${
                          activeImageIndex === i
                            ? "border-gold-500 shadow-gold-glow scale-105"
                            : "border-white/10 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Flavor Profile Radar */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-2.5">
                  <div className="text-xs font-semibold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Perfil Sensorial & Notas de Sabor
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    {dish.flavorProfile.umami && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-platinum">
                          <span>Umami</span>
                          <span className="text-gold-400">{dish.flavorProfile.umami}/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-500 rounded-full"
                            style={{ width: `${(dish.flavorProfile.umami / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {dish.flavorProfile.intensidad && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-platinum">
                          <span>Intensidad</span>
                          <span className="text-gold-400">{dish.flavorProfile.intensidad}/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-400 rounded-full"
                            style={{ width: `${(dish.flavorProfile.intensidad / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {dish.flavorProfile.ahumado && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-platinum">
                          <span>Ahumado Josper</span>
                          <span className="text-gold-400">{dish.flavorProfile.ahumado}/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400 rounded-full"
                            style={{ width: `${(dish.flavorProfile.ahumado / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {dish.flavorProfile.frescura && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-platinum">
                          <span>Frescura Marina</span>
                          <span className="text-gold-400">{dish.flavorProfile.frescura}/5</span>
                        </div>
                        <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${(dish.flavorProfile.frescura / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Culinary Details & Order Controls */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Header Info */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {dish.tags.map((t, idx) => (
                      <GoldBadge key={idx} size="sm">
                        {t}
                      </GoldBadge>
                    ))}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-wide">
                    {dish.name}
                  </h2>
                  <p className="text-sm text-gold-400 font-medium mt-1">{dish.subtitle}</p>

                  <div className="text-3xl font-serif font-bold text-gold-300 mt-3">
                    {formatPEN(dish.price)}
                  </div>
                </div>

                {/* Story / Description */}
                <div className="space-y-2 text-xs sm:text-sm text-platinum leading-relaxed border-t border-white/[0.08] pt-4 font-light">
                  <p>{dish.longStory || dish.description}</p>
                </div>

                {/* Chef Notes Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/[0.08] to-transparent border-l-2 border-gold-500 border-y border-r border-white/[0.05] space-y-1">
                  <div className="text-xs font-semibold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    Notas del Chef Ejecutivo
                  </div>
                  <p className="text-xs text-ivory/90 italic font-serif leading-relaxed">
                    &ldquo;{dish.chefNotes}&rdquo;
                  </p>
                </div>

                {/* Suggested Pairing Card */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ivory">
                      <Wine className="w-4 h-4 text-gold-400" />
                      <span>Maridaje Sugerido por Sommelier</span>
                    </div>

                    {dish.pairingSuggestion.price && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePairing}
                          onChange={(e) => setIncludePairing(e.target.checked)}
                          className="rounded border-gold-500 text-gold-500 focus:ring-gold-500 bg-obsidian-950 accent-gold-500 w-4 h-4"
                        />
                        <span className="text-xs text-gold-300 font-semibold">
                          + {formatPEN(dish.pairingSuggestion.price)}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="text-xs font-medium text-gold-400">
                    {dish.pairingSuggestion.name}
                  </div>
                  <p className="text-[11px] text-platinum leading-relaxed font-light">
                    {dish.pairingSuggestion.notes}
                  </p>
                </div>

                {/* Allergens & Origin */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-platinum/80 pt-1">
                  {dish.preparationTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{dish.preparationTime}</span>
                    </div>
                  )}

                  {dish.origin && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" />
                      <span>{dish.origin}</span>
                    </div>
                  )}

                  {dish.allergens && dish.allergens.length > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-300/90">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Alérgenos: {dish.allergens.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Special Instructions Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-platinum font-medium">
                    Instrucciones Especiales para Cocina (Término, Sin Sal, etc.):
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Ej. Término medio exacto, salsa aparte..."
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 focus:border-gold-500/60 text-xs text-ivory placeholder:text-platinum/40 focus:outline-none transition-all"
                  />
                </div>

                {/* Order Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 bg-obsidian-950 p-1.5 rounded-full border border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-gold-500/20 text-platinum hover:text-ivory flex items-center justify-center transition-all"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-6 text-center text-sm font-bold text-ivory font-mono">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-gold-500/20 text-platinum hover:text-ivory flex items-center justify-center transition-all"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Table Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Añadir a mi Mesa • {formatPEN(totalAmount)}</span>
                  </button>

                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
