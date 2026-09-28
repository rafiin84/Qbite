"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCartSimple } from "@phosphor-icons/react/dist/ssr";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

export function CartBadge({ className }: { className?: string }) {
  const count = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

  return (
    <Link
      href="/cart"
      aria-label={`View cart, ${count} ${count === 1 ? "item" : "items"}`}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-accent",
        className,
      )}
    >
      <ShoppingCartSimple className="size-5" weight="bold" aria-hidden />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute -right-1 -top-1 flex min-w-[1.15rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold tabular-nums text-primary-foreground"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
