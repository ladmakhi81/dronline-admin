import { httpClient } from "@/core/http-client.core";
import { User } from "@/services/user/types";
import { useQuery } from "@tanstack/react-query";

const getProfile = () => {
  return httpClient.get("/auth/profile") as Promise<User>;
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });
};
