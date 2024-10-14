import { httpClient } from "@/core/http-client.core";
import { CreateUserReqBody, User, UserType } from "./types";
import { useMutation } from "@tanstack/react-query";

const createUser = (type: UserType, data: CreateUserReqBody) => {
  return httpClient.post(`/users/${type}`, data) as Promise<User>;
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: ({ type, ...args }: { type: UserType } & CreateUserReqBody) =>
      createUser(type, args),
  });
};
