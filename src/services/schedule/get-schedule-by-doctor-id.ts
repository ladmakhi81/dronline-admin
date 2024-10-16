import { httpClient } from "@/core/http-client.core";
import { PageableApi, PageableQuery } from "@/shared-types";
import { useQuery } from "@tanstack/react-query";
import { Schedule } from "./types";

const getScheduleByDoctorId = (doctorId: number, params: PageableQuery) => {
  return httpClient.get(`/schedules/doctor/${doctorId}`, { params }) as Promise<
    PageableApi<Schedule>
  >;
};

export const useGetScheduleByDoctorId = (
  doctorId: number,
  params: PageableQuery
) => {
  return useQuery({
    queryKey: ["schedule-doctors", doctorId, params],
    queryFn: () => getScheduleByDoctorId(doctorId, params),
  });
};
