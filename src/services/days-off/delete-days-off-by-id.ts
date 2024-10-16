import { httpClient } from "@/core/http-client.core";
import { useMutation } from "@tanstack/react-query";

const deleteDaysOffById = (id: number) => {
  return httpClient.delete(`/days-off/${id}`) as Promise<void>;
};

export const useDeleteDaysOffById = () => {
  return useMutation({
    mutationFn: (id: number) => deleteDaysOffById(id),
  });
};
