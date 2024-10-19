import { httpClient } from "@/core/http-client.core";
import { PageableApi, PageableQuery } from "@/shared-types";
import { Transaction } from "./types";
import { useQuery } from "@tanstack/react-query";

const getTransactions = (params: PageableQuery) => {
  return httpClient.get("/transactions", { params }) as Promise<
    PageableApi<Transaction>
  >;
};

export const useGetTransactions = (params: PageableQuery) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  });
};
