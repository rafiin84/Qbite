"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react/dist/ssr";
import type { OrderStatus } from "@/types";
import { orderTimelineLabels, statusStepIndex } from "@/features/orders/status";
import { cn } from "@/lib/utils";

export function OrderTimeline({ status, className }: { status: OrderStatus; className?: string }) {
  const activeIndex = statusStepIndex(status);

  return (
    <ol className={cn("flex items-start", className)} aria-label="Order progress">
      {orderTimelineLabels.map((label, index) => {
        const isDone = index <= activeIndex;
        const isCurrent = index === activeIndex;
        const isLast = index === orderTimelineLabels.length - 1;

        return (
          <li key={label} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span className="sr-only">{isDone ? "Complete: " : "Pending: "}</span>
              <motion.span
                initial={false}
                animate={{
                  backgroundColor: isDone ? "var(--primary)" : "var(--muted)",
                  scale: isCurrent ? 1.08 : 1,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full ring-4",
                  isCurrent ? "ring-primary/15" : "ring-transparent",
                )}
              >
                {isDone ? (
                  <Check weight="bold" className="size-3.5 text-primary-foreground" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                )}
              </motion.span>
              {!isLast ? (
                <motion.span
                  initial={false}
                  animate={{ backgroundColor: index < activeIndex ? "var(--primary)" : "var(--border)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mx-1 h-0.5 flex-1 rounded-full"
                />
              ) : null}
            </div>
            <span
              className={cn(
                "mt-2 text-center text-xs font-medium",
                isDone ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
