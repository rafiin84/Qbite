"use client";

import Link from "next/link";
import { ChefHat, Package, Clock, CheckCircle, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useLiveQueue, useUpcomingPreorders, useStaffOrders } from "@/features/staff/hooks";
import { StaffOrderCard } from "@/components/staff/staff-order-card";
import { UpcomingOrderCard } from "@/components/staff/upcoming-order-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";

function StatTile({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof ChefHat;
  accent: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4">
      <span className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon weight="bold" className="size-5" aria-hidden />
      </span>
      <div className="flex flex-col">
        <span className="font-heading text-2xl font-semibold tabular-nums text-foreground">{value}</span>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const liveQueueQuery = useLiveQueue();
  const upcomingQuery = useUpcomingPreorders();
  const staffOrdersQuery = useStaffOrders();

  const collectedToday = staffOrdersQuery.data?.filter((o) => o.status === "collected").length ?? 0;

  if (liveQueueQuery.isLoading || upcomingQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (liveQueueQuery.isError || upcomingQuery.isError) {
    return (
      <ErrorState
        title="We couldn't load the dashboard"
        onRetry={() => {
          liveQueueQuery.refetch();
          upcomingQuery.refetch();
        }}
      />
    );
  }

  const preparing = liveQueueQuery.data?.preparing ?? [];
  const ready = liveQueueQuery.data?.ready ?? [];
  const upcoming = upcomingQuery.data ?? [];
  const needsAttention = [...ready, ...preparing].slice(0, 4);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your live operational snapshot for Main Canteen.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Preparing" value={preparing.length} icon={ChefHat} accent="bg-status-preparing-soft text-status-preparing-foreground" />
        <StatTile label="Ready" value={ready.length} icon={Package} accent="bg-status-ready-soft text-status-ready-foreground" />
        <StatTile label="Upcoming" value={upcoming.length} icon={Clock} accent="bg-status-scheduled-soft text-status-scheduled-foreground" />
        <StatTile label="Collected today" value={collectedToday} icon={CheckCircle} accent="bg-status-collected-soft text-status-collected-foreground" />
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Needs attention</h2>
          <Link href="/staff/queue" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            View live queue
            <CaretRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        {needsAttention.length === 0 ? (
          <EmptyState icon={CheckCircle} title="All caught up" description="No active orders right now." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {needsAttention.map((order) => (
              <StaffOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-foreground">Upcoming pre-orders</h2>
          <Link href="/staff/upcoming" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            View all
            <CaretRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState icon={Clock} title="No upcoming pre-orders" description="Scheduled orders will appear here." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.slice(0, 3).map((order) => (
              <UpcomingOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
