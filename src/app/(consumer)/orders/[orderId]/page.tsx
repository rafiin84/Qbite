"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, MapPin, Confetti } from "@phosphor-icons/react/dist/ssr";
import { useOrder } from "@/features/orders/hooks";
import { useCanteen } from "@/features/menu/hooks";
import { orderStatusConfig } from "@/features/orders/status";
import { OrderNumber } from "@/components/orders/order-number";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { QueueInfo } from "@/components/orders/queue-info";
import { PickupTime } from "@/components/orders/pickup-time";
import { OrderSummary } from "@/components/orders/order-summary";
import { TrackingSkeleton } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

export default function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const [showCelebration, setShowCelebration] = useState(false);

  const orderQuery = useOrder(orderId, { live: true });
  const canteenQuery = useCanteen();

  useEffect(() => {
    const justPlaced = new URLSearchParams(window.location.search).get("justPlaced") === "1";
    if (!justPlaced) return;
    setShowCelebration(true);
    const timer = setTimeout(() => setShowCelebration(false), 2600);
    router.replace(`/orders/${orderId}`, { scroll: false });
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (orderQuery.isLoading) {
    return <TrackingSkeleton />;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <ErrorState
        title="We couldn't load this order"
        description="It may have been removed, or there was a connection issue."
        onRetry={() => orderQuery.refetch()}
      />
    );
  }

  const order = orderQuery.data;
  const config = orderStatusConfig[order.status];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="flex items-center gap-3 rounded-3xl bg-status-ready-soft px-5 py-4 text-status-ready-foreground"
          >
            <Confetti weight="fill" className="size-6 shrink-0" aria-hidden />
            <div className="flex flex-col">
              <p className="font-heading text-base font-semibold">Order placed!</p>
              <p className="text-sm opacity-90">We&apos;ll keep this page updated as it moves through the queue.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/orders")}
          aria-label="Back to order history"
          className="flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border"
        >
          <ArrowLeft className="size-4" weight="bold" aria-hidden />
        </button>
        <OrderNumber value={order.orderNumber} size="lg" />
      </div>

      <motion.div
        layout
        className={
          order.status === "ready"
            ? "flex flex-col gap-4 rounded-3xl bg-status-ready px-5 py-6 text-white shadow-lg shadow-status-ready/25"
            : "flex flex-col gap-4 rounded-3xl border border-border bg-card px-5 py-6"
        }
      >
        <div className="flex items-center justify-between">
          {order.status === "ready" ? (
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="size-6" aria-hidden />
              <span className="font-heading text-xl font-semibold">Ready for collection</span>
            </div>
          ) : (
            <OrderStatusBadge status={order.status} size="lg" />
          )}
        </div>
        <p className={order.status === "ready" ? "text-sm text-white/90" : "text-sm text-muted-foreground"}>
          {config.description}
        </p>

        {order.status === "scheduled" && order.scheduledPickupTime ? (
          <PickupTime iso={order.scheduledPickupTime} />
        ) : order.status === "preparing" &&
          order.ordersAhead !== undefined &&
          order.estimatedWaitMinutes !== undefined ? (
          <QueueInfo ordersAhead={order.ordersAhead} estimatedWaitMinutes={order.estimatedWaitMinutes} />
        ) : null}
      </motion.div>

      <div className="rounded-3xl border border-border bg-card px-5 py-5">
        <OrderTimeline status={order.status} />
      </div>

      {canteenQuery.data ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-muted/70 px-4 py-3.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          Collect from <span className="font-medium text-foreground">{canteenQuery.data.canteen.name}</span>,{" "}
          {canteenQuery.data.canteen.location}
        </div>
      ) : null}

      <div className="rounded-3xl border border-border bg-card px-5 py-5">
        <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Order summary</h2>
        <OrderSummary items={order.items} subtotal={order.subtotal} total={order.total} />
      </div>
    </div>
  );
}
