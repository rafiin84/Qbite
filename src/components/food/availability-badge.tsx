import { XCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({ available, className }: { available: boolean; className?: string }) {
  if (available) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-sm",
        className,
      )}
    >
      <XCircle weight="fill" className="size-3.5" aria-hidden />
      Unavailable
    </span>
  );
}
