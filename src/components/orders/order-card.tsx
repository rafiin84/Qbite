import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { Order } from "@/types";
import { formatCurrency, formatDateTime, pluralize } from "@/lib/utils/format";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderNumber } from "./order-number";

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group flex items-center justify-between gap-4 rounded-3xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/30 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <OrderNumber value={order.orderNumber} size="sm" />
          <OrderStatusBadge status={order.status} size="sm" />
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {itemCount} {pluralize(itemCount, "item")} · {formatDateTime(order.orderTime)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-heading text-base font-semibold tabular-nums text-foreground">
          {formatCurrency(order.total)}
        </span>
        <CaretRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  );
}
