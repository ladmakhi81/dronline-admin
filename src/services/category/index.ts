import { httpClient } from "@/core/http-client.core";
import { Category, GetCategoriesQuery } from "./types";
import { PageableApi } from "@/shared-types";
import { useQuery } from "@tanstack/react-query";

const getCategories = (params: GetCategoriesQuery) => {
  return httpClient.get("/categories", { params }) as Promise<
    PageableApi<Category>
  >;
};

export const useGetCategories = (params: GetCategoriesQuery) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
};
