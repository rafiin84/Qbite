"use client";

import { Clock } from "@phosphor-icons/react/dist/ssr";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils/format";

export function TimePicker({
  windowStart,
  windowEnd,
  value,
  onChange,
  step = 5,
}: {
  windowStart: Date;
  windowEnd: Date;
  value: Date;
  onChange: (date: Date) => void;
  step?: number;
}) {
  const totalMinutes = Math.round((windowEnd.getTime() - windowStart.getTime()) / 60_000);
  const selectedMinutes = Math.round((value.getTime() - windowStart.getTime()) / 60_000);

  function handleChange(value: number | readonly number[]) {
    const minutes = Array.isArray(value) ? value[0] : (value as number);
    const next = new Date(windowStart.getTime() + minutes * 60_000);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Pickup window</span>
        <span className="tabular-nums">
          {formatTime(windowStart)} – {formatTime(windowEnd)}
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-brand-soft px-4 py-3.5">
        <Clock className="size-5 text-brand-soft-foreground" weight="bold" aria-hidden />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-soft-foreground/80">
            Selected pickup
          </span>
          <span className="font-heading text-xl font-semibold tabular-nums text-brand-soft-foreground">
            {formatTime(value)}
          </span>
        </div>
      </div>

      <Slider
        value={[selectedMinutes]}
        min={0}
        max={totalMinutes}
        step={step}
        onValueChange={handleChange}
        aria-label="Pickup time"
        aria-valuetext={formatTime(value)}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatTime(windowStart)}</span>
        <span>{formatTime(windowEnd)}</span>
      </div>
    </div>
  );
}
