import type { AppNotification, Order } from "@/types";
import { canteen, institution } from "./seed-institution";
import { categories, menuItems } from "./seed-menu";
import { consumers, staffMembers } from "./seed-users";
import { initialOrders } from "./seed-orders";
import { recalculateQueue } from "./queue-engine";

/**
 * A tiny in-memory + localStorage-backed "database" standing in for a real
 * backend. Only lib/api/* is meant to read or write this module -- it is
 * the mock persistence layer, not application state.
 */

const STORAGE_KEY = "qbite.mockdb.v1";

interface DbShape {
  orders: Order[];
  notifications: AppNotification[];
  canteenStatus: "open" | "closed";
}

function seedNotifications(): AppNotification[] {
  const arjun = consumers[0];
  const priya = consumers[1];
  const now = Date.now();
  return [
    {
      id: "notif-1",
      userId: arjun.id,
      orderId: "order-1042",
      type: "order_preparing",
      title: "Order confirmed",
      message: "Your order #QB1042 is being prepared.",
      read: false,
      createdAt: new Date(now - 4 * 60_000).toISOString(),
    },
    {
      id: "notif-2",
      userId: priya.id,
      orderId: "order-1038",
      type: "order_ready",
      title: "Ready for collection",
      message: "Your order #QB1038 is ready for collection.",
      read: false,
      createdAt: new Date(now - 60_000).toISOString(),
    },
    {
      id: "notif-3",
      userId: priya.id,
      orderId: "order-1044",
      type: "order_placed",
      title: "Pre-order scheduled",
      message: "Your order #QB1044 is scheduled for pickup later today.",
      read: true,
      createdAt: new Date(now - 20 * 60_000).toISOString(),
    },
    {
      id: "notif-4",
      userId: arjun.id,
      orderId: "order-1035",
      type: "order_collected",
      title: "Order collected",
      message: "Your order #QB1035 was collected. Enjoy your meal!",
      read: true,
      createdAt: new Date(now - 24 * 60 * 60_000).toISOString(),
    },
  ];
}

function freshDb(): DbShape {
  return {
    orders: recalculateQueue(initialOrders, canteen),
    notifications: seedNotifications(),
    canteenStatus: canteen.status,
  };
}

function load(): DbShape {
  if (typeof window === "undefined") return freshDb();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshDb();
    const parsed = JSON.parse(raw) as DbShape;
    if (!Array.isArray(parsed.orders) || !Array.isArray(parsed.notifications)) {
      return freshDb();
    }
    return parsed;
  } catch {
    return freshDb();
  }
}

function persist(next: DbShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // best-effort persistence only
  }
}

// In-memory cache for the current tab; re-read from localStorage on every
// access so a second tab (e.g. staff dashboard next to consumer tracking)
// picks up mutations made elsewhere once its own polling refetch fires.
let cached: DbShape = load();

export const mockDb = {
  get orders() {
    cached = load();
    return cached.orders;
  },
  get notifications() {
    cached = load();
    return cached.notifications;
  },
  get canteenStatus() {
    cached = load();
    return cached.canteenStatus;
  },
  setOrders(next: Order[]) {
    cached = { ...load(), orders: recalculateQueue(next, canteen) };
    persist(cached);
  },
  setNotifications(next: AppNotification[]) {
    cached = { ...load(), notifications: next };
    persist(cached);
  },
  setCanteenStatus(next: "open" | "closed") {
    cached = { ...load(), canteenStatus: next };
    persist(cached);
  },
  reset() {
    cached = freshDb();
    persist(cached);
  },
};

export const staticData = {
  institution,
  canteen,
  categories,
  menuItems,
  consumers,
  staffMembers,
};
