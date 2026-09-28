import type { Order, OrderItem, OrderMode } from "@/types";
import { wait } from "@/lib/mock/latency";
import { mockDb, staticData } from "@/lib/mock/db";
import { nextOrderNumber } from "@/lib/mock/order-number";
import { ApiError, simulateFlakeOnce } from "./errors";

export async function fetchOrdersForUser(userId: string): Promise<Order[]> {
  await wait(300, 600);
  simulateFlakeOnce(`orders-${userId}`, "We couldn't load your orders.");
  return mockDb.orders
    .filter((o) => o.customerId === userId)
    .sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  await wait(200, 450);
  simulateFlakeOnce(`order-${orderId}`, "We couldn't load this order.");
  const order = mockDb.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) {
    throw new ApiError("We couldn't find that order.");
  }
  return order;
}

/** The single most relevant non-collected order for a user, for Home/quick-access surfacing. */
export async function fetchActiveOrderForUser(userId: string): Promise<Order | undefined> {
  await wait(250, 500);
  const active = mockDb.orders
    .filter((o) => o.customerId === userId && o.status !== "collected")
    .sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());

  const priority: Record<Order["status"], number> = { ready: 0, preparing: 1, scheduled: 2, collected: 3 };
  return active.sort((a, b) => priority[a.status] - priority[b.status])[0];
}

export interface PlaceOrderInput {
  customerId: string;
  customerName: string;
  items: { menuItemId: string; quantity: number }[];
  mode: OrderMode;
  scheduledPickupTime?: string;
  notes?: string;
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  await wait(500, 950);

  if (input.items.length === 0) {
    throw new ApiError("Your cart is empty.");
  }

  const lineItems: OrderItem[] = input.items.map(({ menuItemId, quantity }) => {
    const menuItem = staticData.menuItems.find((m) => m.id === menuItemId);
    if (!menuItem) throw new ApiError("One of the items in your cart is no longer available.");
    if (!menuItem.available) throw new ApiError(`${menuItem.name} just went unavailable. Please remove it from your cart.`);
    return {
      menuItemId,
      name: menuItem.name,
      quantity,
      unitPrice: menuItem.price,
      subtotal: menuItem.price * quantity,
    };
  });

  const subtotal = lineItems.reduce((sum, i) => sum + i.subtotal, 0);
  const now = new Date().toISOString();
  const isPreorder = input.mode === "preorder";

  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber: nextOrderNumber(),
    customerId: input.customerId,
    customerName: input.customerName,
    canteenId: staticData.canteen.id,
    items: lineItems,
    subtotal,
    total: subtotal,
    mode: input.mode,
    status: isPreorder ? "scheduled" : "preparing",
    orderTime: now,
    activatedAt: isPreorder ? undefined : now,
    scheduledPickupTime: isPreorder ? input.scheduledPickupTime : undefined,
    notes: input.notes,
  };

  mockDb.setOrders([...mockDb.orders, order]);

  const notification = {
    id: `notif-${Date.now()}`,
    userId: input.customerId,
    orderId: order.id,
    type: isPreorder ? ("order_placed" as const) : ("order_preparing" as const),
    title: isPreorder ? "Pre-order scheduled" : "Order placed",
    message: isPreorder
      ? `Your order #${order.orderNumber} is scheduled for pickup.`
      : `Your order #${order.orderNumber} is being prepared.`,
    read: false,
    createdAt: now,
  };
  mockDb.setNotifications([notification, ...mockDb.notifications]);

  return mockDb.orders.find((o) => o.id === order.id)!;
}
