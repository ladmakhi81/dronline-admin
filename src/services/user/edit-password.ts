import { useMutation } from "@tanstack/react-query";
import { EditPasswordReqBody } from "./types";
import { httpClient } from "@/core/http-client.core";

const editPassword = (id: number, data: EditPasswordReqBody) => {
  return httpClient.patch(
    `/auth/admin/change-password/${id}`,
    data
  ) as Promise<void>;
};

export const useEditPassword = () => {
  return useMutation({
    mutationFn: ({ id, ...args }: { id: number } & EditPasswordReqBody) =>
      editPassword(id, args),
  });
};
