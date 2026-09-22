"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Bell, Check, Box, ChevronLeft, ChevronRight } from "lucide-react";
import { Dish } from "@/types/menu";
import { formatPEN } from "@/lib/utils";
import { useOrderStore } from "@/hooks/useOrderStore";
import { DishModelViewer } from "@/components/3d/DishModelViewer";

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { addItem, setDrawerOpen } = useOrderStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const [is3DOpen, setIs3DOpen] = useState(false);

  // Slides: 0 = 360 Video, 1 = 45° angle, 2 = 15° detail, 3 = 90° top
  const slides = [
    { type: "video", src: dish.video || "/videos/fettuccine_rotating.mp4", label: "Video 360°" },
    { type: "image", src: "/dishes/garganelli/Vista45Grados.jpg", label: "Vista 45°" },
    { type: "image", src: "/dishes/garganelli/Vista0-15Grados.jpg", label: "Vista 15°" },
    { type: "image", src: "/dishes/garganelli/Vista90Grados.jpg", label: "Vista 90°" },
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center px-4 sm:px-6 py-2">
      
      {/* Visual Stage: Swipeable Carousel with Uncropped Contain Viewport */}
      <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] flex items-center justify-center my-2 select-none">
        
        {/* Soft Radial Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-gold-500/15 via-transparent to-transparent opacity-80 blur-2xl pointer-events-none" />

        {/* Circular 3D Floating Action Button */}
        <button
          onClick={() => setIs3DOpen(true)}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-10 h-10 rounded-full bg-obsidian-950/90 hover:bg-gold-500/20 backdrop-blur-md border border-gold-500/40 hover:border-gold-500 text-gold-300 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all"
          title="Ver en 3D Interactivo"
          aria-label="Abrir visor 3D"
        >
          <Box className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-[8px] font-bold tracking-wider text-gold-300 -mt-0.5">3D</span>
        </button>

        {/* Carousel Arrow Left */}
        {activeSlide > 0 && (
          <button
            onClick={handlePrevSlide}
            className="absolute left-1 z-20 p-2 rounded-full bg-obsidian-950/60 hover:bg-obsidian-950/90 text-platinum hover:text-ivory backdrop-blur-md border border-white/10 transition-all opacity-80 hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Carousel Arrow Right */}
        {activeSlide < slides.length - 1 && (
          <button
            onClick={handleNextSlide}
            className="absolute right-1 z-20 p-2 rounded-full bg-obsidian-950/60 hover:bg-obsidian-950/90 text-platinum hover:text-ivory backdrop-blur-md border border-white/10 transition-all opacity-80 hover:opacity-100"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Swipeable Media Container with Framer Motion Drag */}
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -40 && activeSlide < slides.length - 1) {
              handleNextSlide();
            } else if (info.offset.x > 40 && activeSlide > 0) {
              handlePrevSlide();
            }
          }}
          className="relative w-full h-full p-3 sm:p-5 flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {slides[activeSlide].type === "video" ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              poster="/dishes/garganelli/Vista45Grados.jpg"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
            >
              {dish.videoWebm && <source src={dish.videoWebm} type="video/webm" />}
              <source src={dish.video || "/videos/fettuccine_rotating.mp4"} type="video/mp4" />
            </video>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={slides[activeSlide].src}
                alt={dish.name}
                fill
                sizes="(max-width: 640px) 340px, 400px"
                priority
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Slide Dot Indicators */}
      <div className="flex items-center gap-1.5 my-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSlide === idx
                ? "w-6 bg-gold-400"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Ir a slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Typography & Details: Minimalist, High Impact */}
      <div className="space-y-2.5 mt-3 max-w-md">
        
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
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mt-7">
        
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

      {/* 3D Model Modal */}
      {is3DOpen && (
        <DishModelViewer
          dish={dish}
          onClose={() => setIs3DOpen(false)}
          onAddToCart={() => {
            addItem(dish, 1);
            setDrawerOpen(true);
            setIs3DOpen(false);
          }}
        />
      )}

    </div>
  );
}
