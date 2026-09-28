import type { OrderStatus } from "@/types";
import { orderStatusConfig } from "@/features/orders/status";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({
  status,
  size = "md",
  className,
}: {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const config = orderStatusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" && "px-2.5 py-1 text-xs",
        size === "md" && "px-3 py-1.5 text-sm",
        size === "lg" && "px-4 py-2 text-base",
        className,
      )}
      style={{
        backgroundColor: config.softVar,
        color: config.foregroundVar,
      }}
    >
      <Icon
        weight={status === "ready" ? "fill" : "bold"}
        className={cn(size === "sm" && "size-3.5", size === "md" && "size-4", size === "lg" && "size-5")}
        aria-hidden
      />
      {config.label}
    </span>
  );
}
