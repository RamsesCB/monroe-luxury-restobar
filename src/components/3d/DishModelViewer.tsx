"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCcw,
  Sparkles,
  Smartphone,
  Layers,
  ZoomIn,
  ZoomOut,
  Eye,
  CheckCircle2,
  Maximize2,
  Compass,
  Camera,
  RefreshCw,
  Sliders,
  Sun,
  Flame,
  Moon,
  Play,
  Pause,
  Download,
  Share2,
  AlertCircle,
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

type ViewMode = "3d_interactive" | "live_ar_camera" | "360_turntable" | "native_ar";
type LightingPreset = "intimate" | "obsidian" | "josper_fire";

export function DishModelViewer({ dish, onClose, onAddToCart }: DishModelViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("3d_interactive");
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>("intimate");
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [modelScale, setModelScale] = useState(1.0);
  const [turntableAngle, setTurntableAngle] = useState(0);
  const [isDraggingTurntable, setIsDraggingTurntable] = useState(false);
  const [turntableStartX, setTurntableStartX] = useState(0);

  // AR Camera States
  const [cameraPermission, setCameraPermission] = useState<"idle" | "granted" | "denied" | "unsupported">("idle");
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [arStatusMessage, setArStatusMessage] = useState("Apunta tu cámara a una mesa plana");
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  // References
  const interactiveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const arCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Model & Scene refs for interactive 3D
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const mainKeyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const goldRimLightRef = useRef<THREE.PointLight | null>(null);

  // AR Model & Scene refs
  const arSceneRef = useRef<THREE.Scene | null>(null);
  const arModelGroupRef = useRef<THREE.Group | null>(null);
  const arModelPosRef = useRef<{ x: number; y: number; rotY: number }>({ x: 0, y: -0.2, rotY: 0 });

  // --------------------------------------------------------------------------
  // Helper: Create Fallback Procedural Dish Mesh
  // --------------------------------------------------------------------------
  const createProceduralDishMesh = useCallback((category: string) => {
    const dishGroup = new THREE.Group();

    // Plate Base (Obsidian Stoneware)
    const plateGeo = new THREE.CylinderGeometry(1.3, 1.0, 0.08, 64);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.35,
      metalness: 0.2,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    dishGroup.add(plateMesh);

    // Gold Rim Accent
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

    if (category === "carnes") {
      const meatGeo = new THREE.BoxGeometry(1.1, 0.22, 0.7);
      const meatMat = new THREE.MeshStandardMaterial({
        color: 0x3d1c14,
        roughness: 0.6,
        metalness: 0.1,
      });
      const meatMesh = new THREE.Mesh(meatGeo, meatMat);
      meatMesh.position.y = 0.15;
      dishGroup.add(meatMesh);

      for (let i = 0; i < 12; i++) {
        const goldLeafGeo = new THREE.PlaneGeometry(0.06, 0.06);
        const goldLeafMat = new THREE.MeshStandardMaterial({
          color: 0xffdf78,
          roughness: 0.1,
          metalness: 0.95,
          side: THREE.DoubleSide,
        });
        const goldLeaf = new THREE.Mesh(goldLeafGeo, goldLeafMat);
        goldLeaf.position.set((Math.random() - 0.5) * 0.8, 0.27, (Math.random() - 0.5) * 0.5);
        goldLeaf.rotation.set(Math.random(), Math.random(), Math.random());
        dishGroup.add(goldLeaf);
      }
    } else if (category === "pastas") {
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
    } else if (category === "cocteleria") {
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

      const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 16);
      const stemMesh = new THREE.Mesh(stemGeo, glassMat);
      stemMesh.position.y = 0.3;
      dishGroup.add(stemMesh);
    } else {
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

    return dishGroup;
  }, []);

  // --------------------------------------------------------------------------
  // 1. Interactive 3D Viewport Setup (GLTF / Three.js)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (viewMode !== "3d_interactive" || !interactiveCanvasRef.current) return;

    let animationFrameId: number;
    const canvas = interactiveCanvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 3.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Ambient Pedestal Shadow
    const shadowGeo = new THREE.CircleGeometry(1.6, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    scene.add(shadowMesh);

    // Root model group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    modelGroupRef.current = rootGroup;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffae6, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);
    mainKeyLightRef.current = keyLight;

    const rimLight = new THREE.PointLight(0xd4af37, 3.8, 10);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);
    goldRimLightRef.current = rimLight;

    // Load glTF Model if available or fallback
    const glbTargetUrl = dish.model3d?.glbUrl || "/models3d/sample.glb";
    setIsLoadingModel(true);

    const loader = new GLTFLoader();
    loader.load(
      glbTargetUrl,
      (gltf) => {
        const loadedModel = gltf.scene;

        // Auto-center & compute bounding box
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 1.8 / (maxDim || 1);

        loadedModel.scale.setScalar(scaleFactor);
        loadedModel.position.x = -center.x * scaleFactor;
        loadedModel.position.y = -box.min.y * scaleFactor;
        loadedModel.position.z = -center.z * scaleFactor;

        // Traverse to enable shadow / metalness adjustments
        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        rootGroup.clear();
        rootGroup.add(loadedModel);
        setIsLoadingModel(false);
      },
      undefined,
      (error) => {
        console.warn("GLTF Load error, falling back to procedural mesh:", error);
        rootGroup.clear();
        rootGroup.add(createProceduralDishMesh(dish.category));
        setIsLoadingModel(false);
      }
    );

    // Mouse Drag Controls for Orbit
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isMouseDown = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown || !rootGroup) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x = Math.max(-0.4, Math.min(0.6, rootGroup.rotation.x + deltaY * 0.006));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isMouseDown = false;
    };

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("touchstart", onPointerDown);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);

    // Animation Loop
    const animate = () => {
      if (autoRotate && !isMouseDown && rootGroup) {
        rootGroup.rotation.y += 0.004;
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
  }, [viewMode, autoRotate, dish, createProceduralDishMesh]);

  // Lighting Preset Switcher
  useEffect(() => {
    if (!mainKeyLightRef.current || !goldRimLightRef.current) return;
    if (lightingPreset === "josper_fire") {
      goldRimLightRef.current.color.setHex(0xff4400);
      mainKeyLightRef.current.color.setHex(0xff9944);
    } else if (lightingPreset === "obsidian") {
      goldRimLightRef.current.color.setHex(0x5588ff);
      mainKeyLightRef.current.color.setHex(0xd4af37);
    } else {
      goldRimLightRef.current.color.setHex(0xd4af37);
      mainKeyLightRef.current.color.setHex(0xfffae6);
    }
  }, [lightingPreset]);

  // --------------------------------------------------------------------------
  // 2. Live AR Camera Stream & Three.js Overlay Setup
  // --------------------------------------------------------------------------
  const startCameraStream = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission("unsupported");
        return;
      }

      // Stop existing stream if any
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: cameraFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraPermission("granted");
      setArStatusMessage("¡Mesa detectada! Toca y arrastra para ubicar tu plato");
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraPermission("denied");
    }
  }, [cameraFacing]);

  useEffect(() => {
    if (viewMode === "live_ar_camera") {
      startCameraStream();
    } else {
      // Clean up camera stream when leaving AR mode
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [viewMode, startCameraStream]);

  // AR Overlay Three.js Scene Setup
  useEffect(() => {
    if (viewMode !== "live_ar_camera" || !arCanvasRef.current) return;

    let animationFrameId: number;
    const canvas = arCanvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 450;

    const scene = new THREE.Scene();
    arSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 2.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // AR Ambient Golden Reticle / Table Grid Ring
    const reticleGeo = new THREE.RingGeometry(0.9, 0.94, 64);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.rotation.x = -Math.PI / 2;
    reticleMesh.position.y = -0.22;
    scene.add(reticleMesh);

    // Realistic Contact Shadow for Table Plane
    const tableShadowGeo = new THREE.CircleGeometry(1.2, 32);
    const tableShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
    });
    const tableShadow = new THREE.Mesh(tableShadowGeo, tableShadowMat);
    tableShadow.rotation.x = -Math.PI / 2;
    tableShadow.position.y = -0.21;
    scene.add(tableShadow);

    const arGroup = new THREE.Group();
    arGroup.position.set(arModelPosRef.current.x, arModelPosRef.current.y, 0);
    scene.add(arGroup);
    arModelGroupRef.current = arGroup;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffae6, 2.4);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Load 3D Model into AR scene
    const glbTargetUrl = dish.model3d?.glbUrl || "/models3d/sample.glb";
    const loader = new GLTFLoader();
    loader.load(
      glbTargetUrl,
      (gltf) => {
        const loadedModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 1.4 / (maxDim || 1);

        loadedModel.scale.setScalar(scaleFactor);
        loadedModel.position.x = -center.x * scaleFactor;
        loadedModel.position.y = -box.min.y * scaleFactor - 0.2;
        loadedModel.position.z = -center.z * scaleFactor;

        arGroup.clear();
        arGroup.add(loadedModel);
      },
      undefined,
      () => {
        arGroup.clear();
        arGroup.add(createProceduralDishMesh(dish.category));
      }
    );

    // Touch and Drag Gestures in AR Space
    let isPointerActive = false;
    let lastX = 0;
    let lastY = 0;
    let initialPinchDistance = 0;

    const handleArPointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerActive = true;
      if ("touches" in e && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
        return;
      }
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      lastX = clientX;
      lastY = clientY;
    };

    const handleArPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isPointerActive || !arGroup) return;

      // Pinch to Zoom / Scale
      if ("touches" in e && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        if (initialPinchDistance > 0) {
          const ratio = currentDistance / initialPinchDistance;
          const newScale = Math.max(0.5, Math.min(2.5, modelScale * ratio));
          setModelScale(newScale);
          arGroup.scale.setScalar(newScale);
        }
        return;
      }

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - lastX;
      const deltaY = clientY - lastY;

      // Reposition and rotate on table plane
      arModelPosRef.current.rotY += deltaX * 0.01;
      arModelPosRef.current.x += deltaX * 0.003;
      arModelPosRef.current.y -= deltaY * 0.003;

      arGroup.rotation.y = arModelPosRef.current.rotY;
      arGroup.position.x = arModelPosRef.current.x;
      arGroup.position.y = arModelPosRef.current.y;
      reticleMesh.position.x = arModelPosRef.current.x;
      tableShadow.position.x = arModelPosRef.current.x;

      lastX = clientX;
      lastY = clientY;
    };

    const handleArPointerUp = () => {
      isPointerActive = false;
      initialPinchDistance = 0;
    };

    canvas.addEventListener("mousedown", handleArPointerDown);
    window.addEventListener("mousemove", handleArPointerMove);
    window.addEventListener("mouseup", handleArPointerUp);
    canvas.addEventListener("touchstart", handleArPointerDown);
    window.addEventListener("touchmove", handleArPointerMove);
    window.addEventListener("touchend", handleArPointerUp);

    // Pulse reticle animation
    let tick = 0;
    const animateAr = () => {
      tick += 0.04;
      reticleMesh.scale.setScalar(1 + Math.sin(tick) * 0.03);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animateAr);
    };
    animateAr();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleArPointerDown);
      window.removeEventListener("mousemove", handleArPointerMove);
      window.removeEventListener("mouseup", handleArPointerUp);
      canvas.removeEventListener("touchstart", handleArPointerDown);
      window.removeEventListener("touchmove", handleArPointerMove);
      window.removeEventListener("touchend", handleArPointerUp);
      renderer.dispose();
    };
  }, [viewMode, dish, createProceduralDishMesh, modelScale]);

  // Snapshot photo capture function (merges camera video + WebGL 3D model canvas)
  const takeArSnapshot = () => {
    if (!videoRef.current || !arCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = arCanvasRef.current;
    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = video.videoWidth || 1280;
    snapCanvas.height = video.videoHeight || 720;
    const ctx = snapCanvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw video background frame
    ctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);

    // 2. Draw 3D WebGL render on top
    ctx.drawImage(canvas, 0, 0, snapCanvas.width, snapCanvas.height);

    // 3. Add Monroe Luxury Restobar Watermark
    ctx.fillStyle = "rgba(10, 10, 11, 0.75)";
    ctx.fillRect(30, snapCanvas.height - 90, 420, 60);

    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 22px serif";
    ctx.fillText("MONROE LUXURY RESTOBAR", 45, snapCanvas.height - 55);

    ctx.fillStyle = "#EAEAEA";
    ctx.font = "14px sans-serif";
    ctx.fillText(dish.name + " • AR Mesa 1:1", 45, snapCanvas.height - 35);

    const dataUrl = snapCanvas.toDataURL("image/jpeg", 0.95);
    setSnapshotUrl(dataUrl);
  };

  const resetArPosition = () => {
    arModelPosRef.current = { x: 0, y: -0.2, rotY: 0 };
    setModelScale(1.0);
    if (arModelGroupRef.current) {
      arModelGroupRef.current.position.set(0, -0.2, 0);
      arModelGroupRef.current.rotation.set(0, 0, 0);
      arModelGroupRef.current.scale.setScalar(1.0);
    }
  };

  // --------------------------------------------------------------------------
  // 3. Turntable 360 Handlers
  // --------------------------------------------------------------------------
  const handleTurntableDown = (e: React.MouseEvent) => {
    setIsDraggingTurntable(true);
    setTurntableStartX(e.clientX);
  };

  const handleTurntableMove = (e: React.MouseEvent) => {
    if (!isDraggingTurntable) return;
    const delta = e.clientX - turntableStartX;
    setTurntableAngle((prev) => (prev + delta * 0.6) % 360);
    setTurntableStartX(e.clientX);
  };

  const handleTurntableUp = () => setIsDraggingTurntable(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-obsidian-950/95 backdrop-blur-2xl"
      >
        <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] bg-gradient-to-b from-[#18181D] via-[#101014] to-[#0A0A0B] border border-gold-500/30 p-1.5 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_45px_rgba(212,175,55,0.18)]">
          <div className="relative rounded-[calc(2.5rem-0.375rem)] bg-obsidian-900/95 p-4 sm:p-7 flex flex-col gap-5">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <GoldBadge size="sm">Visor 3D & Realidad Aumentada 1:1</GoldBadge>
                  <span className="text-xs text-gold-400/90 font-mono tracking-wider bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-gold-500/20">
                    {dish.model3d?.realDimensions || "30cm x 30cm • Escala Real"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-wide">
                  {dish.name}
                </h2>
                <p className="text-xs sm:text-sm text-platinum/80 mt-0.5">{dish.subtitle}</p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory flex items-center justify-center transition-all shadow-lg shrink-0"
                aria-label="Cerrar visor 3D"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Mode Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-obsidian-950/80 p-1.5 rounded-2xl border border-white/[0.06]">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setViewMode("3d_interactive")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all ${
                    viewMode === "3d_interactive"
                      ? "bg-gold-500/25 text-gold-300 border border-gold-500/40 shadow-gold-glow"
                      : "text-platinum/80 hover:text-ivory hover:bg-white/[0.04]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-gold-400" />
                  Modelo 3D Interactivo
                </button>

                <button
                  onClick={() => setViewMode("live_ar_camera")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all ${
                    viewMode === "live_ar_camera"
                      ? "bg-gold-500/25 text-gold-300 border border-gold-500/40 shadow-gold-glow"
                      : "text-platinum/80 hover:text-ivory hover:bg-white/[0.04]"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                  Cámara AR en Vivo (Mesa)
                </button>

                <button
                  onClick={() => setViewMode("360_turntable")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all ${
                    viewMode === "360_turntable"
                      ? "bg-gold-500/25 text-gold-300 border border-gold-500/40 shadow-gold-glow"
                      : "text-platinum/80 hover:text-ivory hover:bg-white/[0.04]"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                  360° Studio
                </button>

                <button
                  onClick={() => setViewMode("native_ar")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 whitespace-nowrap transition-all ${
                    viewMode === "native_ar"
                      ? "bg-gold-500/25 text-gold-300 border border-gold-500/40 shadow-gold-glow"
                      : "text-platinum/80 hover:text-ivory hover:bg-white/[0.04]"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-gold-400" />
                  iOS / Android AR
                </button>
              </div>

              {/* Lighting controls in 3D Mode */}
              {viewMode === "3d_interactive" && (
                <div className="flex items-center gap-1.5 px-2 text-[11px] text-platinum">
                  <span className="hidden md:inline text-platinum/60">Iluminación:</span>
                  <button
                    onClick={() => setLightingPreset("intimate")}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      lightingPreset === "intimate"
                        ? "bg-gold-500/20 text-gold-300 font-semibold border border-gold-500/30"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Sun className="w-3 h-3 text-gold-400" />
                    Íntimo
                  </button>
                  <button
                    onClick={() => setLightingPreset("obsidian")}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      lightingPreset === "obsidian"
                        ? "bg-gold-500/20 text-gold-300 font-semibold border border-gold-500/30"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Moon className="w-3 h-3 text-blue-400" />
                    Obsidian
                  </button>
                  <button
                    onClick={() => setLightingPreset("josper_fire")}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      lightingPreset === "josper_fire"
                        ? "bg-gold-500/20 text-gold-300 font-semibold border border-gold-500/30"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Flame className="w-3 h-3 text-amber-500" />
                    Josper
                  </button>
                </div>
              )}
            </div>

            {/* Main Viewport Container */}
            <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl bg-gradient-to-b from-black/90 via-[#0B0B0E] to-black/95 border border-white/[0.08] overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* MODE 1: Three.js Interactive 3D Canvas */}
              {viewMode === "3d_interactive" && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <canvas
                    ref={interactiveCanvasRef}
                    className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                  />

                  {/* Loading Spinner */}
                  {isLoadingModel && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian-950/70 backdrop-blur-sm pointer-events-none">
                      <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin mb-3" />
                      <span className="text-xs text-gold-300 font-medium tracking-wider uppercase">
                        Cargando Geometría 3D de Autor...
                      </span>
                    </div>
                  )}

                  {/* Interactive HUD Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`p-2.5 rounded-full backdrop-blur-md border text-xs flex items-center gap-1.5 transition-all ${
                        autoRotate
                          ? "bg-gold-500/20 border-gold-500/40 text-gold-300"
                          : "bg-obsidian-950/80 border-white/10 text-platinum"
                      }`}
                      title={autoRotate ? "Pausar autorotación" : "Activar autorotación"}
                    >
                      {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Bottom HUD Bar */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] text-platinum/90 flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: "12s" }} />
                      <span>Arrastra para rotar en 360° • WebGL PBR</span>
                    </div>

                    <div className="bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-500/30 text-[11px] text-gold-300 font-medium">
                      {dish.tags[0] || "Signature Monroe"}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: Real-time Live Camera AR Projection */}
              {viewMode === "live_ar_camera" && (
                <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                  
                  {/* Live Background Video Stream */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Transparent WebGL 3D Overlay Canvas */}
                  <canvas
                    ref={arCanvasRef}
                    className="absolute inset-0 w-full h-full touch-none cursor-move z-10"
                  />

                  {/* Permission / Status Overlays */}
                  {cameraPermission === "denied" && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-obsidian-950/90 backdrop-blur-md text-center max-w-md mx-auto">
                      <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
                      <h4 className="text-lg font-serif font-bold text-ivory mb-1">
                        Permiso de Cámara Requerido
                      </h4>
                      <p className="text-xs text-platinum leading-relaxed mb-4">
                        Para proyectar el plato en tu mesa real, permite el acceso a la cámara en los ajustes de tu navegador.
                      </p>
                      <button
                        onClick={startCameraStream}
                        className="px-5 py-2 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:scale-105 transition-transform"
                      >
                        Intentar Nuevamente
                      </button>
                    </div>
                  )}

                  {cameraPermission === "unsupported" && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-obsidian-950/90 text-center">
                      <Smartphone className="w-12 h-12 text-gold-400 mb-3" />
                      <h4 className="text-lg font-serif font-bold text-ivory mb-1">
                        Cámara no compatible con este navegador
                      </h4>
                      <p className="text-xs text-platinum mb-4">
                        Usa el Visor 3D Interactivo o abre esta página en Safari (iOS) o Chrome (Android).
                      </p>
                      <button
                        onClick={() => setViewMode("3d_interactive")}
                        className="px-5 py-2 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider"
                      >
                        Volver a 3D
                      </button>
                    </div>
                  )}

                  {/* AR Live Toolbar Controls */}
                  {cameraPermission === "granted" && (
                    <>
                      {/* Top Status Pill */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-obsidian-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold-500/40 text-[11px] text-gold-300 font-medium shadow-lg flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                        <span>{arStatusMessage}</span>
                      </div>

                      {/* Right Floating Quick Tools */}
                      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                        <button
                          onClick={() => setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"))}
                          className="p-3 rounded-full bg-obsidian-950/80 hover:bg-gold-500/20 backdrop-blur-md border border-white/15 hover:border-gold-500/40 text-platinum hover:text-ivory transition-all shadow-lg"
                          title="Cambiar Cámara Frontal/Posterior"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={resetArPosition}
                          className="p-3 rounded-full bg-obsidian-950/80 hover:bg-gold-500/20 backdrop-blur-md border border-white/15 hover:border-gold-500/40 text-platinum hover:text-ivory transition-all shadow-lg"
                          title="Centrar plato en mesa"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Snapshot & Instructions Bar */}
                      <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between gap-3">
                        <div className="bg-obsidian-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[11px] text-platinum/90 hidden sm:flex items-center gap-2">
                          <Sliders className="w-3.5 h-3.5 text-gold-400" />
                          <span>Pellizca para escalar • 1 dedo para rotar</span>
                        </div>

                        {/* Snapshot Shutter Button */}
                        <button
                          onClick={takeArSnapshot}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all mx-auto sm:mx-0"
                        >
                          <Camera className="w-4 h-4" />
                          Tomar Foto en Mesa
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* MODE 3: 360 Turntable Studio */}
              {viewMode === "360_turntable" && (
                <div
                  onMouseDown={handleTurntableDown}
                  onMouseMove={handleTurntableMove}
                  onMouseUp={handleTurntableUp}
                  onMouseLeave={handleTurntableUp}
                  className="relative w-full h-full select-none cursor-ew-resize flex items-center justify-center"
                >
                  <div
                    className="relative w-72 h-72 sm:w-84 sm:h-84 transition-transform duration-75"
                    style={{ transform: `rotateY(${turntableAngle}deg)` }}
                  >
                    {dish.video ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={dish.image}
                        className="w-full h-full object-cover rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.25)] border-2 border-gold-500/40"
                      >
                        {dish.videoWebm && <source src={dish.videoWebm} type="video/webm" />}
                        <source src={dish.video} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.25)] border-2 border-gold-500/40"
                      />
                    )}
                  </div>

                  <div className="absolute top-4 left-4 bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] text-platinum">
                    Arrastra horizontalmente • Giro 360° ({Math.round(turntableAngle)}°)
                  </div>
                </div>
              )}

              {/* MODE 4: Native Mobile AR Guide (iOS QuickLook & Android SceneViewer) */}
              {viewMode === "native_ar" && (
                <div className="relative w-full h-full p-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center mb-4 shadow-gold-glow">
                    <Smartphone className="w-8 h-8 text-gold-300 animate-bounce" />
                  </div>

                  <h3 className="text-xl font-serif font-bold text-ivory mb-2">
                    Proyección Nativa en tu Dispositivo
                  </h3>
                  <p className="text-xs text-platinum/90 leading-relaxed mb-6">
                    Abre el modelo con los motores nativos ARKit de Apple o ARCore de Google para ver sombras dinámicas avanzadas y tracking de superficie milimétrico.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <a
                      href={dish.model3d?.usdzUrl || "/models3d/sample.glb"}
                      rel="ar"
                      className="w-full sm:w-1/2 py-3.5 px-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] transition-transform"
                    >
                      <Sparkles className="w-4 h-4" />
                      Apple AR Quick Look
                    </a>

                    <button
                      onClick={() => {
                        const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
                          dish.model3d?.glbUrl || "/models3d/sample.glb"
                        )}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
                        window.location.href = sceneViewerUrl;
                      }}
                      className="w-full sm:w-1/2 py-3.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-ivory text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
                    >
                      <Eye className="w-4 h-4 text-gold-400" />
                      Android Scene Viewer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Snapshot Modal Preview */}
            {snapshotUrl && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                <div className="relative max-w-xl w-full bg-obsidian-900 rounded-3xl p-5 border border-gold-500/40 flex flex-col gap-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-ivory text-lg">Foto Capturada en Mesa</h4>
                    <button
                      onClick={() => setSnapshotUrl(null)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-platinum"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <img src={snapshotUrl} alt="Snapshot AR" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <a
                      href={snapshotUrl}
                      download={`Monroe_${dish.name.replace(/\s+/g, "_")}_AR.jpg`}
                      className="px-5 py-2.5 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold-glow"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Foto
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Dish Specs & Bottom Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/[0.08]">
              <div>
                <div className="text-xs text-platinum/70">Precio de Carta</div>
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
