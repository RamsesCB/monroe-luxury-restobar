"use client";

import React from "react";
import { LuxuryNavbar } from "@/components/layout/LuxuryNavbar";
import { MenuSection } from "@/components/menu/MenuSection";
import { OrderDrawer } from "@/components/order/OrderDrawer";
import { LuxuryFooter } from "@/components/layout/LuxuryFooter";

export default function Home() {
  return (
    <main className="relative bg-obsidian-900 min-h-screen text-ivory overflow-x-hidden flex flex-col justify-between selection:bg-gold-500 selection:text-obsidian-900 pt-20">
      
      {/* Clean Minimal Luxury Header */}
      <LuxuryNavbar />

      {/* Main Single Featured Dish Showcase */}
      <div className="flex-1 flex items-center justify-center py-6 sm:py-12">
        <MenuSection />
      </div>

      {/* Minimal Footer */}
      <LuxuryFooter />

      {/* Table Order Drawer */}
      <OrderDrawer />

    </main>
  );
}
