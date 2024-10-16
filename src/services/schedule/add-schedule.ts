import { httpClient } from "@/core/http-client.core";
import { AddScheduleReqBody, Schedule } from "./types";
import { useMutation } from "@tanstack/react-query";

const addSchedule = (data: AddScheduleReqBody) => {
  return httpClient.post("/schedules", data) as Promise<Schedule>;
};

export const useAddSchedule = () => {
  return useMutation({
    mutationFn: (data: AddScheduleReqBody) => addSchedule(data),
  });
};
