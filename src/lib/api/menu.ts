import type { MenuCategory, MenuItem } from "@/types";
import { wait } from "@/lib/mock/latency";
import { staticData } from "@/lib/mock/db";
import { ApiError, simulateFlakeOnce } from "./errors";

export interface MenuResponse {
  categories: MenuCategory[];
  items: MenuItem[];
}

export async function fetchMenu(): Promise<MenuResponse> {
  await wait(400, 800);
  simulateFlakeOnce("menu", "We couldn't load the menu.");
  return {
    categories: [...staticData.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    items: staticData.menuItems,
  };
}

export async function fetchMenuItem(id: string): Promise<MenuItem> {
  await wait(200, 450);
  simulateFlakeOnce(`menu-item-${id}`, "We couldn't load this item.");
  const item = staticData.menuItems.find((i) => i.id === id);
  if (!item) {
    throw new ApiError("This item is no longer on the menu.");
  }
  return item;
}
