import { httpClient } from "@/core/http-client.core";
import { PageableApi } from "@/shared-types";
import { GetOrderQuery, Order } from "./types";
import { useQuery } from "@tanstack/react-query";

const getOrders = (params: GetOrderQuery) => {
  return httpClient.get("/orders", { params }) as Promise<PageableApi<Order>>;
};

export const useGetOrders = (params: GetOrderQuery) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
  });
};
