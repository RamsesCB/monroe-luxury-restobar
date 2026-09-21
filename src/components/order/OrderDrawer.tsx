"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  MapPin,
  Wine,
  FileText,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { formatPEN } from "@/lib/utils";
import { TableZone } from "@/types/menu";
import { RESTAURANT_INFO } from "@/data/restaurantInfo";

export function OrderDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    tableInfo,
    setTableInfo,
    updateQuantity,
    removeItem,
    clearOrder,
    includeTip,
    setIncludeTip,
    subtotal,
    tipAmount,
    total,
    sendWhatsAppOrder,
  } = useOrderStore();

  const [isCopied, setIsCopied] = useState(false);

  if (!isDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-md"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg h-full bg-gradient-to-b from-[#16161B] via-[#0F0F12] to-[#0A0A0B] border-l border-gold-500/30 p-1.5 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col"
        >
          <div className="relative w-full h-full rounded-[1.5rem] bg-obsidian-900/95 p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-300">
                      Comanda en Mesa
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-ivory tracking-wide">
                    Mi Selección Monroe
                  </h3>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-gold-500/20 text-platinum hover:text-ivory border border-white/10 flex items-center justify-center transition-all"
                  aria-label="Cerrar orden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table & Zone Selector */}
              <div className="mt-4 p-4 rounded-2xl bg-obsidian-950/80 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs text-platinum">
                  <span className="font-semibold text-ivory flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    Ubicación en Restobar:
                  </span>
                  <span className="text-gold-400 font-mono text-[11px]">Servicio Activo</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={tableInfo.zone}
                    onChange={(e) => setTableInfo({ zone: e.target.value as TableZone })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-ivory focus:border-gold-500 focus:outline-none"
                  >
                    <option value="salon_principal">Salón Principal Obsidian</option>
                    <option value="terraza_maritima">Terraza Lounge Bahía</option>
                    <option value="cava_vinos">Cava Privada VIP</option>
                    <option value="barra_autor">Barra de Autor</option>
                    <option value="mesa_chef_vip">Mesa del Chef VIP</option>
                  </select>

                  <input
                    type="text"
                    value={tableInfo.tableNumber}
                    onChange={(e) => setTableInfo({ tableNumber: e.target.value })}
                    placeholder="Mesa / Asiento (ej. Mesa 07)"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-ivory placeholder:text-platinum/40 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={tableInfo.guestName || ""}
                  onChange={(e) => setTableInfo({ guestName: e.target.value })}
                  placeholder="Nombre del anfitrión o comensal (Opcional)"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-ivory placeholder:text-platinum/40 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const itemUnitPrice =
                    item.dish.price +
                    (item.selectedPairing && item.dish.pairingSuggestion.price
                      ? item.dish.pairingSuggestion.price
                      : 0);

                  return (
                    <div
                      key={`${item.dish.id}-${idx}`}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-gold-500/30 transition-all space-y-2.5"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-obsidian-950 shrink-0 border border-white/10">
                          <Image
                            src={item.dish.image}
                            alt={item.dish.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-serif font-bold text-ivory truncate">
                            {item.dish.name}
                          </h4>
                          <div className="text-xs text-gold-300 font-medium">
                            {formatPEN(itemUnitPrice * item.quantity)}
                          </div>
                          {item.selectedPairing && (
                            <div className="text-[10px] text-gold-400/90 flex items-center gap-1 mt-0.5 truncate">
                              <Wine className="w-3 h-3 shrink-0" />
                              <span>+ Maridaje: {item.dish.pairingSuggestion.name}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeItem(item.dish.id)}
                          className="text-platinum/50 hover:text-red-400 p-1 transition-colors"
                          aria-label="Eliminar plato"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.specialInstructions && (
                        <div className="text-[11px] text-platinum/80 bg-obsidian-950/80 px-2.5 py-1 rounded-lg border border-white/[0.05]">
                          Nota: {item.specialInstructions}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                        <span className="text-[11px] text-platinum">Cantidad:</span>
                        <div className="flex items-center gap-2 bg-obsidian-950 px-2 py-0.5 rounded-full border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                            className="text-platinum hover:text-ivory"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-ivory px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                            className="text-platinum hover:text-ivory"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-platinum">
                    <Sparkles className="w-6 h-6 text-gold-400" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-ivory">
                    Tu comanda está vacía
                  </h4>
                  <p className="text-xs text-platinum max-w-xs mx-auto">
                    Explora nuestra carta digital y añade tus pastas artesanales o cortes preferidos.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                
                {/* Tip Toggle */}
                <div className="flex items-center justify-between bg-obsidian-950/90 p-3 rounded-2xl border border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="tip-check"
                      checked={includeTip}
                      onChange={(e) => setIncludeTip(e.target.checked)}
                      className="rounded border-gold-500 text-gold-500 accent-gold-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="tip-check" className="text-platinum cursor-pointer">
                      Servicio & Propina Sugerida (10%)
                    </label>
                  </div>
                  <span className="text-gold-300 font-medium">
                    {formatPEN(tipAmount)}
                  </span>
                </div>

                {/* Totals */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-platinum">
                    <span>Subtotal de Platos:</span>
                    <span>{formatPEN(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-ivory pt-1 border-t border-white/[0.06]">
                    <span>Total Estimado:</span>
                    <span className="text-gold-300 text-lg">{formatPEN(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={sendWhatsAppOrder}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar Comanda a WhatsApp Monroe
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-platinum pt-1">
                    <button
                      onClick={clearOrder}
                      className="hover:text-red-400 transition-colors"
                    >
                      Vaciar selección
                    </button>
                    <span>Concierge: {RESTAURANT_INFO.phone}</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
