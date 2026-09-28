"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, User } from "@phosphor-icons/react/dist/ssr";
import { useStaffOrder, useAdvanceOrderStatus } from "@/features/staff/hooks";
import { OrderNumber } from "@/components/orders/order-number";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderSummary } from "@/components/orders/order-summary";
import { StaffStatusActions } from "@/components/staff/staff-status-actions";
import { ErrorState } from "@/components/feedback/error-state";
import { TrackingSkeleton } from "@/components/feedback/loading-state";
import { formatDateTime, formatTime } from "@/lib/utils/format";

export default function StaffOrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const orderQuery = useStaffOrder(orderId);
  const advance = useAdvanceOrderStatus();

  if (orderQuery.isLoading) return <TrackingSkeleton />;

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <ErrorState
        title="We couldn't load this order"
        onRetry={() => orderQuery.refetch()}
      />
    );
  }

  const order = orderQuery.data;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border"
        >
          <ArrowLeft className="size-4" weight="bold" aria-hidden />
        </button>
        <OrderNumber value={order.orderNumber} size="lg" />
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-muted">
            <User className="size-4 text-muted-foreground" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Customer</span>
            <span className="text-sm font-medium text-foreground">{order.customerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-muted">
            <Clock className="size-4 text-muted-foreground" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Order time</span>
            <span className="text-sm font-medium text-foreground">{formatDateTime(order.orderTime)}</span>
          </div>
        </div>
      </div>

      {order.scheduledPickupTime ? (
        <div className="rounded-2xl bg-status-scheduled-soft px-4 py-3.5 text-sm font-medium text-status-scheduled-foreground">
          Scheduled pickup at {formatTime(order.scheduledPickupTime)}
        </div>
      ) : null}

      {order.notes ? (
        <div className="rounded-2xl bg-muted/70 px-4 py-3.5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Note: </span>
          {order.notes}
        </div>
      ) : null}

      <div className="rounded-3xl border border-border bg-card px-5 py-5">
        <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">Items</h2>
        <OrderSummary items={order.items} subtotal={order.subtotal} total={order.total} />
      </div>

      <div className="flex justify-end">
        <StaffStatusActions status={order.status} loading={advance.isPending} onAdvance={() => advance.mutate(order.id)} />
      </div>
    </div>
  );
}
