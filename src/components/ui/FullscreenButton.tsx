"use client";

import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useFullscreen } from "@/hooks/useFullscreen";
import { cn } from "@/lib/utils";

export function FullscreenButton({ className }: { className?: string }) {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleFullscreen}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide",
        "bg-white/[0.04] hover:bg-gold-500/15 border border-white/10 hover:border-gold-500/40",
        "text-platinum hover:text-gold-300 backdrop-blur-md transition-all duration-300",
        className
      )}
      title={isFullscreen ? "Salir de pantalla completa" : "Modo App / Pantalla completa"}
      aria-label="Toggle Fullscreen"
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden sm:inline">Salir de Inmersión</span>
        </>
      ) : (
        <>
          <Maximize2 className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden sm:inline">Modo Inmersivo QR</span>
        </>
      )}
    </button>
  );
}
