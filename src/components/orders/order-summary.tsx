import type { OrderItem } from "@/types";
import { formatCurrency } from "@/lib/utils/format";

export function OrderSummary({
  items,
  subtotal,
  total,
}: {
  items: OrderItem[];
  subtotal: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-foreground">
              <span className="font-medium tabular-nums text-muted-foreground">{item.quantity}×</span>{" "}
              {item.name}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{formatCurrency(item.subtotal)}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1.5 border-t border-dashed border-border pt-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-foreground">
          <span>Total</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
