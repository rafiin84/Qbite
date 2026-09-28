import { CalendarBlank, Clock } from "@phosphor-icons/react/dist/ssr";
import { formatTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export function PickupTime({
  iso,
  label = "Scheduled pickup",
  className,
}: {
  iso: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 rounded-2xl bg-status-scheduled-soft px-4 py-3", className)}>
      <CalendarBlank className="size-5 text-status-scheduled-foreground" weight="bold" aria-hidden />
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-medium uppercase tracking-wide text-status-scheduled-foreground/80">
          {label}
        </span>
        <span className="flex items-center gap-1 text-base font-semibold text-status-scheduled-foreground">
          <Clock className="size-4" aria-hidden />
          {formatTime(iso)}
        </span>
      </div>
    </div>
  );
}
