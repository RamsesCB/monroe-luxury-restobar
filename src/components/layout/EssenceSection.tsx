"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Flame, UtensilsCrossed, GlassWater, ShieldCheck, HeartHandshake } from "lucide-react";
import { GoldBadge } from "@/components/ui/GoldBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export function EssenceSection() {
  const pillars = [
    {
      title: "La Pasta Fatta a Mano",
      subtitle: "Harinas de Sémola Italiana & Yemas de Campo",
      description: "Nuestras masas reposan 24 horas y son moldeadas a mano con rodillo de haya y matrices de bronce. Cada raviolo y garganello es una pieza única de artesanía gastronómica.",
      icon: <UtensilsCrossed className="w-5 h-5 text-gold-400" />,
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "El Fuego & Dry-Aging",
      subtitle: "Carbón de Quebracho & Sal del Himalaya",
      description: "Maduración en seco propia donde la carne gana perfiles de umami profundos y notas a fruto seco, sellada en horno Josper a 400°C para caramelización perfecta.",
      icon: <Flame className="w-5 h-5 text-gold-400" />,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Alquimia Sensorial",
      subtitle: "Mixología de Vanguardia & Hielo Cristalino",
      description: "Bloques de hielo esculpidos a mano, destilados de colección, clarificados moleculares y perfumería botánica creada para elevar el ritual nocturno en Chimbote.",
      icon: <GlassWater className="w-5 h-5 text-gold-400" />,
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section id="esencia-monroe" className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <GoldBadge>Filosofía de Alta Cocina</GoldBadge>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory tracking-wide leading-tight">
          La Esencia <span className="gold-text-shimmer">MONROE</span>
        </h2>

        <p className="text-xs sm:text-sm text-platinum/90 max-w-xl mx-auto leading-relaxed font-light">
          Nacidos en el corazón de Chimbote para redefinir el estándar del buen vivir. Una confluencia de rigor técnico, nobleza de producto y calidez hospitalaria.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {pillars.map((pillar, idx) => (
          <GlassCard key={idx} className="h-full">
            <div className="space-y-5 flex flex-col justify-between h-full">
              
              <div>
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 border border-white/10">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-gold-500/40 flex items-center justify-center shadow-gold-glow">
                    {pillar.icon}
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-ivory group-hover:text-gold-300 transition-colors">
                  {pillar.title}
                </h3>
                <div className="text-xs text-gold-400/90 font-medium mt-1 mb-2">
                  {pillar.subtitle}
                </div>
                <p className="text-xs text-platinum leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-gold-400 font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Estándar Monroe</span>
              </div>

            </div>
          </GlassCard>
        ))}
      </div>

    </section>
  );
}
