import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchActiveOrderForUser,
  fetchOrderById,
  fetchOrdersForUser,
  placeOrder,
  type PlaceOrderInput,
} from "@/lib/api/orders";
import { queryKeys } from "@/lib/api/query-keys";

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders(userId ?? ""),
    queryFn: () => fetchOrdersForUser(userId as string),
    enabled: Boolean(userId),
  });
}

export function useActiveOrder(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activeOrder(userId ?? ""),
    queryFn: () => fetchActiveOrderForUser(userId as string),
    enabled: Boolean(userId),
    refetchInterval: 8_000,
  });
}

export function useOrder(orderId: string | undefined, options?: { live?: boolean }) {
  return useQuery({
    queryKey: queryKeys.order(orderId ?? ""),
    queryFn: () => fetchOrderById(orderId as string),
    enabled: Boolean(orderId),
    refetchInterval: options?.live ? 6_000 : false,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: (_order, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeOrder(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffLiveQueue });
      queryClient.invalidateQueries({ queryKey: queryKeys.staffUpcoming });
    },
  });
}
