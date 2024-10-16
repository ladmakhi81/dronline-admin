import { httpClient } from "@/core/http-client.core";
import { AddDaysOffReqBody, DaysOff } from "./types";
import { useMutation } from "@tanstack/react-query";

const addDaysOff = (data: AddDaysOffReqBody) => {
  return httpClient.post("/days-off", data) as Promise<DaysOff>;
};

export const useAddDaysOff = () => {
  return useMutation({
    mutationFn: (data: AddDaysOffReqBody) => addDaysOff(data),
  });
};
