"use client";

import Image from "next/image";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import type { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils/format";
import { QuantitySelector } from "@/components/food/quantity-selector";

export function CartItem({
  item,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
        <p className="text-sm tabular-nums text-muted-foreground">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.name} from cart`}
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash className="size-4" aria-hidden />
        </button>
        <QuantitySelector
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          min={0}
          size="sm"
        />
      </div>
    </div>
  );
}
