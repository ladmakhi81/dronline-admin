import { httpClient } from "@/core/http-client.core";
import { GetSchedulesQuery, Schedule } from "./types";
import { PageableApi } from "@/shared-types";
import { useQuery } from "@tanstack/react-query";

const getSchedules = (params: GetSchedulesQuery) => {
  return httpClient.get("/schedules", { params }) as Promise<
    PageableApi<Schedule>
  >;
};

export const useGetSchedules = (params: GetSchedulesQuery) => {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getSchedules(params),
  });
};
