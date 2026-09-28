"use client";

import { Bell, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { useSessionStore } from "@/store/session-store";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/features/notifications/hooks";
import { NotificationCard } from "@/components/feedback/notification-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const consumer = useSessionStore((s) => s.consumer);
  const notificationsQuery = useNotifications(consumer?.id);
  const markRead = useMarkNotificationRead(consumer?.id);
  const markAllRead = useMarkAllNotificationsRead(consumer?.id);

  const unreadCount = notificationsQuery.data?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()} className="gap-1.5 text-muted-foreground">
            <CheckCircle className="size-4" aria-hidden />
            Mark all read
          </Button>
        )}
      </div>

      {notificationsQuery.isLoading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : notificationsQuery.isError ? (
        <ErrorState
          title="We couldn't load your notifications"
          description="Something went wrong. Please try again."
          onRetry={() => notificationsQuery.refetch()}
        />
      ) : notificationsQuery.data && notificationsQuery.data.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="Updates about your orders will show up here." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {notificationsQuery.data!.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onOpen={(n) => !n.read && markRead.mutate(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
