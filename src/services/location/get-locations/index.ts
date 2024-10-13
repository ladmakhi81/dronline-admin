import { httpClient } from "@/core/http-client.core";
import { Location } from "../types";
import { PageableApi, PageableQuery } from "@/shared-types";
import { useQuery } from "@tanstack/react-query";

const getLocations = (params: PageableQuery) => {
  return httpClient.get("/locations", { params }) as Promise<
    PageableApi<Location>
  >;
};

export const useGetLocations = (params: PageableQuery) => {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: () => getLocations(params),
  });
};
