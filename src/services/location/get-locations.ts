import { httpClient } from "@/core/http-client.core";
import { PageableApi } from "@/shared-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetLocationsQuery, Location } from "./types";

const getLocations = (params: GetLocationsQuery) => {
  return httpClient.get("/locations", { params }) as Promise<
    PageableApi<Location>
  >;
};

export const useGetLocations = (params: GetLocationsQuery) => {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: () => getLocations(params),
    placeholderData: keepPreviousData,
  });
};
