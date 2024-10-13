import { httpClient } from "@/core/http-client.core";
import { CreateOrEditLocationReqBody, Location } from "./types";
import { useMutation } from "@tanstack/react-query";

const editLocation = (id: number, data: CreateOrEditLocationReqBody) => {
  return httpClient.patch(`/locations/${id}`, data) as Promise<Location>;
};

export const useEditLocation = () => {
  return useMutation({
    mutationFn: ({
      id,
      ...args
    }: CreateOrEditLocationReqBody & { id: number }) => {
      return editLocation(id, args);
    },
  });
};
