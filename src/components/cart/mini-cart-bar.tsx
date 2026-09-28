"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useCartDetails } from "@/features/cart/hooks";
import { formatCurrency, pluralize } from "@/lib/utils/format";

export function MiniCartBar() {
  const { itemCount, total } = useCartDetails();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 mt-2 md:bottom-4"
        >
          <Link
            href="/cart"
            className="flex items-center justify-between gap-4 rounded-2xl bg-foreground px-5 py-3.5 text-background shadow-lg"
          >
            <span className="text-sm font-medium">
              {itemCount} {pluralize(itemCount, "item")} · {formatCurrency(total)}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              View cart
              <CaretRight className="size-4" aria-hidden />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
