import { httpClient } from "@/core/http-client.core";
import { PageableApi, PageableQuery } from "@/shared-types";
import { Order } from "./types";
import { useQuery } from "@tanstack/react-query";

const getOrders = (params: PageableQuery) => {
  return httpClient.get("/orders", { params }) as Promise<PageableApi<Order>>;
};

export const useGetOrders = (params: PageableQuery) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
  });
};
