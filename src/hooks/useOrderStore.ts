"use client";

import { useState, useEffect } from "react";
import { Dish, OrderItem, TableInfo, TableZone } from "@/types/menu";
import { RESTAURANT_INFO } from "@/data/restaurantInfo";

interface OrderStoreState {
  items: OrderItem[];
  tableInfo: TableInfo;
  isDrawerOpen: boolean;
  isReservationOpen: boolean;
  activeDetailDish: Dish | null;
  active3dDish: Dish | null;
  includeTip: boolean;
  tipPercentage: number;
}

// In-memory global state with listener pattern for React 19
let globalState: OrderStoreState = {
  items: [],
  tableInfo: {
    zone: "salon_principal",
    tableNumber: "Mesa 01",
    guestName: "",
  },
  isDrawerOpen: false,
  isReservationOpen: false,
  activeDetailDish: null,
  active3dDish: null,
  includeTip: true,
  tipPercentage: 10,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("monroe_cart_items", JSON.stringify(globalState.items));
      localStorage.setItem("monroe_table_info", JSON.stringify(globalState.tableInfo));
    } catch {
      // ignore
    }
  }
}

export function useOrderStore() {
  const [state, setState] = useState<OrderStoreState>(globalState);

  useEffect(() => {
    // Rehydrate from localStorage on mount
    if (typeof window !== "undefined") {
      try {
        const savedItems = localStorage.getItem("monroe_cart_items");
        const savedTable = localStorage.getItem("monroe_table_info");
        if (savedItems) globalState.items = JSON.parse(savedItems);
        if (savedTable) globalState.tableInfo = JSON.parse(savedTable);
        setState({ ...globalState });
      } catch {
        // ignore
      }
    }

    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const addItem = (dish: Dish, quantity = 1, specialInstructions = "", includePairing = false) => {
    const existingIndex = globalState.items.findIndex(
      (item) => item.dish.id === dish.id && item.selectedPairing === includePairing
    );

    if (existingIndex > -1) {
      globalState.items[existingIndex].quantity += quantity;
      if (specialInstructions) {
        globalState.items[existingIndex].specialInstructions = specialInstructions;
      }
    } else {
      globalState.items.push({
        dish,
        quantity,
        specialInstructions,
        selectedPairing: includePairing,
      });
    }
    notify();
  };

  const removeItem = (dishId: string) => {
    globalState.items = globalState.items.filter((item) => item.dish.id !== dishId);
    notify();
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    const item = globalState.items.find((i) => i.dish.id === dishId);
    if (item) {
      item.quantity = quantity;
      notify();
    }
  };

  const updateInstructions = (dishId: string, instructions: string) => {
    const item = globalState.items.find((i) => i.dish.id === dishId);
    if (item) {
      item.specialInstructions = instructions;
      notify();
    }
  };

  const setTableInfo = (info: Partial<TableInfo>) => {
    globalState.tableInfo = { ...globalState.tableInfo, ...info };
    notify();
  };

  const setDrawerOpen = (open: boolean) => {
    globalState.isDrawerOpen = open;
    notify();
  };

  const setReservationOpen = (open: boolean) => {
    globalState.isReservationOpen = open;
    notify();
  };

  const setActiveDetailDish = (dish: Dish | null) => {
    globalState.activeDetailDish = dish;
    notify();
  };

  const setActive3dDish = (dish: Dish | null) => {
    globalState.active3dDish = dish;
    notify();
  };

  const setIncludeTip = (include: boolean) => {
    globalState.includeTip = include;
    notify();
  };

  const clearOrder = () => {
    globalState.items = [];
    notify();
  };

  // Calculations
  const subtotal = state.items.reduce((acc, item) => {
    let itemPrice = item.dish.price;
    if (item.selectedPairing && item.dish.pairingSuggestion.price) {
      itemPrice += item.dish.pairingSuggestion.price;
    }
    return acc + itemPrice * item.quantity;
  }, 0);

  const tipAmount = state.includeTip ? (subtotal * state.tipPercentage) / 100 : 0;
  const total = subtotal + tipAmount;
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  // Generate WhatsApp Order String
  const generateWhatsAppMessage = (): string => {
    const zoneLabels: Record<TableZone, string> = {
      salon_principal: "Salón Principal Obsidian",
      cava_vinos: "Cava Privada & Vinos",
      terraza_maritima: "Terraza Lounge Bahía",
      barra_autor: "Barra de Autor & Mixología",
      mesa_chef_vip: "Mesa del Chef VIP",
    };

    const header = `*👑 MONROE LUXURY RESTOBAR — COMANDA DE AUTOR*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📍 *Ubicación:* ${zoneLabels[state.tableInfo.zone]} — *${state.tableInfo.tableNumber}*\n` +
      (state.tableInfo.guestName ? `👤 *Comensal / Anfitrión:* ${state.tableInfo.guestName}\n` : "") +
      `🕒 *Fecha y Hora:* ${new Date().toLocaleDateString("es-PE", { hour: "2-digit", minute: "2-digit" })}\n\n` +
      `*🍽️ DETALLE DE LA SELECCIÓN:*\n`;

    const itemsText = state.items
      .map((item, idx) => {
        let line = `${idx + 1}. *${item.quantity}x* ${item.dish.name} — *S/ ${(item.dish.price * item.quantity).toFixed(2)}*`;
        if (item.selectedPairing && item.dish.pairingSuggestion.price) {
          line += `\n   🍷 _+ Maridaje:_ ${item.dish.pairingSuggestion.name} (+S/ ${(item.dish.pairingSuggestion.price * item.quantity).toFixed(2)})`;
        }
        if (item.specialInstructions) {
          line += `\n   📝 _Nota de cocina:_ "${item.specialInstructions}"`;
        }
        return line;
      })
      .join("\n\n");

    const totalsText = `\n\n━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *Subtotal:* S/ ${subtotal.toFixed(2)}\n` +
      (state.includeTip ? `✨ *Propina Sugerida (${state.tipPercentage}%):* S/ ${tipAmount.toFixed(2)}\n` : "") +
      `🏆 *TOTAL ESTIMADO:* S/ ${total.toFixed(2)}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Enviado desde la Carta Digital Interactiva Monroe Restobar (Chimbote)_`;

    return `${header}${itemsText}${totalsText}`;
  };

  const sendWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encoded}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  return {
    items: state.items,
    tableInfo: state.tableInfo,
    isDrawerOpen: state.isDrawerOpen,
    isReservationOpen: state.isReservationOpen,
    activeDetailDish: state.activeDetailDish,
    active3dDish: state.active3dDish,
    includeTip: state.includeTip,
    tipPercentage: state.tipPercentage,
    subtotal,
    tipAmount,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    updateInstructions,
    setTableInfo,
    setDrawerOpen,
    setReservationOpen,
    setActiveDetailDish,
    setActive3dDish,
    setIncludeTip,
    clearOrder,
    generateWhatsAppMessage,
    sendWhatsAppOrder,
  };
}
