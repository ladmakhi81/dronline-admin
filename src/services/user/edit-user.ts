import { useMutation } from "@tanstack/react-query";
import { EditUserReqBody, UserType } from "./types";
import { httpClient } from "@/core/http-client.core";

const editUser = (type: UserType, id: number, data: EditUserReqBody) => {
  return httpClient.patch(`/users/${id}/${type}`, data) as Promise<void>;
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: ({
      type,
      id,
      ...args
    }: { type: UserType; id: number } & EditUserReqBody) =>
      editUser(type, id, args),
  });
};
