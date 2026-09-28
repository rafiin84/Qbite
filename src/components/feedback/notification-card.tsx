"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, BellRinging, CheckCircle, ChefHat, Clock } from "@phosphor-icons/react/dist/ssr";
import type { AppNotification, NotificationType } from "@/types";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const iconByType: Record<NotificationType, typeof Bell> = {
  order_placed: Clock,
  order_preparing: ChefHat,
  order_ready: BellRinging,
  order_collected: CheckCircle,
};

export function NotificationCard({
  notification,
  onOpen,
}: {
  notification: AppNotification;
  onOpen?: (notification: AppNotification) => void;
}) {
  const Icon = iconByType[notification.type];
  const isPriority = notification.type === "order_ready" && !notification.read;

  const content = (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors",
        isPriority
          ? "border-status-ready/40 bg-status-ready-soft"
          : notification.read
            ? "border-border bg-card"
            : "border-primary/25 bg-accent/40",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          isPriority ? "bg-status-ready text-white" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon weight={isPriority ? "fill" : "bold"} className="size-[18px]" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("text-sm font-semibold text-foreground", isPriority && "text-status-ready-foreground")}>
            {notification.title}
          </p>
          {!notification.read && <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/70">{formatRelativeTime(notification.createdAt)}</p>
      </div>
    </motion.div>
  );

  if (notification.orderId) {
    return (
      <Link href={`/orders/${notification.orderId}`} onClick={() => onOpen?.(notification)} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
