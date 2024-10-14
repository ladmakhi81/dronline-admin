import { httpClient } from "@/core/http-client.core";
import { Category, CreateCategoryReqBody } from "./types";
import { useMutation } from "@tanstack/react-query";

const createCategory = (data: CreateCategoryReqBody) => {
  return httpClient.post("/categories", data) as Promise<Category>;
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (data: CreateCategoryReqBody) => createCategory(data),
  });
};
