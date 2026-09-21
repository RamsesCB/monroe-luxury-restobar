"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Users,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MessageCircle,
} from "lucide-react";
import { TableZone, ReservationRequest } from "@/types/menu";
import { RESTAURANT_INFO } from "@/data/restaurantInfo";
import { GoldBadge } from "@/components/ui/GoldBadge";
import { useOrderStore } from "@/hooks/useOrderStore";

export function ReservationModal() {
  const { isReservationOpen, setReservationOpen } = useOrderStore();

  const [form, setForm] = useState<ReservationRequest>({
    name: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    guests: 2,
    zone: "salon_principal",
    occasion: "Cena Romántica",
    specialRequests: "",
  });

  if (!isReservationOpen) return null;

  const timeSlots = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];

  const handleSendReservation = (e: React.FormEvent) => {
    e.preventDefault();

    const zoneNames: Record<TableZone, string> = {
      salon_principal: "Salón Principal Obsidian",
      cava_vinos: "Cava Privada & Vinos",
      terraza_maritima: "Terraza Lounge Bahía",
      barra_autor: "Barra de Autor & Mixología",
      mesa_chef_vip: "Mesa del Chef VIP (Omakase)",
    };

    const message =
      `*👑 MONROE LUXURY RESTOBAR — SOLICITUD DE RESERVA VIP*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Titular:* ${form.name}\n` +
      `📱 *Teléfono:* ${form.phone}\n` +
      (form.email ? `📧 *Email:* ${form.email}\n` : "") +
      `📅 *Fecha:* ${form.date}\n` +
      `🕒 *Hora:* ${form.time} hrs\n` +
      `👥 *Comensales:* ${form.guests} personas\n` +
      `📍 *Zona Solicitada:* ${zoneNames[form.zone]}\n` +
      (form.occasion ? `✨ *Ocasión:* ${form.occasion}\n` : "") +
      (form.specialRequests ? `📝 *Requerimientos Especiales:* "${form.specialRequests}"\n` : "") +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Enviado desde el sistema oficial de reservas Monroe Restobar Chimbote_`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
    setReservationOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/90 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl rounded-[2.5rem] bg-gradient-to-b from-[#18181D] via-[#101014] to-[#0A0A0B] border border-gold-500/30 p-1.5 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.2)] my-auto"
        >
          <div className="relative rounded-[calc(2.5rem-0.375rem)] bg-obsidian-900/95 p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setReservationOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/[0.06] hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-platinum hover:text-ivory flex items-center justify-center transition-all"
              aria-label="Cerrar reserva"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-white/[0.08] pb-4 mb-6">
              <GoldBadge size="sm">Mesa VIP & Experiencias Privadas</GoldBadge>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-wide">
                Reservar una Mesa en <span className="gold-text-shimmer">MONROE</span>
              </h2>
              <p className="text-xs text-platinum font-light">
                Garantiza tu acceso a nuestra atmósfera de autor, cava privada o terraza con vista a la bahía de Chimbote.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSendReservation} className="space-y-5">
              
              {/* Personal Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-platinum flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-gold-400" />
                    Nombre y Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej. Valeria Carranza"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 focus:border-gold-500/60 text-xs text-ivory placeholder:text-platinum/40 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-platinum flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-gold-400" />
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+51 987 654 321"
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 focus:border-gold-500/60 text-xs text-ivory placeholder:text-platinum/40 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Date, Time, Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-platinum flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 focus:border-gold-500/60 text-xs text-ivory focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-platinum flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    Hora *
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 focus:border-gold-500/60 text-xs text-ivory focus:outline-none"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time} hrs
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-platinum flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-gold-400" />
                    Personas *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 2 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 focus:border-gold-500/60 text-xs text-ivory focus:outline-none"
                  />
                </div>
              </div>

              {/* Experience Zone Selection */}
              <div className="space-y-2">
                <label className="text-xs text-platinum flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  Zona Exclusiva Monroe:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {RESTAURANT_INFO.experienceZones.map((z) => {
                    const isSelected = form.zone === z.id;
                    return (
                      <div
                        key={z.id}
                        onClick={() => setForm({ ...form, zone: z.id as TableZone })}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-gold-500/15 border-gold-500/50 shadow-gold-glow"
                            : "bg-obsidian-950/60 border-white/[0.06] hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs font-serif font-bold text-ivory">{z.name}</div>
                        <div className="text-[11px] text-platinum/70 line-clamp-1">{z.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Occasion & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-platinum font-medium">Motivo / Celebración:</label>
                  <select
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-ivory focus:border-gold-500/60 focus:outline-none"
                  >
                    <option value="Cena Romántica">Cena Romántica</option>
                    <option value="Aniversario">Aniversario</option>
                    <option value="Negocios">Cena de Negocios VIP</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Degustación">Menú Degustación</option>
                    <option value="Otro">Encuentro Casual</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-platinum font-medium">Requerimientos Especiales:</label>
                  <input
                    type="text"
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    placeholder="Ej. Descorche, pétalos en mesa..."
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-ivory placeholder:text-platinum/40 focus:border-gold-500/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-white/[0.08]">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Confirmar Reserva vía WhatsApp Concierge
                </button>
                <div className="text-[11px] text-platinum/70 text-center mt-2">
                  Atención personalizada inmediata por nuestro Head Hostess • Chimbote
                </div>
              </div>

            </form>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
