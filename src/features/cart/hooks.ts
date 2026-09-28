"use client";

import { useMemo } from "react";
import type { MenuItem } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { useMenu } from "@/features/menu/hooks";

export interface CartDetailLine {
  item: MenuItem;
  quantity: number;
  subtotal: number;
}

export function useCartDetails() {
  const lines = useCartStore((s) => s.lines);
  const { data: menu } = useMenu();

  return useMemo(() => {
    const items = menu?.items ?? [];
    const detailed: CartDetailLine[] = lines
      .map((line) => {
        const item = items.find((i) => i.id === line.menuItemId);
        if (!item) return null;
        return { item, quantity: line.quantity, subtotal: item.price * line.quantity };
      })
      .filter((l): l is CartDetailLine => l !== null);

    const subtotal = detailed.reduce((sum, l) => sum + l.subtotal, 0);
    const itemCount = detailed.reduce((sum, l) => sum + l.quantity, 0);
    const hasUnavailableItem = detailed.some((l) => !l.item.available);

    return { lines: detailed, subtotal, total: subtotal, itemCount, hasUnavailableItem, isLoading: !menu };
  }, [lines, menu]);
}
