"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Utensils, AlertCircle } from "lucide-react";
import { CategoryId, DietaryTag, Dish } from "@/types/menu";
import { DISHES, CATEGORIES } from "@/data/menuData";
import { DishCard } from "./DishCard";
import { MenuFilters } from "./MenuFilters";
import { DishDetailModal } from "./DishDetailModal";
import { DishModelViewer } from "@/components/3d/DishModelViewer";
import { useOrderStore } from "@/hooks/useOrderStore";

export function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<DietaryTag | "all" | "3d_only">("all");
  
  const {
    activeDetailDish,
    setActiveDetailDish,
    active3dDish,
    setActive3dDish,
    addItem,
  } = useOrderStore();

  const currentCategoryInfo = useMemo(() => {
    if (selectedCategory === "all") return null;
    return CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      // Category filter
      if (selectedCategory !== "all" && dish.category !== selectedCategory) {
        return false;
      }

      // 3D Tag filter
      if (selectedTag === "3d_only" && !dish.is3dAvailable) {
        return false;
      }

      // Dietary Tag filter
      if (selectedTag !== "all" && selectedTag !== "3d_only" && !dish.tags.includes(selectedTag as DietaryTag)) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesSubtitle = dish.subtitle.toLowerCase().includes(q);
        const matchesDescription = dish.description.toLowerCase().includes(q);
        const matchesPairing = dish.pairingSuggestion.name.toLowerCase().includes(q);
        return matchesName || matchesSubtitle || matchesDescription || matchesPairing;
      }

      return true;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  return (
    <section id="carta-digital" className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Background Section Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-[0.2em] shadow-gold-glow">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Experiencia Gastronómica de Autor</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory tracking-wide leading-tight">
          Nuestra Carta <span className="gold-text-shimmer">Interactivo 3D</span>
        </h2>

        <p className="text-xs sm:text-sm text-platinum/90 max-w-xl mx-auto leading-relaxed font-light">
          Selección rigurosa de pastas hechas a mano, carnes Prime maduradas en cámara propia y coctelería contemporánea inspirada en la costa ancashina.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-12">
        <MenuFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      </div>

      {/* Category Banner if specific category is active */}
      {currentCategoryInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-gold-500/[0.08] via-obsidian-850 to-transparent border border-gold-500/20"
        >
          <div className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-1">
            {currentCategoryInfo.tagline}
          </div>
          <h3 className="text-2xl font-serif font-bold text-ivory mb-1">
            {currentCategoryInfo.name}
          </h3>
          <p className="text-xs text-platinum max-w-2xl font-light">
            {currentCategoryInfo.description}
          </p>
        </motion.div>
      )}

      {/* Dishes Grid */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <DishCard
                  dish={dish}
                  onSelect={(d) => setActiveDetailDish(d)}
                  onOpen3d={(d) => setActive3dDish(d)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-white/[0.06] p-8 space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-gold-400 mx-auto" />
          <h4 className="text-lg font-serif font-bold text-ivory">No se encontraron platos</h4>
          <p className="text-xs text-platinum">
            Intenta cambiar los filtros o el término de búsqueda para explorar otras opciones de autor.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedTag("all");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-semibold"
          >
            Ver toda la carta
          </button>
        </div>
      )}

      {/* Modals */}
      <DishDetailModal
        dish={activeDetailDish}
        onClose={() => setActiveDetailDish(null)}
        onOpen3d={(d) => setActive3dDish(d)}
      />

      {active3dDish && (
        <DishModelViewer
          dish={active3dDish}
          onClose={() => setActive3dDish(null)}
          onAddToCart={() => addItem(active3dDish, 1)}
        />
      )}

    </section>
  );
}
