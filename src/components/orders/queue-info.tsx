"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Timer } from "@phosphor-icons/react/dist/ssr";
import { formatMinutes, pluralize } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export function QueueInfo({
  ordersAhead,
  estimatedWaitMinutes,
  className,
}: {
  ordersAhead: number;
  estimatedWaitMinutes: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <div className="rounded-2xl bg-muted/70 px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="size-4" weight="bold" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-wide">Orders ahead</span>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.p
            key={ordersAhead}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-1 text-2xl font-semibold tabular-nums text-foreground"
          >
            {ordersAhead}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {pluralize(ordersAhead, "order")}
            </span>
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="rounded-2xl bg-muted/70 px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Timer className="size-4" weight="bold" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-wide">Estimated wait</span>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.p
            key={estimatedWaitMinutes}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-1 text-2xl font-semibold tabular-nums text-foreground"
          >
            {formatMinutes(estimatedWaitMinutes)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
