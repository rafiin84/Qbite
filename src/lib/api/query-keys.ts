export const queryKeys = {
  canteen: ["canteen"] as const,
  menu: ["menu"] as const,
  menuItem: (id: string) => ["menu", "item", id] as const,
  orders: (userId: string) => ["orders", userId] as const,
  order: (orderId: string) => ["orders", "detail", orderId] as const,
  activeOrder: (userId: string) => ["orders", "active", userId] as const,
  notifications: (userId: string) => ["notifications", userId] as const,
  staffOrders: ["staff", "orders"] as const,
  staffLiveQueue: ["staff", "live-queue"] as const,
  staffUpcoming: ["staff", "upcoming"] as const,
  staffOrder: (orderId: string) => ["staff", "orders", orderId] as const,
};
