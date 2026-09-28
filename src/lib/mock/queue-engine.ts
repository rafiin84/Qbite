import type { Canteen, Order } from "@/types";

/**
 * Deterministic per-order jitter so estimates feel realistic (not identical
 * across every order) while staying stable across re-renders. This is a
 * mock stand-in for a real queue-prediction service -- not machine learning.
 */
function jitterMinutes(orderId: string, spread = 2): number {
  let hash = 0;
  for (let i = 0; i < orderId.length; i++) {
    hash = (hash * 31 + orderId.charCodeAt(i)) & 0xffffffff;
  }
  const normalized = (Math.abs(hash) % 100) / 100; // 0..1
  return Math.round((normalized - 0.5) * 2 * spread);
}

/**
 * Recomputes queue position, orders-ahead, and estimated wait for every
 * "preparing" order, in FIFO order of when they entered active preparation.
 * Ready/collected/scheduled orders have their live-queue fields cleared.
 */
export function recalculateQueue(orders: Order[], canteen: Canteen): Order[] {
  const preparing = orders
    .filter((o) => o.status === "preparing")
    .sort((a, b) => {
      const aTime = new Date(a.activatedAt ?? a.orderTime).getTime();
      const bTime = new Date(b.activatedAt ?? b.orderTime).getTime();
      return aTime - bTime;
    });

  const preparingIds = new Set(preparing.map((o) => o.id));

  return orders.map((order) => {
    if (!preparingIds.has(order.id)) {
      return {
        ...order,
        queuePosition: undefined,
        ordersAhead: undefined,
        estimatedWaitMinutes: undefined,
      };
    }

    const position = preparing.findIndex((o) => o.id === order.id);
    const ordersAhead = position;
    const itemFactor = order.items.reduce((sum, item) => sum + item.quantity, 0) > 3 ? 1 : 0;
    const base =
      ordersAhead * canteen.averagePreparationMinutes +
      canteen.preparationBufferMinutes +
      itemFactor;
    const estimatedWaitMinutes = Math.max(2, base + jitterMinutes(order.id));

    return {
      ...order,
      queuePosition: position + 1,
      ordersAhead,
      estimatedWaitMinutes,
    };
  });
}

export function isCanteenOpenNow(canteen: Canteen, now: Date = new Date()): boolean {
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = canteen.operatingHours.opensAt.split(":").map(Number);
  const [closeH, closeM] = canteen.operatingHours.closesAt.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  return minutesNow >= openMinutes && minutesNow < closeMinutes;
}

export function pickupWindowToday(canteen: Canteen, now: Date = new Date()) {
  const [startH, startM] = canteen.pickupWindow.startsAt.split(":").map(Number);
  const [endH, endM] = canteen.pickupWindow.endsAt.split(":").map(Number);
  const start = new Date(now);
  start.setHours(startH, startM, 0, 0);
  const end = new Date(now);
  end.setHours(endH, endM, 0, 0);
  if (end <= now) {
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
  }
  return { start, end };
}
