"use client";

import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CaretRight,
  MapPin,
  Storefront,
  ClipboardText,
  Clock,
  CalendarBlank,
} from "@phosphor-icons/react/dist/ssr";
import type { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionStore } from "@/store/session-store";
import { useCanteen, useMenu } from "@/features/menu/hooks";
import { useActiveOrder, useOrders } from "@/features/orders/hooks";
import { useCartStore } from "@/store/cart-store";
import { timeOfDayGreeting } from "@/lib/utils/greeting";
import { formatTime } from "@/lib/utils/format";
import { ActiveOrderCard } from "@/components/orders/active-order-card";
import { OrderCard } from "@/components/orders/order-card";
import { FoodCard } from "@/components/food/food-card";
import { ErrorState } from "@/components/feedback/error-state";

export default function HomePage() {
  const consumer = useSessionStore((s) => s.consumer);
  const canteenQuery = useCanteen();
  const activeOrderQuery = useActiveOrder(consumer?.id);
  const menuQuery = useMenu();
  const ordersQuery = useOrders(consumer?.id);
  const addItem = useCartStore((s) => s.addItem);

  const firstName = consumer?.name.split(" ")[0] ?? "there";
  const canteen = canteenQuery.data?.canteen;
  const isOpen = canteen?.status === "open";

  const popularItems = (menuQuery.data?.items ?? [])
    .filter((item) => item.isPopular && item.available)
    .slice(0, 4);

  const recentOrders = (ordersQuery.data ?? [])
    .filter((order) => order.id !== activeOrderQuery.data?.id)
    .slice(0, 2);

  function handleQuickAdd(item: MenuItem) {
    addItem(item.id, 1);
    toast.success(`Added ${item.name}`, { description: "1 item added to your cart." });
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-1"
      >
        <p className="text-lg text-muted-foreground">
          {timeOfDayGreeting()}, <span className="font-medium text-foreground">{firstName}</span>
        </p>

        {canteenQuery.isLoading ? (
          <Skeleton className="h-8 w-56" />
        ) : canteenQuery.isError || !canteen ? (
          <ErrorState
            title="We couldn't load your canteen"
            description="Check your connection and try again."
            onRetry={() => canteenQuery.refetch()}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {canteen.name}
            </h1>
            <span
              className={
                isOpen
                  ? "inline-flex items-center gap-1.5 rounded-full bg-status-ready-soft px-2.5 py-1 text-xs font-medium text-status-ready-foreground"
                  : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              }
            >
              <span className={isOpen ? "size-1.5 rounded-full bg-status-ready" : "size-1.5 rounded-full bg-muted-foreground"} />
              {isOpen ? "Open now" : "Closed"}
            </span>
          </div>
        )}

        {canteen ? (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            {canteenQuery.data?.institution.name} · {canteen.location}
          </p>
        ) : null}
      </motion.div>

      {canteen ? (
        <div className="flex flex-wrap gap-2.5">
          <div className="flex items-center gap-2 rounded-2xl bg-muted/70 px-3.5 py-2 text-xs text-muted-foreground">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            Open {formatTime(`1970-01-01T${canteen.operatingHours.opensAt}:00`)} –{" "}
            {formatTime(`1970-01-01T${canteen.operatingHours.closesAt}:00`)}
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-muted/70 px-3.5 py-2 text-xs text-muted-foreground">
            <CalendarBlank className="size-3.5 shrink-0" aria-hidden />
            Pre-orders {formatTime(`1970-01-01T${canteen.pickupWindow.startsAt}:00`)} –{" "}
            {formatTime(`1970-01-01T${canteen.pickupWindow.endsAt}:00`)}
          </div>
        </div>
      ) : null}

      {consumer && (activeOrderQuery.isLoading ? (
        <Skeleton className="h-40 w-full rounded-3xl" />
      ) : activeOrderQuery.data ? (
        <ActiveOrderCard order={activeOrderQuery.data} />
      ) : null)}

      {canteen && !isOpen ? (
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-status-scheduled/30 bg-status-scheduled-soft px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <p className="font-heading text-sm font-semibold text-status-scheduled-foreground">
              The canteen is closed right now
            </p>
            <p className="text-xs text-status-scheduled-foreground/80">
              Opens {formatTime(`1970-01-01T${canteen.operatingHours.opensAt}:00`)} · Pre-order for next opening
            </p>
          </div>
          <Button size="sm" className="shrink-0" render={<Link href="/menu">Pre-order</Link>} />
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Link
            href="/menu"
            className="group flex items-center justify-between gap-4 rounded-3xl bg-primary px-5 py-4 text-primary-foreground transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white/15">
                <Storefront weight="fill" className="size-5" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-sm font-semibold">Browse the menu</span>
                <span className="text-xs text-primary-foreground/80">Snacks, meals, beverages &amp; more</span>
              </div>
            </div>
            <CaretRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </motion.div>

        <Link
          href="/orders"
          className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-card px-5 py-3.5 transition-colors hover:bg-accent/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-muted">
              <ClipboardText weight="bold" className="size-4 text-muted-foreground" aria-hidden />
            </span>
            <span className="font-heading text-sm font-semibold text-foreground">Order history</span>
          </div>
          <CaretRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      </div>

      {popularItems.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-foreground">Popular right now</h2>
            <Link href="/menu" className="text-xs font-medium text-muted-foreground hover:text-foreground">
              See all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {popularItems.map((item, index) => (
              <div key={item.id} className="w-40 shrink-0 sm:w-44">
                <FoodCard item={item} index={index} onQuickAdd={handleQuickAdd} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {recentOrders.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-foreground">Recent orders</h2>
            <Link href="/orders" className="text-xs font-medium text-muted-foreground hover:text-foreground">
              See all
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
