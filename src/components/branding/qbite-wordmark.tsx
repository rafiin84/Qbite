import { cn } from "@/lib/utils";
import { QBiteLogo } from "./qbite-logo";

export function QBiteWordmark({
  className,
  showTagline = false,
  size = 32,
}: {
  className?: string;
  showTagline?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <QBiteLogo size={size} />
      <div className="flex flex-col leading-none">
        <span
          className="font-heading font-semibold tracking-tight text-foreground"
          style={{ fontSize: size * 0.62 }}
        >
          QBite
        </span>
        {showTagline ? (
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            Order. Track. Collect.
          </span>
        ) : null}
      </div>
    </div>
  );
}
