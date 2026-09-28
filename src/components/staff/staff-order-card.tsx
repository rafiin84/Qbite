"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Order } from "@/types";
import { formatRelativeTime, formatTime, pluralize } from "@/lib/utils/format";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderNumber } from "@/components/orders/order-number";
import { StaffStatusActions } from "./staff-status-actions";
import { useAdvanceOrderStatus } from "@/features/staff/hooks";

export function StaffOrderCard({ order, showPickupTime = false }: { order: Order; showPickupTime?: boolean }) {
  const advance = useAdvanceOrderStatus();
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <OrderNumber value={order.orderNumber} size="sm" />
          <Link href={`/staff/orders/${order.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline">
            {order.customerName}
          </Link>
        </div>
        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {itemCount} {pluralize(itemCount, "item")} · {formatRelativeTime(order.orderTime)}
        </span>
        {showPickupTime && order.scheduledPickupTime ? (
          <span className="font-medium text-status-scheduled-foreground">
            Pickup {formatTime(order.scheduledPickupTime)}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/staff/orders/${order.id}`}
          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          View details
        </Link>
        <StaffStatusActions
          status={order.status}
          loading={advance.isPending}
          onAdvance={() => advance.mutate(order.id)}
          size="sm"
        />
      </div>
    </motion.div>
  );
}
