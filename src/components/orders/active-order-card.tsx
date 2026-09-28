"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CaretRight, Package } from "@phosphor-icons/react/dist/ssr";
import type { Order } from "@/types";
import { pluralize } from "@/lib/utils/format";
import { OrderNumber } from "./order-number";
import { OrderStatusBadge } from "./order-status-badge";
import { QueueInfo } from "./queue-info";
import { PickupTime } from "./pickup-time";

export function ActiveOrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const isReady = order.status === "ready";

  return (
    <Link href={`/orders/${order.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileTap={{ scale: 0.99 }}
        className={
          isReady
            ? "flex flex-col gap-4 rounded-3xl bg-status-ready px-5 py-5 text-white shadow-lg shadow-status-ready/25"
            : "flex flex-col gap-4 rounded-3xl border border-border bg-card px-5 py-5"
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <span className={isReady ? "text-xs font-medium uppercase tracking-wide text-white/80" : "text-xs font-medium uppercase tracking-wide text-muted-foreground"}>
              Your active order
            </span>
            <OrderNumber value={order.orderNumber} size="lg" className={isReady ? "text-white" : undefined} />
            <p className={isReady ? "text-sm text-white/85" : "text-sm text-muted-foreground"}>
              {itemCount} {pluralize(itemCount, "item")}
            </p>
          </div>
          {isReady ? (
            <motion.span
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20"
            >
              <Package weight="fill" className="size-6 text-white" aria-hidden />
            </motion.span>
          ) : (
            <OrderStatusBadge status={order.status} />
          )}
        </div>

        {isReady ? (
          <div className="flex items-center justify-between rounded-2xl bg-white/15 px-4 py-3">
            <span className="font-heading text-lg font-semibold">Ready for collection</span>
            <CaretRight className="size-5" aria-hidden />
          </div>
        ) : order.status === "scheduled" && order.scheduledPickupTime ? (
          <PickupTime iso={order.scheduledPickupTime} />
        ) : order.status === "preparing" &&
          order.ordersAhead !== undefined &&
          order.estimatedWaitMinutes !== undefined ? (
          <QueueInfo ordersAhead={order.ordersAhead} estimatedWaitMinutes={order.estimatedWaitMinutes} />
        ) : null}
      </motion.div>
    </Link>
  );
}
