import { formatCurrency } from "@/lib/utils/format";

export function CartSummary({ subtotal, total }: { subtotal: number; total: number }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-muted/70 px-4 py-3.5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span className="tabular-nums">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between font-heading text-lg font-semibold text-foreground">
        <span>Total</span>
        <span className="tabular-nums">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
