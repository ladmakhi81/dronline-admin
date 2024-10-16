import { httpClient } from "@/core/http-client.core";
import { User } from "./types";
import { useQuery } from "@tanstack/react-query";

const getUserById = (id: number) => {
  return httpClient.get(`/users/${id}`) as Promise<User>;
};

export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
  });
};
