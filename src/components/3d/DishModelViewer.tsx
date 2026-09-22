"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Play,
  Pause,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Compass,
  AlertCircle,
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
  const [isLoading, setIsLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isArActive, setIsArActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modelViewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure model-viewer custom element is loaded safely
  useEffect(() => {
    if (typeof window !== "undefined" && customElements.get("model-viewer")) {
      setIsLoading(false);
      return;
    }
    const existingScript = document.querySelector('script[src*="model-viewer"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
      script.onload = () => setIsLoading(false);
      document.head.appendChild(script);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Configure model-viewer events and AR listeners
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleArStatus = (event: any) => {
      const status = event.detail?.status;
      if (status === "session-started") {
        setIsArActive(true);
      } else if (status === "not-presenting" || status === "failed") {
        setIsArActive(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    const handleError = (error: any) => {
      console.warn("Model viewer event error:", error);
      setIsLoading(false);
    };

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("ar-status", handleArStatus);
    viewer.addEventListener("error", handleError);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("ar-status", handleArStatus);
      viewer.removeEventListener("error", handleError);
    };
  }, []);

  // System prerequisites check
  const checkSystemPrerequisites = async () => {
    if (typeof window === "undefined") return;
    if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
      throw new Error("SECURE_CONTEXT_REQUIRED");
    }
  };

  // Camera permissions check
  const requestCameraPermissions = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return true; // Let native QuickLook / SceneViewer handle it
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        throw new Error("PERMISSION_DENIED");
      }
      return true;
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    const elem = containerRef.current || document.documentElement;
    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle:", err);
    }
  };

  // Launch AR Experience
  const handleLaunchAR = async () => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    setStatusMessage("Preparando visor de realidad aumentada...");

    try {
      await checkSystemPrerequisites();
      await requestCameraPermissions();

      if (viewer.activateAR) {
        viewer.setAttribute("ar-placement", "floor");
        viewer.setAttribute("ar-scale", "fixed");
        await viewer.activateAR();
        setStatusMessage(null);
      } else {
        setStatusMessage("Tu dispositivo proyectará el modelo en pantalla completa.");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      const errorMap: Record<string, string> = {
        PERMISSION_DENIED: "Acceso a la cámara denegado. Puedes interactuar en 3D a continuación.",
        SECURE_CONTEXT_REQUIRED: "La Realidad Aumentada requiere conexión cifrada HTTPS.",
      };
      setStatusMessage(errorMap[err.message] || "Iniciando modo de inspección 3D.");
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const glbPath = dish.model3d?.glbUrl || "/models3d/plato_monroe.glb";
  const usdzPath = dish.model3d?.usdzUrl || "/models3d/plato_monroe.usdz";
  const posterPath = dish.model3d?.posterImage || "/dishes/garganelli/fettuccine_cenital_90grados_transparente.png";

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-6 bg-obsidian-950/98 backdrop-blur-3xl overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-64 bg-radial-gradient from-gold-500/15 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between z-20 pb-2 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GoldBadge size="sm">Realidad Aumentada • AR</GoldBadge>
              <span className="text-[11px] text-gold-400 font-mono tracking-wider">
                {dish.model3d?.realDimensions || "28cm Ø • Escala Real"}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-serif font-bold text-ivory line-clamp-1">
              {dish.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-full bg-white/[0.06] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory transition-all"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              aria-label="Toggle pantalla completa"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/[0.06] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory transition-all"
              aria-label="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D WebAR Stage Container */}
        <div className="relative w-full max-w-4xl flex-1 min-h-[350px] my-3 rounded-3xl bg-gradient-to-b from-[#141418]/90 via-[#0D0D10]/95 to-[#08080A]/98 border border-gold-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.12)] overflow-hidden flex items-center justify-center">
          
          {/* Subtle Stage Lighting Ring */}
          <div className="absolute inset-0 bg-radial-gradient from-gold-500/10 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Model Viewer Web Component */}
          <model-viewer
            ref={modelViewerRef}
            src={glbPath}
            ios-src={usdzPath}
            poster={posterPath}
            alt={`${dish.name} en 3D / Realidad Aumentada`}
            ar
            ar-modes="scene-viewer quick-look webxr"
            ar-placement="floor"
            ar-scale="fixed"
            camera-controls
            touch-action="pan-y"
            auto-rotate={autoRotate}
            shadow-intensity="1"
            shadow-softness="0.8"
            exposure="1.05"
            camera-orbit="0deg 50deg 0.75m"
            min-camera-orbit="auto auto 0.35m"
            max-camera-orbit="auto auto 1.4m"
            field-of-view="35deg"
            loading="lazy"
            power-preference="high-performance"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              outline: "none",
            }}
          >
            {/* Custom AR Button Slot */}
            <button
              slot="ar-button"
              onClick={handleLaunchAR}
              className="absolute top-4 left-4 z-20 py-2.5 px-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver en tu mesa (AR)</span>
            </button>
          </model-viewer>

          {/* Top-Right Stage Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2.5 rounded-full backdrop-blur-md border text-xs flex items-center justify-center transition-all ${
                autoRotate
                  ? "bg-gold-500/20 border-gold-500/50 text-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                  : "bg-obsidian-950/80 border-white/10 text-platinum"
              }`}
              title={autoRotate ? "Pausar rotación" : "Activar rotación"}
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Status Message Toast */}
          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 inset-x-6 max-w-sm mx-auto z-30 p-3 rounded-2xl bg-obsidian-950/95 border border-gold-500/40 text-gold-200 text-xs text-center shadow-2xl backdrop-blur-xl flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{statusMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian-950/80 backdrop-blur-md pointer-events-none z-30">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin mb-3" />
              <span className="text-xs text-gold-300 font-medium tracking-widest uppercase">
                Calibrando Escala Real (28cm Ø)...
              </span>
            </div>
          )}

          {/* Stage Bottom HUD */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none text-[10px] sm:text-xs text-platinum/90 z-20">
            <div className="bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: "14s" }} />
              <span>Gira 360° con 1 dedo • Pellizca para zoom</span>
            </div>

            <div className="bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-500/40 text-gold-300 font-bold shadow-lg">
              {formatPEN(dish.price)}
            </div>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 z-20">
          
          {/* AR Direct Launcher */}
          <button
            onClick={handleLaunchAR}
            className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Proyectar en tu Mesa (AR)</span>
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-full text-xs font-semibold text-platinum hover:text-ivory bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
            >
              Volver
            </button>

            {onAddToCart && (
              <button
                onClick={() => {
                  onAddToCart();
                  onClose();
                }}
                className="py-3 px-6 rounded-full bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 text-gold-300 hover:text-gold-200 text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pedir este plato</span>
              </button>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
