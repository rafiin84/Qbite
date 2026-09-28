"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "@phosphor-icons/react/dist/ssr";
import type { Order } from "@/types";
import { formatTime, pluralize } from "@/lib/utils/format";
import { OrderNumber } from "@/components/orders/order-number";
import { StaffStatusActions } from "./staff-status-actions";
import { useAdvanceOrderStatus } from "@/features/staff/hooks";
import { cn } from "@/lib/utils";

function urgency(scheduledPickupTime?: string): { label: string; isUrgent: boolean } {
  if (!scheduledPickupTime) return { label: "", isUrgent: false };
  const minutes = Math.round((new Date(scheduledPickupTime).getTime() - Date.now()) / 60_000);
  if (minutes <= 0) return { label: "Due now", isUrgent: true };
  if (minutes < 60) return { label: `In ${minutes} min`, isUrgent: minutes <= 20 };
  const hours = Math.round(minutes / 60);
  return { label: `In ${hours} ${pluralize(hours, "hr")}`, isUrgent: false };
}

export function UpcomingOrderCard({ order }: { order: Order }) {
  const advance = useAdvanceOrderStatus();
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const { label, isUrgent } = urgency(order.scheduledPickupTime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 rounded-xl bg-status-scheduled-soft px-3 py-2">
          <Clock className="size-4 text-status-scheduled-foreground" weight="bold" aria-hidden />
          <span className="font-heading text-base font-semibold tabular-nums text-status-scheduled-foreground">
            {formatTime(order.scheduledPickupTime!)}
          </span>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            isUrgent ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <OrderNumber value={order.orderNumber} size="sm" />
        <Link href={`/staff/orders/${order.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline">
          {order.customerName}
        </Link>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")} · {itemCount} {pluralize(itemCount, "item")}
      </p>

      <div className="flex justify-end">
        <StaffStatusActions status={order.status} loading={advance.isPending} onAdvance={() => advance.mutate(order.id)} size="sm" />
      </div>
    </motion.div>
  );
}
