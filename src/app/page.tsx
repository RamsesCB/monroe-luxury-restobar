"use client";

import React, { useState } from "react";
import { LuxuryNavbar } from "@/components/layout/LuxuryNavbar";
import { HeroSection } from "@/components/layout/HeroSection";
import { MenuSection } from "@/components/menu/MenuSection";
import { EssenceSection } from "@/components/layout/EssenceSection";
import { LocationSection } from "@/components/layout/LocationSection";
import { LuxuryFooter } from "@/components/layout/LuxuryFooter";
import { OrderDrawer } from "@/components/order/OrderDrawer";
import { ReservationModal } from "@/components/reservations/ReservationModal";
import { AtmosphereAudio } from "@/components/layout/AtmosphereAudio";

export default function Home() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <main className="relative bg-obsidian-900 min-h-screen text-ivory overflow-x-hidden">
      
      {/* Luxury Navbar */}
      <LuxuryNavbar
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Interactive Digital Menu with 3D / AR */}
      <MenuSection />

      {/* Brand Essence & Storytelling */}
      <EssenceSection />

      {/* Location, Schedule & Map */}
      <LocationSection />

      {/* Luxury Footer */}
      <LuxuryFooter />

      {/* Drawers & Modals */}
      <OrderDrawer />
      <ReservationModal />

      {/* Procedural Audio Soundscape */}
      <AtmosphereAudio
        isPlaying={isPlayingAudio}
        onToggle={() => setIsPlayingAudio(!isPlayingAudio)}
      />

    </main>
  );
}
