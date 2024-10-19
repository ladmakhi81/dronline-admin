import { httpClient } from "@/core/http-client.core";
import { useMutation } from "@tanstack/react-query";

const cancelOrder = (id: number) => {
  return httpClient.patch(`/orders/cancel/${id}`) as Promise<void>;
};

export const useCancelOrder = () => {
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
  });
};
