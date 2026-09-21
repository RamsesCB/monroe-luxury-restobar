"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCcw,
  Sparkles,
  Smartphone,
  Layers,
  ZoomIn,
  Eye,
  CheckCircle2,
  Maximize2,
  Compass,
} from "lucide-react";
import * as THREE from "three";
import { Dish } from "@/types/menu";
import { formatPEN } from "@/lib/utils";
import { GoldBadge } from "@/components/ui/GoldBadge";

interface DishModelViewerProps {
  dish: Dish;
  onClose: () => void;
  onAddToCart?: () => void;
}

export function DishModelViewer({ dish, onClose, onAddToCart }: DishModelViewerProps) {
  const [viewMode, setViewMode] = useState<"3d_interactive" | "360_turntable" | "ar_guide">("3d_interactive");
  const [lightingPreset, setLightingPreset] = useState<"intimate" | "obsidian" | "josper_fire">("intimate");
  const [isLoading, setIsLoading] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Three.js Interactive Procedural Dish Presentation for zero asset loading penalty
  useEffect(() => {
    if (viewMode !== "3d_interactive" || !canvasRef.current) return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Luxury Dish Plate (Obsidian Black Stoneware)
    const dishGroup = new THREE.Group();

    // Plate Base
    const plateGeo = new THREE.CylinderGeometry(1.3, 1.0, 0.08, 64);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.35,
      metalness: 0.2,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    dishGroup.add(plateMesh);

    // Gold Rim Accent on Plate
    const goldRimGeo = new THREE.TorusGeometry(1.28, 0.015, 16, 64);
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.9,
    });
    const goldRim = new THREE.Mesh(goldRimGeo, goldRimMat);
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.04;
    dishGroup.add(goldRim);

    // Culinary Elements (Procedural artistic representation based on category)
    if (dish.category === "carnes") {
      // Tomahawk / Steak shape with char marks and gold foil
      const meatGeo = new THREE.BoxGeometry(1.1, 0.22, 0.7);
      const meatMat = new THREE.MeshStandardMaterial({
        color: 0x3d1c14,
        roughness: 0.6,
        metalness: 0.1,
      });
      const meatMesh = new THREE.Mesh(meatGeo, meatMat);
      meatMesh.position.y = 0.15;
      dishGroup.add(meatMesh);

      // Gold Leaf Flecks
      for (let i = 0; i < 12; i++) {
        const goldLeafGeo = new THREE.PlaneGeometry(0.06, 0.06);
        const goldLeafMat = new THREE.MeshStandardMaterial({
          color: 0xffdf78,
          roughness: 0.1,
          metalness: 0.95,
          side: THREE.DoubleSide,
        });
        const goldLeaf = new THREE.Mesh(goldLeafGeo, goldLeafMat);
        goldLeaf.position.set(
          (Math.random() - 0.5) * 0.8,
          0.27,
          (Math.random() - 0.5) * 0.5
        );
        goldLeaf.rotation.set(Math.random(), Math.random(), Math.random());
        dishGroup.add(goldLeaf);
      }
    } else if (dish.category === "pastas") {
      // Ravioli / Pasta sculpture
      const pastaGeo = new THREE.TorusKnotGeometry(0.42, 0.14, 64, 16);
      const pastaMat = new THREE.MeshStandardMaterial({
        color: 0xf5df9e,
        roughness: 0.4,
        metalness: 0.05,
      });
      const pastaMesh = new THREE.Mesh(pastaGeo, pastaMat);
      pastaMesh.position.y = 0.28;
      pastaMesh.rotation.x = Math.PI / 2;
      dishGroup.add(pastaMesh);
    } else if (dish.category === "cocteleria") {
      // Cocktail Coupe Glass
      const glassGeo = new THREE.ConeGeometry(0.65, 0.6, 32, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
      });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.rotation.x = Math.PI;
      glassMesh.position.y = 0.6;
      dishGroup.add(glassMesh);

      // Cocktail Stem
      const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16);
      const stemMesh = new THREE.Mesh(stemGeo, glassMat);
      stemMesh.position.y = 0.3;
      dishGroup.add(stemMesh);
    } else {
      // Gourmet Sphere / Dessert
      const sphereGeo = new THREE.SphereGeometry(0.45, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x1f140e,
        roughness: 0.15,
        metalness: 0.3,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.y = 0.35;
      dishGroup.add(sphereMesh);
    }

    scene.add(dishGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfffae6, 2.2);
    mainKeyLight.position.set(3, 4, 3);
    scene.add(mainKeyLight);

    const goldRimLight = new THREE.PointLight(0xd4af37, 3.5, 10);
    goldRimLight.position.set(-3, 2, -2);
    scene.add(goldRimLight);

    // Update lights according to preset
    if (lightingPreset === "josper_fire") {
      goldRimLight.color.setHex(0xff5500);
      mainKeyLight.color.setHex(0xffaa55);
    } else if (lightingPreset === "obsidian") {
      goldRimLight.color.setHex(0x6688ff);
      mainKeyLight.color.setHex(0xd4af37);
    } else {
      goldRimLight.color.setHex(0xd4af37);
      mainKeyLight.color.setHex(0xfffae6);
    }

    setIsLoading(false);

    // Render loop
    const animate = () => {
      dishGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      plateGeo.dispose();
      plateMat.dispose();
      goldRimGeo.dispose();
      goldRimMat.dispose();
    };
  }, [viewMode, lightingPreset, dish.category]);

  // Touch/Mouse turntable handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotationAngle((prev) => (prev + delta * 0.5) % 360);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/90 backdrop-blur-2xl"
      >
        <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] bg-gradient-to-b from-[#16161B] via-[#0E0E11] to-[#0A0A0B] border border-gold-500/30 p-1.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.15)]">
          <div className="relative rounded-[calc(2.5rem-0.375rem)] bg-obsidian-900/90 p-5 sm:p-8 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <GoldBadge size="sm">Visor Tridimensional & AR 1:1</GoldBadge>
                  <span className="text-xs text-gold-400/80 font-mono tracking-wider">
                    {dish.model3d?.realDimensions || "Escala Real en Mesa"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-wide">
                  {dish.name}
                </h2>
                <p className="text-xs sm:text-sm text-platinum mt-0.5">{dish.subtitle}</p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory flex items-center justify-center transition-all"
                aria-label="Cerrar visor 3D"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Mode Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-obsidian-850/80 p-1.5 rounded-2xl border border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode("3d_interactive")}
                  className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all ${
                    viewMode === "3d_interactive"
                      ? "bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-gold-glow"
                      : "text-platinum hover:text-ivory hover:bg-white/[0.04]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-gold-400" />
                  Modelo 3D Interactivo
                </button>

                <button
                  onClick={() => setViewMode("360_turntable")}
                  className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all ${
                    viewMode === "360_turntable"
                      ? "bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-gold-glow"
                      : "text-platinum hover:text-ivory hover:bg-white/[0.04]"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                  Turntable 360° Studio
                </button>

                <button
                  onClick={() => setViewMode("ar_guide")}
                  className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all ${
                    viewMode === "ar_guide"
                      ? "bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-gold-glow"
                      : "text-platinum hover:text-ivory hover:bg-white/[0.04]"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-gold-400" />
                  Proyección en Mesa (AR)
                </button>
              </div>

              {/* Lighting Preset Selector */}
              {viewMode === "3d_interactive" && (
                <div className="flex items-center gap-1.5 px-2 text-[11px] text-platinum">
                  <span className="hidden sm:inline">Luz:</span>
                  <button
                    onClick={() => setLightingPreset("intimate")}
                    className={`px-2 py-1 rounded-lg ${
                      lightingPreset === "intimate" ? "bg-gold-500/20 text-gold-300 font-semibold" : "opacity-60"
                    }`}
                  >
                    Candelita
                  </button>
                  <button
                    onClick={() => setLightingPreset("obsidian")}
                    className={`px-2 py-1 rounded-lg ${
                      lightingPreset === "obsidian" ? "bg-gold-500/20 text-gold-300 font-semibold" : "opacity-60"
                    }`}
                  >
                    Obsidian
                  </button>
                  <button
                    onClick={() => setLightingPreset("josper_fire")}
                    className={`px-2 py-1 rounded-lg ${
                      lightingPreset === "josper_fire" ? "bg-gold-500/20 text-gold-300 font-semibold" : "opacity-60"
                    }`}
                  >
                    Fuego Josper
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Canvas Area */}
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-gradient-to-b from-black/80 via-[#0E0E12] to-black/90 border border-white/[0.08] overflow-hidden flex items-center justify-center">
              
              {/* Background Glow */}
              <div className="absolute inset-0 bg-glass-radial opacity-60 pointer-events-none" />

              {/* Mode 1: Three.js Realtime 3D Canvas */}
              {viewMode === "3d_interactive" && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="bg-obsidian-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-platinum flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: "12s" }} />
                      <span>Rotación continua activa • Render WebGL 60 FPS</span>
                    </div>

                    <div className="bg-obsidian-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/30 text-[11px] text-gold-300 font-medium">
                      {dish.tags[0]}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: 360 Turntable Studio with Drag Rotation */}
              {viewMode === "360_turntable" && (
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative w-full h-full select-none cursor-ew-resize flex items-center justify-center"
                >
                  <div
                    className="relative w-72 h-72 sm:w-80 sm:h-80 transition-transform duration-75"
                    style={{ transform: `rotateY(${rotationAngle}deg)` }}
                  >
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.2)] border-2 border-gold-500/40"
                    />
                  </div>

                  <div className="absolute top-4 left-4 bg-obsidian-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-platinum">
                    Arrastra horizontalmente para girar 360°
                  </div>
                </div>
              )}

              {/* Mode 3: Augmented Reality Table Projection Guide */}
              {viewMode === "ar_guide" && (
                <div className="relative w-full h-full p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center mb-4 shadow-gold-glow">
                    <Smartphone className="w-8 h-8 text-gold-300 animate-bounce" />
                  </div>

                  <h3 className="text-xl font-serif font-bold text-ivory mb-2">
                    Proyecta este plato en tu mesa 1:1
                  </h3>
                  <p className="text-xs text-platinum leading-relaxed mb-6">
                    Apunta la cámara de tu smartphone hacia una superficie horizontal plana (tu mesa en Monroe). El plato aparecerá en escala milimétrica real.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    {/* iOS Quick Look Button */}
                    <a
                      href={dish.model3d?.usdzUrl || "#"}
                      rel="ar"
                      className="w-full sm:w-1/2 py-3 px-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] transition-transform"
                    >
                      <Sparkles className="w-4 h-4" />
                      iOS Quick Look
                    </a>

                    {/* Android Scene Viewer / WebXR Button */}
                    <button
                      onClick={() => {
                        const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
                          dish.model3d?.glbUrl || dish.image
                        )}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
                        window.location.href = sceneViewerUrl;
                      }}
                      className="w-full sm:w-1/2 py-3 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-ivory text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
                    >
                      <Eye className="w-4 h-4 text-gold-400" />
                      Android Scene Viewer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dish Specs & Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/[0.08]">
              <div>
                <div className="text-xs text-platinum">Precio de Autor</div>
                <div className="text-2xl font-bold font-serif text-gold-300">
                  {formatPEN(dish.price)}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-platinum hover:text-ivory bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
                >
                  Volver a la Carta
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
