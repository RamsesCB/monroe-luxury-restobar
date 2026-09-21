"use client";

import { useState, useEffect } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsSupported(Boolean(document.fullscreenEnabled || (document as any).webkitFullscreenEnabled));

      const handleFullscreenChange = () => {
        const isCurrent = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
        setIsFullscreen(isCurrent);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
        document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      };
    }
  }, []);

  const toggleFullscreen = async () => {
    if (typeof document === "undefined") return;

    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        const root = document.documentElement;
        if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if ((root as any).webkitRequestFullscreen) {
          await (root as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen API error:", err);
    }
  };

  return { isFullscreen, isSupported, toggleFullscreen };
}
