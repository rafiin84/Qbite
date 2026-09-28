"use client";

import { ChefHat, Package } from "@phosphor-icons/react/dist/ssr";
import { useLiveQueue } from "@/features/staff/hooks";
import { QueueColumn } from "@/components/staff/queue-column";
import { StaffOrderCard } from "@/components/staff/staff-order-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffQueuePage() {
  const liveQueueQuery = useLiveQueue();

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Live Queue</h1>
        <p className="text-sm text-muted-foreground">Orders currently in preparation, in the order they came in.</p>
      </div>

      {liveQueueQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      ) : liveQueueQuery.isError ? (
        <ErrorState title="We couldn't load the live queue" onRetry={() => liveQueueQuery.refetch()} />
      ) : liveQueueQuery.data ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <QueueColumn
            title="Preparing"
            count={liveQueueQuery.data.preparing.length}
            icon={ChefHat}
            accentClassName="bg-status-preparing-soft text-status-preparing-foreground"
          >
            {liveQueueQuery.data.preparing.length === 0 ? (
              <EmptyState icon={ChefHat} title="Nothing in preparation" />
            ) : (
              liveQueueQuery.data.preparing.map((order) => <StaffOrderCard key={order.id} order={order} />)
            )}
          </QueueColumn>

          <QueueColumn
            title="Ready for collection"
            count={liveQueueQuery.data.ready.length}
            icon={Package}
            accentClassName="bg-status-ready-soft text-status-ready-foreground"
          >
            {liveQueueQuery.data.ready.length === 0 ? (
              <EmptyState icon={Package} title="Nothing ready yet" />
            ) : (
              liveQueueQuery.data.ready.map((order) => <StaffOrderCard key={order.id} order={order} />)
            )}
          </QueueColumn>
        </div>
      ) : null}
    </div>
  );
}
