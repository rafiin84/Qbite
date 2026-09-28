import { useQuery } from "@tanstack/react-query";
import { fetchMenu, fetchMenuItem } from "@/lib/api/menu";
import { fetchCanteen } from "@/lib/api/canteen";
import { queryKeys } from "@/lib/api/query-keys";

export function useCanteen() {
  return useQuery({
    queryKey: queryKeys.canteen,
    queryFn: fetchCanteen,
  });
}

export function useMenu() {
  return useQuery({
    queryKey: queryKeys.menu,
    queryFn: fetchMenu,
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: queryKeys.menuItem(id),
    queryFn: () => fetchMenuItem(id),
    enabled: Boolean(id),
  });
}
