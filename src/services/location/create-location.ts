import { useMutation } from "@tanstack/react-query";
import { CreateOrEditLocationReqBody, Location } from "./types";
import { httpClient } from "@/core/http-client.core";

const createLocation = (data: CreateOrEditLocationReqBody) => {
  return httpClient.post("/locations", data) as Promise<Location>;
};

export const useCreateLocation = () => {
  return useMutation({
    mutationFn: (data: CreateOrEditLocationReqBody) => createLocation(data),
  });
};
