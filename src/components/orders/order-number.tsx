import { cn } from "@/lib/utils";

export function OrderNumber({
  value,
  size = "md",
  className,
}: {
  value: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-heading font-semibold tabular-nums tracking-tight text-foreground",
        size === "sm" && "text-base",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl",
        size === "xl" && "text-4xl",
        className,
      )}
    >
      #{value}
    </span>
  );
}
