import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  advanceOrderStatus,
  fetchLiveQueue,
  fetchStaffOrderById,
  fetchStaffOrders,
  fetchUpcomingPreorders,
} from "@/lib/api/staff";
import { queryKeys } from "@/lib/api/query-keys";

export function useStaffOrders() {
  return useQuery({
    queryKey: queryKeys.staffOrders,
    queryFn: fetchStaffOrders,
    refetchInterval: 8_000,
  });
}

export function useLiveQueue() {
  return useQuery({
    queryKey: queryKeys.staffLiveQueue,
    queryFn: fetchLiveQueue,
    refetchInterval: 6_000,
  });
}

export function useUpcomingPreorders() {
  return useQuery({
    queryKey: queryKeys.staffUpcoming,
    queryFn: fetchUpcomingPreorders,
    refetchInterval: 10_000,
  });
}

export function useStaffOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.staffOrder(orderId ?? ""),
    queryFn: () => fetchStaffOrderById(orderId as string),
    enabled: Boolean(orderId),
    refetchInterval: 6_000,
  });
}

export function useAdvanceOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => advanceOrderStatus(orderId),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staffOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffLiveQueue });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffUpcoming });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffOrder(order.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders(order.customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeOrder(order.customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.order(order.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications(order.customerId) });
    },
  });
}
