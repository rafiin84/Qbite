import type { OrderStatus } from "@/types";
import { Clock, ChefHat, Package, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export interface StatusConfig {
  label: string;
  shortLabel: string;
  description: string;
  icon: Icon;
  colorVar: string;
  softVar: string;
  foregroundVar: string;
}

export const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  scheduled: {
    label: "Scheduled",
    shortLabel: "Scheduled",
    description: "Your pre-order is confirmed and will begin preparation closer to pickup.",
    icon: Clock,
    colorVar: "var(--status-scheduled)",
    softVar: "var(--status-scheduled-soft)",
    foregroundVar: "var(--status-scheduled-foreground)",
  },
  preparing: {
    label: "Preparing",
    shortLabel: "Preparing",
    description: "The canteen has received your order and is preparing it now.",
    icon: ChefHat,
    colorVar: "var(--status-preparing)",
    softVar: "var(--status-preparing-soft)",
    foregroundVar: "var(--status-preparing-foreground)",
  },
  ready: {
    label: "Ready for collection",
    shortLabel: "Ready",
    description: "Your order is ready. Head to the canteen to collect it.",
    icon: Package,
    colorVar: "var(--status-ready)",
    softVar: "var(--status-ready-soft)",
    foregroundVar: "var(--status-ready-foreground)",
  },
  collected: {
    label: "Collected",
    shortLabel: "Collected",
    description: "This order has been collected.",
    icon: CheckCircle,
    colorVar: "var(--status-collected)",
    softVar: "var(--status-collected-soft)",
    foregroundVar: "var(--status-collected-foreground)",
  },
};

/**
 * The four-step operational timeline shown on tracking screens. "scheduled"
 * maps to step 0 (Order Placed) -- pre-orders don't get their own row, they
 * get a "Scheduled for ..." banner above this timeline instead.
 */
export const orderTimelineLabels = ["Order Placed", "Preparing", "Ready", "Collected"] as const;

const statusOrder: OrderStatus[] = ["scheduled", "preparing", "ready", "collected"];

/** Returns the index a status has reached in the lifecycle, for timeline rendering. */
export function statusStepIndex(status: OrderStatus): number {
  return statusOrder.indexOf(status);
}
