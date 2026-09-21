"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowOnHover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  innerClassName,
  glowOnHover = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-[2rem] p-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "bg-white/[0.03] border border-white/[0.08]",
        glowOnHover &&
          "hover:border-gold-500/35 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.9),0_0_25px_-5px_rgba(212,175,55,0.18)] hover:-translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-[calc(2rem-0.375rem)] overflow-hidden",
          "bg-gradient-to-b from-[#141418]/90 via-[#101013]/90 to-[#0A0A0B]/95",
          "border border-white/[0.04]",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]",
          "backdrop-blur-xl p-6",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
