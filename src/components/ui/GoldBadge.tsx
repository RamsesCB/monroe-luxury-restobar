"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GoldBadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "obsidian" | "outline" | "emerald";
  className?: string;
  size?: "sm" | "md";
}

export function GoldBadge({
  children,
  variant = "gold",
  className,
  size = "md",
}: GoldBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3.5 py-1 text-xs";

  const variantClasses = {
    gold: "bg-gradient-to-r from-gold-500/15 via-gold-400/25 to-gold-600/15 text-gold-300 border border-gold-500/30 shadow-[0_0_12px_rgba(212,175,55,0.15)]",
    obsidian: "bg-obsidian-850/80 text-platinum border border-white/10",
    outline: "border border-gold-500/40 text-gold-400 bg-transparent",
    emerald: "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium tracking-wider uppercase backdrop-blur-md transition-all duration-300",
        sizeClasses,
        variantClasses[variant],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
      {children}
    </span>
  );
}
