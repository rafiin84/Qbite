/**
 * QBite domain models -- shared between the mock API layer and the UI.
 * These shapes are the contract a real backend would implement in Phase 2.
 */

export type UserRole = "consumer" | "staff" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  institutionId: string;
  canteenId: string;
  avatarUrl?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "staff";
  canteenId: string;
  title: string;
  avatarUrl?: string;
}

export interface Institution {
  id: string;
  name: string;
  logoUrl?: string;
  location: string;
  canteenIds: string[];
}

export type CanteenOperatingStatus = "open" | "closed";

export interface OperatingHours {
  opensAt: string; // "08:00"
  closesAt: string; // "18:00"
}

export interface PickupWindow {
  startsAt: string; // "12:00"
  endsAt: string; // "14:30"
}

export interface Canteen {
  id: string;
  institutionId: string;
  name: string;
  description: string;
  status: CanteenOperatingStatus;
  operatingHours: OperatingHours;
  pickupWindow: PickupWindow;
  averagePreparationMinutes: number;
  preparationBufferMinutes: number;
  location: string;
}

export interface MenuCategory {
  id: string;
  canteenId: string;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  canteenId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  preparationMinutes: number;
  isVeg: boolean;
  isPopular?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
}

export type OrderMode = "immediate" | "preorder";

/**
 * "scheduled" only applies to preorders before they enter active preparation.
 * It is a pre-lifecycle state, not a replacement for the core
 * Preparing -> Ready -> Collected flow.
 */
export type OrderStatus = "scheduled" | "preparing" | "ready" | "collected";

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  canteenId: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  mode: OrderMode;
  status: OrderStatus;
  orderTime: string; // ISO timestamp
  scheduledPickupTime?: string; // ISO timestamp, preorder only
  activatedAt?: string; // when a preorder entered the live queue
  readyAt?: string;
  collectedAt?: string;
  queuePosition?: number;
  ordersAhead?: number;
  estimatedWaitMinutes?: number;
  notes?: string;
}

export type NotificationType =
  | "order_placed"
  | "order_preparing"
  | "order_ready"
  | "order_collected";

export interface AppNotification {
  id: string;
  userId: string;
  orderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
