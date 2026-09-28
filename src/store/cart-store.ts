import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderMode } from "@/types";

export interface CartLine {
  menuItemId: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  mode: OrderMode;
  scheduledPickupTime: string | null;
  addItem: (menuItemId: string, quantity?: number) => void;
  incrementItem: (menuItemId: string) => void;
  decrementItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  setMode: (mode: OrderMode) => void;
  setScheduledPickupTime: (iso: string | null) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      mode: "immediate",
      scheduledPickupTime: null,

      addItem: (menuItemId, quantity = 1) => {
        const existing = get().lines.find((l) => l.menuItemId === menuItemId);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.menuItemId === menuItemId ? { ...l, quantity: l.quantity + quantity } : l,
            ),
          });
        } else {
          set({ lines: [...get().lines, { menuItemId, quantity }] });
        }
      },

      incrementItem: (menuItemId) => {
        set({
          lines: get().lines.map((l) =>
            l.menuItemId === menuItemId ? { ...l, quantity: l.quantity + 1 } : l,
          ),
        });
      },

      decrementItem: (menuItemId) => {
        const line = get().lines.find((l) => l.menuItemId === menuItemId);
        if (!line) return;
        if (line.quantity <= 1) {
          set({ lines: get().lines.filter((l) => l.menuItemId !== menuItemId) });
        } else {
          set({
            lines: get().lines.map((l) =>
              l.menuItemId === menuItemId ? { ...l, quantity: l.quantity - 1 } : l,
            ),
          });
        }
      },

      removeItem: (menuItemId) => {
        set({ lines: get().lines.filter((l) => l.menuItemId !== menuItemId) });
      },

      setMode: (mode) => set({ mode, scheduledPickupTime: mode === "immediate" ? null : get().scheduledPickupTime }),

      setScheduledPickupTime: (iso) => set({ scheduledPickupTime: iso }),

      clear: () => set({ lines: [], mode: "immediate", scheduledPickupTime: null }),
    }),
    { name: "qbite.cart.v1" },
  ),
);
