import type { Icon } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function QueueColumn({
  title,
  count,
  icon: IconComponent,
  accentClassName,
  children,
  className,
}: {
  title: string;
  count: number;
  icon: Icon;
  accentClassName?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-1 flex-col gap-3 rounded-3xl bg-muted/50 p-4", className)}>
      <header className="flex items-center gap-2">
        <span className={cn("flex size-8 items-center justify-center rounded-full", accentClassName)}>
          <IconComponent weight="bold" className="size-4" aria-hidden />
        </span>
        <h2 className="font-heading text-sm font-semibold text-foreground">{title}</h2>
        <span className="ml-auto rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
          {count}
        </span>
      </header>
      <div className="flex flex-col gap-2.5">
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </div>
    </section>
  );
}
