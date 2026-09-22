"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
  Maximize2,
  Compass,
  Camera,
  RotateCcw,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import { Dish } from "@/types/menu";
import { formatPEN } from "@/lib/utils";
import { GoldBadge } from "@/components/ui/GoldBadge";

interface DishModelViewerProps {
  dish: Dish;
  onClose: () => void;
  onAddToCart?: () => void;
}

export function DishModelViewer({ dish, onClose, onAddToCart }: DishModelViewerProps) {
  const [isArSupported, setIsArSupported] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelViewerRef = useRef<any>(null);

  const glbUrl = dish.model3d?.glbUrl || "/models3d/sample.glb";
  const usdzUrl = dish.model3d?.usdzUrl || "/models3d/sample.usdz";
  const plateScale = dish.model3d?.scale || "0.28 0.28 0.28";

  // Trigger native AR when user requests
  const handleLaunchAR = () => {
    if (modelViewerRef.current) {
      if (typeof modelViewerRef.current.activateAR === "function") {
        modelViewerRef.current.activateAR();
      }
    }
  };

  const handleToggleFullscreen = () => {
    const container = document.getElementById("model-viewer-container");
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/95 backdrop-blur-2xl"
      >
        <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-[#18181D] via-[#101013] to-[#0A0A0B] border border-gold-500/30 p-1.5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_45px_rgba(212,175,55,0.2)]">
          <div className="relative rounded-[calc(2.5rem-0.375rem)] bg-obsidian-900/95 p-4 sm:p-8 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <GoldBadge size="sm">Realidad Aumentada • Escala 1:1 en Mesa</GoldBadge>
                  <span className="text-xs text-gold-400 font-mono tracking-wider bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-gold-500/20">
                    {dish.model3d?.realDimensions || "28cm Ø • Plato Real"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-wide">
                  {dish.name}
                </h2>
                <p className="text-xs sm:text-sm text-platinum/80 mt-0.5">{dish.subtitle}</p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory flex items-center justify-center transition-all shrink-0"
                aria-label="Cerrar visor 3D"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Model Viewer WebAR Stage */}
            <div 
              id="model-viewer-container"
              className="relative w-full h-[380px] sm:h-[460px] rounded-2xl bg-gradient-to-b from-black/80 via-[#0B0B0E] to-black/90 border border-white/[0.08] overflow-hidden flex items-center justify-center"
            >
              {/* Subtle Radial Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-gold-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* WebAR Engine */}
              <model-viewer
                ref={modelViewerRef}
                src={glbUrl}
                ios-src={usdzUrl}
                poster={dish.image}
                alt={dish.name}
                scale={plateScale}
                ar={true}
                ar-modes="scene-viewer webxr quick-look"
                ar-placement="floor"
                ar-scale="fixed"
                camera-controls={true}
                auto-rotate={true}
                shadow-intensity="1.5"
                shadow-softness="0.8"
                exposure="1.1"
                environment-image="neutral"
                loading="lazy"
                reveal="auto"
                style={{ width: "100%", height: "100%", background: "transparent" }}
                onLoad={() => setModelLoaded(true)}
              >
                {/* Custom AR Button in model-viewer slot */}
                <button
                  slot="ar-button"
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all z-20 whitespace-nowrap"
                >
                  <Camera className="w-4 h-4" />
                  <span>Ver en mi Mesa (Cámara AR)</span>
                </button>

                {/* Prompt Overlay */}
                <div 
                  slot="ar-prompt"
                  className="absolute top-4 left-1/2 -translate-x-1/2 bg-obsidian-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/30 text-xs text-gold-300 font-medium flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
                  <span>Apunta tu cámara a la mesa y muévela suavemente para colocar el plato</span>
                </div>
              </model-viewer>

              {/* Controls Toolbar */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={handleToggleFullscreen}
                  className="p-2.5 rounded-full bg-obsidian-950/80 hover:bg-gold-500/20 backdrop-blur-md border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory transition-all shadow-lg"
                  title="Pantalla Completa"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Instructions HUD */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <div className="bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] text-platinum/90 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: "12s" }} />
                  <span className="hidden sm:inline">Arrastra con 1 dedo para rotar • Pellizca para zoom</span>
                  <span className="sm:hidden">Gira 360° con 1 dedo</span>
                </div>

                <div className="bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-500/30 text-[11px] text-gold-300 font-mono font-medium">
                  {formatPEN(dish.price)}
                </div>
              </div>
            </div>

            {/* Quick Plane Tracking Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-[11px] text-platinum/80 leading-snug">
                  1. Pulsa <strong className="text-ivory">Ver en mi Mesa</strong> y abre la cámara.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-[11px] text-platinum/80 leading-snug">
                  2. Apunta a tu mesa plana. Se anclará <strong className="text-ivory">automáticamente</strong>.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-[11px] text-platinum/80 leading-snug">
                  3. Aprecia el plato en <strong className="text-ivory">escala real 1:1</strong> (28cm Ø).
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
              <div>
                <div className="text-xs text-platinum/70">Precio Monroe</div>
                <div className="text-2xl font-bold font-serif text-gold-300">
                  {formatPEN(dish.price)}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-platinum hover:text-ivory bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
                >
                  Cerrar
                </button>

                {onAddToCart && (
                  <button
                    onClick={() => {
                      onAddToCart();
                      onClose();
                    }}
                    className="w-1/2 sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Añadir a mi Mesa
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
