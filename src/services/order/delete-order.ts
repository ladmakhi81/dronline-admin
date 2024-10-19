import { httpClient } from "@/core/http-client.core";
import { useMutation } from "@tanstack/react-query";

const deleteOrder = (id: number) => {
  return httpClient.delete(`/orders/${id}`) as Promise<void>;
};

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: (id: number) => deleteOrder(id),
  });
};
