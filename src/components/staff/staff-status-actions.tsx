"use client";

import { ChefHat, Package, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import type { OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";

const actionConfig: Partial<Record<OrderStatus, { label: string; icon: typeof ChefHat }>> = {
  scheduled: { label: "Start Preparing", icon: ChefHat },
  preparing: { label: "Mark Ready", icon: Package },
  ready: { label: "Mark Collected", icon: CheckCircle },
};

export function StaffStatusActions({
  status,
  onAdvance,
  loading,
  size = "default",
}: {
  status: OrderStatus;
  onAdvance: () => void;
  loading?: boolean;
  size?: "default" | "sm";
}) {
  const action = actionConfig[status];
  if (!action) return null;
  const Icon = action.icon;

  return (
    <Button onClick={onAdvance} disabled={loading} size={size} className="gap-1.5">
      <Icon weight="bold" className="size-4" aria-hidden />
      {loading ? "Updating…" : action.label}
    </Button>
  );
}
