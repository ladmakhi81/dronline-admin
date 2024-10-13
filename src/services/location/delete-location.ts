import { httpClient } from "@/core/http-client.core";
import { useMutation } from "@tanstack/react-query";

const deleteLocation = (id: number) => {
  return httpClient.delete(`/locations/${id}`) as Promise<void>;
};

export const useDeleteLocation = () => {
  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
  });
};
