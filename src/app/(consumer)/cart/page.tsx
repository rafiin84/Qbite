"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCartSimple, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useCanteen } from "@/features/menu/hooks";
import { useCartDetails } from "@/features/cart/hooks";
import { useCartStore } from "@/store/cart-store";
import { useSessionStore } from "@/store/session-store";
import { usePlaceOrder } from "@/features/orders/hooks";
import { pickupWindowToday } from "@/lib/mock/queue-engine";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { TimePicker } from "@/components/form/time-picker";
import { EmptyState } from "@/components/feedback/empty-state";
import { PickupTime } from "@/components/orders/pickup-time";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const router = useRouter();
  const consumer = useSessionStore((s) => s.consumer);
  const canteenQuery = useCanteen();
  const cart = useCartDetails();
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const mode = useCartStore((s) => s.mode);
  const setMode = useCartStore((s) => s.setMode);
  const scheduledPickupTime = useCartStore((s) => s.scheduledPickupTime);
  const setScheduledPickupTime = useCartStore((s) => s.setScheduledPickupTime);
  const clearCart = useCartStore((s) => s.clear);
  const placeOrder = usePlaceOrder();

  const canteen = canteenQuery.data?.canteen;
  const isClosed = canteen?.status === "closed";

  const window = useMemo(() => (canteen ? pickupWindowToday(canteen) : null), [canteen]);

  useEffect(() => {
    if (!canteen || !window) return;
    if (isClosed && mode !== "preorder") {
      setMode("preorder");
    }
    if (!isClosed && mode !== "immediate") {
      setMode("immediate");
    }
  }, [canteen, isClosed, mode, setMode, window]);

  useEffect(() => {
    if (isClosed && window && !scheduledPickupTime) {
      setScheduledPickupTime(window.start.toISOString());
    }
  }, [isClosed, scheduledPickupTime, setScheduledPickupTime, window]);

  if (canteenQuery.isLoading || cart.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader onBack={() => router.back()} />
        <EmptyState
          icon={ShoppingCartSimple}
          title="Your cart is empty"
          description="Add something delicious from the menu to get started."
          action={
            <Button onClick={() => router.push("/menu")} className="mt-1">
              Browse menu
            </Button>
          }
        />
      </div>
    );
  }

  async function handleCheckout() {
    if (!consumer || !canteen) return;
    try {
      const order = await placeOrder.mutateAsync({
        customerId: consumer.id,
        customerName: consumer.name,
        items: cart.lines.map((l) => ({ menuItemId: l.item.id, quantity: l.quantity })),
        mode,
        scheduledPickupTime: mode === "preorder" ? scheduledPickupTime ?? undefined : undefined,
      });
      clearCart();
      router.push(`/orders/${order.id}?justPlaced=1`);
    } catch (err) {
      toast.error("We couldn't place your order", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <PageHeader onBack={() => router.back()} />

      {cart.hasUnavailableItem ? (
        <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          One or more items in your cart just went unavailable. Remove them to continue.
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {cart.lines.map((line) => (
          <CartItem
            key={line.item.id}
            item={line.item}
            quantity={line.quantity}
            onIncrement={() => incrementItem(line.item.id)}
            onDecrement={() => decrementItem(line.item.id)}
            onRemove={() => removeItem(line.item.id)}
          />
        ))}
      </div>

      {isClosed && window ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-foreground">Choose pickup time</h2>
            <span className="text-xs font-medium text-status-scheduled-foreground">Canteen closed · Pre-order</span>
          </div>
          <TimePicker
            windowStart={window.start}
            windowEnd={window.end}
            value={scheduledPickupTime ? new Date(scheduledPickupTime) : window.start}
            onChange={(date) => setScheduledPickupTime(date.toISOString())}
          />
        </div>
      ) : scheduledPickupTime && mode === "preorder" ? (
        <PickupTime iso={scheduledPickupTime} />
      ) : null}

      <CartSummary subtotal={cart.subtotal} total={cart.total} />

      <Button
        onClick={handleCheckout}
        disabled={placeOrder.isPending || cart.hasUnavailableItem}
        className="h-12 text-base"
      >
        {placeOrder.isPending
          ? "Placing your order…"
          : isClosed
            ? "Confirm Pre-order"
            : "Continue to Order"}
      </Button>
    </div>
  );
}

function PageHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border"
      >
        <ArrowLeft className="size-4" weight="bold" aria-hidden />
      </button>
      <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">Your Cart</h1>
    </div>
  );
}
