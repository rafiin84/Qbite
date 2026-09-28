"use client";

import { useMemo, useState } from "react";
import { Archive } from "@phosphor-icons/react/dist/ssr";
import type { OrderStatus } from "@/types";
import { useStaffOrders } from "@/features/staff/hooks";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderNumber } from "@/components/orders/order-number";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderCardSkeleton } from "@/components/feedback/loading-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDateTime, pluralize } from "@/lib/utils/format";

const filters: { label: string; value: "all" | OrderStatus }[] = [
  { label: "All", value: "all" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Collected", value: "collected" },
];

export default function StaffHistoryPage() {
  const staffOrdersQuery = useStaffOrders();
  const [filter, setFilter] = useState<"all" | OrderStatus>("collected");

  const filtered = useMemo(() => {
    const orders = staffOrdersQuery.data ?? [];
    const scoped = orders.filter((o) => o.status !== "scheduled");
    if (filter === "all") return scoped;
    return scoped.filter((o) => o.status === filter);
  }, [staffOrdersQuery.data, filter]);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Order History</h1>
        <p className="text-sm text-muted-foreground">Every order the canteen has processed today.</p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          {filters.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {staffOrdersQuery.isLoading ? (
        <OrderCardSkeleton />
      ) : staffOrdersQuery.isError ? (
        <ErrorState title="We couldn't load order history" onRetry={() => staffOrdersQuery.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Archive} title="Nothing here yet" description="Orders matching this filter will show up here." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((order) => {
            const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
            return (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3.5"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <OrderNumber value={order.orderNumber} size="sm" />
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.customerName} · {itemCount} {pluralize(itemCount, "item")} · {formatDateTime(order.orderTime)}
                  </p>
                </div>
                <span className="font-heading text-sm font-semibold tabular-nums text-foreground">
                  {formatCurrency(order.total)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
