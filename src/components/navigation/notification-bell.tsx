"use client";

import Link from "next/link";
import { Bell } from "@phosphor-icons/react/dist/ssr";
import { useSessionStore } from "@/store/session-store";
import { useNotifications } from "@/features/notifications/hooks";
import { cn } from "@/lib/utils";

export function NotificationBell({ className }: { className?: string }) {
  const consumer = useSessionStore((s) => s.consumer);
  const { data: notifications } = useNotifications(consumer?.id);
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <Link
      href="/notifications"
      aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-accent",
        className,
      )}
    >
      <Bell className="size-5" weight="bold" aria-hidden />
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-2.5 rounded-full bg-status-ready ring-2 ring-background" />
      )}
    </Link>
  );
}
