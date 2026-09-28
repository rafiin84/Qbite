import { cn } from "@/lib/utils";

/** The familiar green/brown square used across Indian menus to mark veg vs non-veg. */
export function VegIndicator({ isVeg, className }: { isVeg: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] border",
        isVeg ? "border-status-ready" : "border-destructive",
        className,
      )}
      role="img"
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span className={cn("size-2 rounded-full", isVeg ? "bg-status-ready" : "bg-destructive")} />
    </span>
  );
}
