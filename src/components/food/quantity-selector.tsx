"use client";

import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  size = "md",
  className,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card",
        size === "sm" ? "h-8" : "h-10",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent",
          size === "sm" ? "size-8" : "size-10",
        )}
      >
        <Minus weight="bold" className="size-3.5" aria-hidden />
      </button>
      <span
        className={cn(
          "min-w-[1.5rem] text-center font-semibold tabular-nums text-foreground",
          size === "sm" ? "text-sm" : "text-base",
        )}
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent",
          size === "sm" ? "size-8" : "size-10",
        )}
      >
        <Plus weight="bold" className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
