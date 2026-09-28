"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { AvailabilityBadge } from "./availability-badge";
import { VegIndicator } from "./veg-indicator";

export function FoodCard({
  item,
  onQuickAdd,
  index = 0,
}: {
  item: MenuItem;
  onQuickAdd?: (item: MenuItem) => void;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow",
        item.available && "hover:shadow-md hover:shadow-foreground/5",
      )}
    >
      <Link
        href={`/menu/${item.id}`}
        className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`View details for ${item.name}`}
      />

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            !item.available && "grayscale-[0.4] opacity-70",
          )}
        />
        {!item.available && (
          <div className="absolute inset-x-0 bottom-0 flex justify-start p-2.5">
            <AvailabilityBadge available={item.available} />
          </div>
        )}
        {item.available && item.isPopular && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-soft-foreground">
            <Sparkle weight="fill" className="size-3" aria-hidden />
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex items-start gap-1.5">
          <VegIndicator isVeg={item.isVeg} className="mt-0.5" />
          <h3 className="line-clamp-1 flex-1 font-heading text-sm font-semibold text-foreground">
            {item.name}
          </h3>
        </div>
        <p className="line-clamp-2 min-h-[2.25rem] text-xs leading-snug text-muted-foreground">
          {item.description}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-heading text-base font-semibold tabular-nums text-foreground">
            {formatCurrency(item.price)}
          </span>
          {onQuickAdd && (
            <button
              type="button"
              disabled={!item.available}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickAdd(item);
              }}
              aria-label={`Add ${item.name} to cart`}
              className="relative z-20 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90 disabled:pointer-events-none disabled:opacity-30"
            >
              <Plus weight="bold" className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
