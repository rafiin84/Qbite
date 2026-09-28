"use client";

import { Clock } from "@phosphor-icons/react/dist/ssr";
import { useUpcomingPreorders } from "@/features/staff/hooks";
import { UpcomingOrderCard } from "@/components/staff/upcoming-order-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { FoodGridSkeleton } from "@/components/feedback/loading-state";

export default function StaffUpcomingPage() {
  const upcomingQuery = useUpcomingPreorders();

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Upcoming Pre-orders</h1>
        <p className="text-sm text-muted-foreground">Sorted by scheduled pickup time, soonest first.</p>
      </div>

      {upcomingQuery.isLoading ? (
        <FoodGridSkeleton count={4} />
      ) : upcomingQuery.isError ? (
        <ErrorState title="We couldn't load upcoming pre-orders" onRetry={() => upcomingQuery.refetch()} />
      ) : !upcomingQuery.data || upcomingQuery.data.length === 0 ? (
        <EmptyState icon={Clock} title="No upcoming pre-orders" description="Scheduled orders will appear here as they come in." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingQuery.data.map((order) => (
            <UpcomingOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
