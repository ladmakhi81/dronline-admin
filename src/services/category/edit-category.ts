import { httpClient } from "@/core/http-client.core";
import { Category, EditCategoryReqBody } from "./types";
import { useMutation } from "@tanstack/react-query";

const editCategory = (id: number, data: EditCategoryReqBody) => {
  return httpClient.patch(`/categories/${id}`, data) as Promise<Category>;
};

export const useEditCategory = () => {
  return useMutation({
    mutationFn: ({ id, ...args }: { id: number } & EditCategoryReqBody) =>
      editCategory(id, args),
  });
};
