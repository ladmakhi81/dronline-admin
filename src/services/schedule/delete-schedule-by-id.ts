import { httpClient } from "@/core/http-client.core";
import { useMutation } from "@tanstack/react-query";

const deleteScheduleById = (id: number) => {
  return httpClient.delete(`/schedules/${id}`) as Promise<void>;
};

export const useDeleteScheduleById = () => {
  return useMutation({
    mutationFn: (id: number) => deleteScheduleById(id),
  });
};
