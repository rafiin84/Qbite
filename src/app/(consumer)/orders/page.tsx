"use client";

import { useMemo } from "react";
import { ClipboardText } from "@phosphor-icons/react/dist/ssr";
import { useSessionStore } from "@/store/session-store";
import { useOrders } from "@/features/orders/hooks";
import { OrderCard } from "@/components/orders/order-card";
import { OrderCardSkeleton } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";

export default function OrdersPage() {
  const consumer = useSessionStore((s) => s.consumer);
  const ordersQuery = useOrders(consumer?.id);

  const { active, history } = useMemo(() => {
    const orders = ordersQuery.data ?? [];
    return {
      active: orders.filter((o) => o.status !== "collected"),
      history: orders.filter((o) => o.status === "collected"),
    };
  }, [ordersQuery.data]);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Orders</h1>

      {ordersQuery.isLoading ? (
        <OrderCardSkeleton />
      ) : ordersQuery.isError ? (
        <ErrorState
          title="We couldn't load your orders"
          description="Check your connection and try again."
          onRetry={() => ordersQuery.refetch()}
        />
      ) : ordersQuery.data && ordersQuery.data.length === 0 ? (
        <EmptyState
          icon={ClipboardText}
          title="Your next meal starts here."
          description="Orders you place will show up here, live and in your history."
        />
      ) : (
        <>
          {active.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Active</h2>
              <div className="flex flex-col gap-3">
                {active.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground">History</h2>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">Collected orders will appear here.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
