"use client";

import React from "react";
import {
  Search,
  Sparkles,
  Flame,
  UtensilsCrossed,
  GlassWater,
  Award,
  Wine,
  Box,
  Check,
} from "lucide-react";
import { CategoryId, DietaryTag } from "@/types/menu";
import { CATEGORIES } from "@/data/menuData";

interface MenuFiltersProps {
  selectedCategory: CategoryId | "all";
  onSelectCategory: (category: CategoryId | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: DietaryTag | "all" | "3d_only";
  onSelectTag: (tag: DietaryTag | "all" | "3d_only") => void;
}

export function MenuFilters({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
}: MenuFiltersProps) {
  const categoryIcons: Record<string, React.ReactNode> = {
    pastas: <UtensilsCrossed className="w-4 h-4" />,
    carnes: <Flame className="w-4 h-4" />,
    cocteleria: <GlassWater className="w-4 h-4" />,
    entradas: <Sparkles className="w-4 h-4" />,
    postres: <Award className="w-4 h-4" />,
    vinos: <Wine className="w-4 h-4" />,
  };

  const quickTags: { id: DietaryTag | "all" | "3d_only"; label: string; icon?: React.ReactNode }[] = [
    { id: "all", label: "Todos los Platos" },
    { id: "Estrella Monroe", label: "Signature Monroe", icon: <Sparkles className="w-3 h-3 text-gold-400" /> },
    { id: "3d_only", label: "Con Visor 3D / AR", icon: <Box className="w-3 h-3 text-gold-400" /> },
    { id: "Recomendación Sommelier", label: "Selección Sommelier" },
    { id: "Dry Aged", label: "Dry-Aged 45D" },
    { id: "Pasta Fresca Fatta a Mano", label: "Pasta Fresca" },
    { id: "Sin Gluten", label: "Sin Gluten" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-platinum/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por plato, ingrediente o maridaje..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-obsidian-950/80 border border-white/10 focus:border-gold-500/50 text-xs text-ivory placeholder:text-platinum/40 focus:outline-none backdrop-blur-md transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-platinum hover:text-ivory"
            >
              ×
            </button>
          )}
        </div>

        <div className="text-xs text-platinum/80 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Cocina de Autor en Servicio Activo • Chimbote</span>
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        <button
          onClick={() => onSelectCategory("all")}
          className={`shrink-0 px-5 py-3 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-2 transition-all duration-300 ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 shadow-gold-glow font-bold scale-[1.02]"
              : "bg-white/[0.04] text-platinum hover:text-ivory hover:bg-white/[0.08] border border-white/[0.08]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Toda la Carta</span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-5 py-3 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center gap-2 transition-all duration-300 ${
                isSelected
                  ? "bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 shadow-gold-glow font-bold scale-[1.02]"
                  : "bg-white/[0.04] text-platinum hover:text-ivory hover:bg-white/[0.08] border border-white/[0.08]"
              }`}
            >
              {categoryIcons[cat.id]}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Tag Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickTags.map((tag) => {
          const isActive = selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => onSelectTag(tag.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-gold-500/20 text-gold-300 border border-gold-500/50 shadow-gold-glow"
                  : "bg-obsidian-950/60 text-platinum/80 hover:text-ivory border border-white/[0.06] hover:border-white/10"
              }`}
            >
              {tag.icon}
              <span>{tag.label}</span>
              {isActive && <Check className="w-3 h-3 text-gold-400 ml-0.5" />}
            </button>
          );
        })}
      </div>

    </div>
  );
}
