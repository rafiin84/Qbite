import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  action,
  className,
}: {
  icon: Icon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <IconComponent className="size-7 text-muted-foreground" weight="duotone" aria-hidden />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        {description ? <p className="max-w-xs text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
