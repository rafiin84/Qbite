"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Fire } from "@phosphor-icons/react/dist/ssr";
import { useMenuItem } from "@/features/menu/hooks";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils/format";
import { QuantitySelector } from "@/components/food/quantity-selector";
import { VegIndicator } from "@/components/food/veg-indicator";
import { AvailabilityBadge } from "@/components/food/availability-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";

export default function FoodDetailsPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = use(params);
  const router = useRouter();
  const itemQuery = useMenuItem(itemId);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  if (itemQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (itemQuery.isError || !itemQuery.data) {
    return (
      <ErrorState
        title="We couldn't load this item"
        description="It may no longer be on the menu."
        onRetry={() => itemQuery.refetch()}
      />
    );
  }

  const item = itemQuery.data;

  function handleAddToCart() {
    addItem(item.id, quantity);
    toast.success(`Added to cart`, {
      description: `${quantity} × ${item.name} · ${formatCurrency(item.price * quantity)}`,
    });
    router.back();
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border"
      >
        <ArrowLeft className="size-4" weight="bold" aria-hidden />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted"
      >
        <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 640px) 100vw, 500px" priority className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 flex justify-between p-3">
          {item.isPopular && item.available ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand-soft-foreground">
              <Fire weight="fill" className="size-3.5" aria-hidden />
              Popular pick
            </span>
          ) : (
            <span />
          )}
          <AvailabilityBadge available={item.available} />
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <VegIndicator isVeg={item.isVeg} />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.isVeg ? "Vegetarian" : "Non-vegetarian"}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{item.name}</h1>
          </div>
          <span className="shrink-0 font-heading text-xl font-semibold tabular-nums text-foreground">
            {formatCurrency(item.price)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        {!item.available && (
          <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            This item is currently unavailable. Check back later or explore similar dishes on the menu.
          </div>
        )}
      </div>

      {item.available && (
        <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] mt-2 flex items-center justify-between gap-3 rounded-3xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm md:bottom-4">
          <QuantitySelector quantity={quantity} onIncrement={() => setQuantity((q) => q + 1)} onDecrement={() => setQuantity((q) => Math.max(1, q - 1))} />
          <Button onClick={handleAddToCart} className="h-11 flex-1 gap-1.5">
            Add to Cart · {formatCurrency(item.price * quantity)}
          </Button>
        </div>
      )}
    </div>
  );
}
