import { httpClient } from "@/core/http-client.core";
import { DaysOff } from "./types";
import { useQuery } from "@tanstack/react-query";

const getDaysOffByDoctorId = (id: number) => {
  return httpClient.get(`/days-off/${id}`) as Promise<DaysOff[]>;
};

export const useGetDaysOffByDoctorId = (id: number) => {
  return useQuery({
    queryKey: ["daysoff-doctor", id],
    queryFn: () => getDaysOffByDoctorId(id),
  });
};
