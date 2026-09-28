import type { AppNotification } from "@/types";
import { wait } from "@/lib/mock/latency";
import { mockDb } from "@/lib/mock/db";
import { simulateFlakeOnce } from "./errors";

export async function fetchNotifications(userId: string): Promise<AppNotification[]> {
  await wait(300, 600);
  simulateFlakeOnce(`notifications-${userId}`, "We couldn't load your notifications.");
  return mockDb.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(id: string): Promise<void> {
  await wait(120, 250);
  mockDb.setNotifications(
    mockDb.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  );
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await wait(150, 300);
  mockDb.setNotifications(
    mockDb.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
  );
}
