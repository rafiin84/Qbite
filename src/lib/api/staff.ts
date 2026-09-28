import type { NotificationType, Order, OrderStatus } from "@/types";
import { wait } from "@/lib/mock/latency";
import { mockDb } from "@/lib/mock/db";
import { ApiError, simulateFlakeOnce } from "./errors";

export async function fetchStaffOrders(): Promise<Order[]> {
  await wait(300, 600);
  simulateFlakeOnce("staff-orders", "We couldn't load orders.");
  return [...mockDb.orders].sort(
    (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime(),
  );
}

export async function fetchLiveQueue(): Promise<{ preparing: Order[]; ready: Order[] }> {
  await wait(300, 550);
  simulateFlakeOnce("staff-live-queue", "We couldn't load the live queue.");
  const preparing = mockDb.orders
    .filter((o) => o.status === "preparing")
    .sort((a, b) => (a.queuePosition ?? 0) - (b.queuePosition ?? 0));
  const ready = mockDb.orders
    .filter((o) => o.status === "ready")
    .sort((a, b) => new Date(a.readyAt ?? a.orderTime).getTime() - new Date(b.readyAt ?? b.orderTime).getTime());
  return { preparing, ready };
}

export async function fetchUpcomingPreorders(): Promise<Order[]> {
  await wait(300, 550);
  simulateFlakeOnce("staff-upcoming", "We couldn't load upcoming pre-orders.");
  return mockDb.orders
    .filter((o) => o.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledPickupTime ?? a.orderTime).getTime() -
        new Date(b.scheduledPickupTime ?? b.orderTime).getTime(),
    );
}

export async function fetchStaffOrderById(orderId: string): Promise<Order> {
  await wait(200, 400);
  simulateFlakeOnce(`staff-order-${orderId}`, "We couldn't load this order.");
  const order = mockDb.orders.find((o) => o.id === orderId);
  if (!order) throw new ApiError("We couldn't find that order.");
  return order;
}

const nextStatusFor: Partial<Record<OrderStatus, OrderStatus>> = {
  scheduled: "preparing",
  preparing: "ready",
  ready: "collected",
};

export async function advanceOrderStatus(orderId: string): Promise<Order> {
  await wait(350, 650);
  const order = mockDb.orders.find((o) => o.id === orderId);
  if (!order) throw new ApiError("We couldn't find that order.");

  const next = nextStatusFor[order.status];
  if (!next) throw new ApiError(`Order #${order.orderNumber} has no further status to advance to.`);

  const now = new Date().toISOString();
  const updated: Order = {
    ...order,
    status: next,
    activatedAt: next === "preparing" ? order.activatedAt ?? now : order.activatedAt,
    readyAt: next === "ready" ? now : order.readyAt,
    collectedAt: next === "collected" ? now : order.collectedAt,
  };

  mockDb.setOrders(mockDb.orders.map((o) => (o.id === orderId ? updated : o)));

  const notifType: NotificationType =
    next === "ready" ? "order_ready" : next === "preparing" ? "order_preparing" : "order_collected";
  const notification = {
    id: `notif-${Date.now()}`,
    userId: order.customerId,
    orderId: order.id,
    type: notifType,
    title:
      next === "ready" ? "Ready for collection" : next === "preparing" ? "Now preparing" : "Order collected",
    message:
      next === "ready"
        ? `Your order #${order.orderNumber} is ready for collection.`
        : next === "preparing"
          ? `Your order #${order.orderNumber} is being prepared.`
          : `Your order #${order.orderNumber} was collected. Enjoy your meal!`,
    read: false,
    createdAt: now,
  };
  mockDb.setNotifications([notification, ...mockDb.notifications]);

  return mockDb.orders.find((o) => o.id === orderId)!;
}
