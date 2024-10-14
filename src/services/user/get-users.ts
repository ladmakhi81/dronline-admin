import { httpClient } from "@/core/http-client.core";
import { GetUsersQuery, User } from "./types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PageableApi } from "@/shared-types";

const getUsers = (params: GetUsersQuery) => {
  return httpClient.get("/users", { params }) as Promise<PageableApi<User>>;
};

export const useGetUsers = (params: GetUsersQuery) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
};
