"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShoppingBag,
  Calendar,
  Menu as MenuIcon,
  X,
  Compass,
  Volume2,
  VolumeX,
  Phone,
  Maximize2,
} from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { FullscreenButton } from "@/components/ui/FullscreenButton";
import { RESTAURANT_INFO } from "@/data/restaurantInfo";

interface LuxuryNavbarProps {
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
}

export function LuxuryNavbar({ isPlayingAudio, onToggleAudio }: LuxuryNavbarProps) {
  const { itemCount, setDrawerOpen, setReservationOpen } = useOrderStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#carta-digital", label: "Carta Digital" },
    { href: "#experiencia-3d", label: "Visor 3D & AR" },
    { href: "#esencia-monroe", label: "Nuestra Esencia" },
    { href: "#ubicacion", label: "Ubicación & Contacto" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 pointer-events-none ${
          isScrolled ? "py-3" : "py-5 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between pointer-events-auto">
          
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-obsidian-950/70 backdrop-blur-xl border border-white/10 hover:border-gold-500/40 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 flex items-center justify-center text-obsidian-950 font-serif font-black text-sm shadow-gold-glow">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg tracking-[0.25em] text-ivory group-hover:text-gold-300 transition-colors">
                MONROE
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-400 font-medium -mt-1">
                Restobar de Autor
              </span>
            </div>
          </Link>

          {/* Desktop Floating Island Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-obsidian-900/80 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-xs font-medium tracking-wider text-platinum hover:text-ivory hover:bg-white/[0.05] transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Audio, Fullscreen, Cart, Booking */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className="w-10 h-10 rounded-full bg-obsidian-950/70 backdrop-blur-xl border border-white/10 hover:border-gold-500/40 text-platinum hover:text-gold-300 flex items-center justify-center transition-all"
              title={isPlayingAudio ? "Silenciar ambiente sonoro" : "Activar atmósfera lounge"}
              aria-label="Toggle soundscape"
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Fullscreen QR Toggle */}
            <div className="hidden sm:block">
              <FullscreenButton />
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative px-3.5 sm:px-4 py-2 rounded-full bg-obsidian-950/80 hover:bg-gold-500/15 backdrop-blur-xl border border-white/10 hover:border-gold-500/40 text-platinum hover:text-gold-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(212,175,55,0.08)]"
              aria-label="Ver comanda de mesa"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span className="hidden md:inline">Mi Mesa</span>
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-[10px] flex items-center justify-center shadow-gold-glow">
                  {itemCount}
                </span>
              )}
            </button>

            {/* VIP Reservation CTA */}
            <button
              onClick={() => setReservationOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserva VIP</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-obsidian-950/80 backdrop-blur-xl border border-white/10 text-platinum hover:text-ivory flex items-center justify-center"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 lg:hidden bg-obsidian-950/95 backdrop-blur-3xl pt-24 px-6 pb-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-2">
                Navegación Monroe
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xl font-serif text-ivory border-b border-white/[0.06] hover:text-gold-300 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setReservationOpen(true);
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <Calendar className="w-4 h-4" />
                Reserva VIP en Chimbote
              </button>

              <div className="text-[11px] text-platinum/70 text-center">
                {RESTAURANT_INFO.address}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
