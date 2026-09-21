"use client";

import React from "react";
import {
  MapPin,
  Clock,
  Car,
  ShieldCheck,
  Phone,
  Mail,
  Instagram,
  Navigation,
  Sparkles,
} from "lucide-react";
import { RESTAURANT_INFO } from "@/data/restaurantInfo";
import { GoldBadge } from "@/components/ui/GoldBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export function LocationSection() {
  return (
    <section id="ubicacion" className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <GoldBadge>Punto de Encuentro</GoldBadge>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory tracking-wide leading-tight">
          Ubicación & <span className="gold-text-shimmer">Atmósfera Monroe</span>
        </h2>

        <p className="text-xs sm:text-sm text-platinum/90 max-w-xl mx-auto leading-relaxed font-light">
          Situados estratégicamente en la zona gastronómica del Malecón de Chimbote, con vista abierta a la bahía y ambiente climatizado de alta exclusividad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Address & Direct Navigation */}
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-ivory">Dirección Oficial</h3>
                  <p className="text-xs text-gold-400">{RESTAURANT_INFO.city}</p>
                </div>
              </div>

              <p className="text-xs text-platinum font-light">
                {RESTAURANT_INFO.address}
              </p>

              <div className="flex gap-2 pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    RESTAURANT_INFO.address + " " + RESTAURANT_INFO.city
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-obsidian-950 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </GlassCard>

          {/* Schedule */}
          <GlassCard>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-ivory">Horarios de Servicio</h3>
              </div>

              <div className="space-y-2 text-xs text-platinum pt-1">
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-ivory font-medium">Martes a Jueves:</span>
                  <span className="text-gold-300">7:00 PM – 1:00 AM</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-ivory font-medium">Viernes y Sábado:</span>
                  <span className="text-gold-300">6:30 PM – 3:00 AM</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-ivory font-medium">Domingo de Autor:</span>
                  <span className="text-gold-300">1:00 PM – 9:00 PM</span>
                </div>
                <div className="flex justify-between text-platinum/60">
                  <span>Lunes:</span>
                  <span>Cerrado (I+D Gastronómico)</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Amenities: Valet & Dress Code */}
          <GlassCard>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Car className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ivory">Valet Parking Privado: </span>
                  <span className="text-platinum font-light">{RESTAURANT_INFO.valetParking}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/[0.04] pt-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ivory">Código de Vestimenta: </span>
                  <span className="text-platinum font-light">{RESTAURANT_INFO.dressCode}</span>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Visual Styled Map Container */}
        <div className="lg:col-span-7 h-full min-h-[420px] rounded-[2.5rem] p-1.5 bg-white/[0.03] border border-white/[0.08] shadow-2xl relative overflow-hidden">
          <div className="relative w-full h-full min-h-[400px] rounded-[calc(2.5rem-0.375rem)] overflow-hidden bg-obsidian-950 border border-white/10 flex flex-col justify-between p-6 sm:p-8">
            
            {/* Background Graphic / Map Mockup */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent" />

            {/* Top Map Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-full bg-obsidian-900/90 backdrop-blur-md border border-gold-500/30 text-[11px] text-gold-300 font-medium">
                Bahía de Chimbote • Malecón Grau
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Central Pin Callout */}
            <div className="relative z-10 text-center max-w-sm mx-auto my-auto space-y-3 p-6 rounded-3xl bg-obsidian-900/90 backdrop-blur-xl border border-gold-500/40 shadow-gold-glow">
              <div className="w-12 h-12 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center mx-auto shadow-gold-glow-lg font-serif font-black text-xl">
                M
              </div>
              <h4 className="text-xl font-serif font-bold text-ivory">MONROE RESTOBAR</h4>
              <p className="text-xs text-platinum font-light leading-relaxed">
                Av. Francisco Bolognesi 640, Chimbote. Frente al malecón costero.
              </p>
              <div className="text-[11px] text-gold-400 font-mono">
                Lat: -9.0754 | Lng: -78.5936
              </div>
            </div>

            {/* Bottom Contact Pill */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08] text-xs text-platinum">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>{RESTAURANT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>{RESTAURANT_INFO.email}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
