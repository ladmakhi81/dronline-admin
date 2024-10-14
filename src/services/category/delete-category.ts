import { httpClient } from "@/core/http-client.core";
import { useMutation } from "@tanstack/react-query";

const deleteCategory = (id: number) => {
  return httpClient.delete(`/categories/${id}`) as Promise<void>;
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
  });
};
