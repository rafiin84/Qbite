import type { Order, OrderItem } from "@/types";
import { menuItems } from "./seed-menu";
import { canteen } from "./seed-institution";
import { consumers } from "./seed-users";

const arjun = consumers[0];
const priya = consumers[1];

function itemById(id: string) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) throw new Error(`Unknown seed menu item: ${id}`);
  return item;
}

function line(id: string, quantity: number): OrderItem {
  const item = itemById(id);
  return {
    menuItemId: item.id,
    name: item.name,
    quantity,
    unitPrice: item.price,
    subtotal: item.price * quantity,
  };
}

function totals(items: OrderItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  return { subtotal, total: subtotal };
}

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60_000).toISOString();
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60_000).toISOString();
}

const order1030Items = [line("item-masala-dosa", 1), line("item-filter-coffee", 1)];
const order1033Items = [line("item-chicken-sandwich", 1), line("item-cold-coffee", 1)];
const order1035Items = [line("item-veg-biryani", 1), line("item-gulab-jamun", 2)];
const order1038Items = [line("item-idli-sambar", 1), line("item-chai", 1)];
const order1041Items = [line("item-samosa", 1), line("item-chai", 1)];
const order1042Items = [
  line("item-chicken-fried-rice", 1),
  line("item-brownie", 1),
  line("item-cold-coffee", 1),
];
const order1043Items = [line("item-veg-sandwich", 1)];
const order1044Items = [line("item-masala-dosa", 1), line("item-filter-coffee", 1)];

export const initialOrders: Order[] = [
  {
    id: "order-1030",
    orderNumber: "QB1030",
    customerId: arjun.id,
    customerName: arjun.name,
    canteenId: canteen.id,
    items: order1030Items,
    ...totals(order1030Items),
    mode: "immediate",
    status: "collected",
    orderTime: daysAgo(3),
    readyAt: daysAgo(3),
    collectedAt: daysAgo(3),
  },
  {
    id: "order-1033",
    orderNumber: "QB1033",
    customerId: priya.id,
    customerName: priya.name,
    canteenId: canteen.id,
    items: order1033Items,
    ...totals(order1033Items),
    mode: "immediate",
    status: "collected",
    orderTime: daysAgo(2),
    readyAt: daysAgo(2),
    collectedAt: daysAgo(2),
  },
  {
    id: "order-1035",
    orderNumber: "QB1035",
    customerId: arjun.id,
    customerName: arjun.name,
    canteenId: canteen.id,
    items: order1035Items,
    ...totals(order1035Items),
    mode: "immediate",
    status: "collected",
    orderTime: daysAgo(1),
    readyAt: daysAgo(1),
    collectedAt: daysAgo(1),
  },
  {
    id: "order-1038",
    orderNumber: "QB1038",
    customerId: priya.id,
    customerName: priya.name,
    canteenId: canteen.id,
    items: order1038Items,
    ...totals(order1038Items),
    mode: "immediate",
    status: "ready",
    orderTime: minutesAgo(14),
    activatedAt: minutesAgo(14),
    readyAt: minutesAgo(1),
  },
  {
    id: "order-1041",
    orderNumber: "QB1041",
    customerId: "guest-divya",
    customerName: "Divya Ramesh",
    canteenId: canteen.id,
    items: order1041Items,
    ...totals(order1041Items),
    mode: "immediate",
    status: "preparing",
    orderTime: minutesAgo(6),
    activatedAt: minutesAgo(6),
  },
  {
    id: "order-1042",
    orderNumber: "QB1042",
    customerId: arjun.id,
    customerName: arjun.name,
    canteenId: canteen.id,
    items: order1042Items,
    ...totals(order1042Items),
    mode: "immediate",
    status: "preparing",
    orderTime: minutesAgo(4),
    activatedAt: minutesAgo(4),
  },
  {
    id: "order-1043",
    orderNumber: "QB1043",
    customerId: "guest-naveen",
    customerName: "Naveen Shetty",
    canteenId: canteen.id,
    items: order1043Items,
    ...totals(order1043Items),
    mode: "immediate",
    status: "preparing",
    orderTime: minutesAgo(2),
    activatedAt: minutesAgo(2),
  },
  {
    id: "order-1044",
    orderNumber: "QB1044",
    customerId: priya.id,
    customerName: priya.name,
    canteenId: canteen.id,
    items: order1044Items,
    ...totals(order1044Items),
    mode: "preorder",
    status: "scheduled",
    orderTime: minutesAgo(20),
    scheduledPickupTime: hoursFromNow(3),
  },
];
