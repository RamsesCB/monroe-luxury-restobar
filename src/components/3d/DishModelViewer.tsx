"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCcw,
  Sparkles,
  Compass,
  Play,
  Pause,
  CheckCircle2,
  Maximize2,
  Box,
} from "lucide-react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Contact shadow
    const shadowGeo = new THREE.CircleGeometry(1.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    scene.add(shadowMesh);

    // Group for model
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffae6, 2.6);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const goldRimLight = new THREE.PointLight(0xd4af37, 3.5, 10);
    goldRimLight.position.set(-3, 2, -2);
    scene.add(goldRimLight);

    // Load glTF
    const glbUrl = dish.model3d?.glbUrl || "/models3d/sample.glb";
    const loader = new GLTFLoader();
    loader.load(
      glbUrl,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 1.7 / (maxDim || 1);

        model.scale.setScalar(scaleFactor);
        model.position.x = -center.x * scaleFactor;
        model.position.y = -box.min.y * scaleFactor;
        model.position.z = -center.z * scaleFactor;

        rootGroup.clear();
        rootGroup.add(model);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.warn("GLTF fallback:", err);
        setIsLoading(false);
      }
    );

    // Drag rotation controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevX = "touches" in e ? e.touches[0].clientX : e.clientX;
      prevY = "touches" in e ? e.touches[0].clientY : e.clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !rootGroup) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      rootGroup.rotation.y += deltaX * 0.009;
      rootGroup.rotation.x = Math.max(-0.4, Math.min(0.6, rootGroup.rotation.x + deltaY * 0.007));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    const animate = () => {
      if (autoRotate && !isDragging && rootGroup) {
        rootGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      renderer.dispose();
    };
  }, [autoRotate, dish]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/95 backdrop-blur-2xl"
      >
        <div className="relative w-full max-w-2xl max-h-[90vh] rounded-[2rem] bg-gradient-to-b from-[#18181D] via-[#101013] to-[#0A0A0B] border border-gold-500/30 p-1.5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_45px_rgba(212,175,55,0.2)]">
          <div className="relative rounded-[calc(2rem-0.375rem)] bg-obsidian-900/95 p-5 sm:p-7 flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <GoldBadge size="sm">Visor 3D Interactivo</GoldBadge>
                  <span className="text-[11px] text-gold-400 font-mono tracking-wider">
                    {dish.model3d?.realDimensions || "28cm Ø • Escala Real"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-ivory">
                  {dish.name}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory flex items-center justify-center transition-all shrink-0"
                aria-label="Cerrar visor 3D"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D Canvas Stage */}
            <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl bg-gradient-to-b from-black/80 via-[#0B0B0E] to-black/95 border border-white/[0.08] overflow-hidden flex items-center justify-center">
              
              <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

              {/* Loading Indicator */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian-950/70 backdrop-blur-sm pointer-events-none">
                  <div className="w-10 h-10 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin mb-2" />
                  <span className="text-[11px] text-gold-300 font-medium tracking-wider uppercase">
                    Cargando Geometría 3D...
                  </span>
                </div>
              )}

              {/* Controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-full backdrop-blur-md border text-xs flex items-center transition-all ${
                    autoRotate
                      ? "bg-gold-500/20 border-gold-500/40 text-gold-300"
                      : "bg-obsidian-950/80 border-white/10 text-platinum"
                  }`}
                  title={autoRotate ? "Pausar giro" : "Activar giro"}
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* HUD */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none text-[10px] text-platinum/80">
                <div className="bg-obsidian-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-gold-400 animate-spin" style={{ animationDuration: "12s" }} />
                  <span>Arrastra con 1 dedo para girar 360°</span>
                </div>
                <div className="bg-obsidian-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/30 text-gold-300 font-bold">
                  {formatPEN(dish.price)}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-platinum hover:text-ivory bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
              >
                Volver
              </button>

              {onAddToCart && (
                <button
                  onClick={() => {
                    onAddToCart();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pedir este plato</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
