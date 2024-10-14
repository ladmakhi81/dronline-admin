import { httpClient } from "@/core/http-client.core";
import { useMutation } from "@tanstack/react-query";

const deleteUser = (id: number) => {
  return httpClient.delete(`/users/${id}`) as Promise<void>;
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
  });
};
