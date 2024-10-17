import { httpClient } from "@/core/http-client.core";
import { UserUploadImageReqBody } from "./types";
import { useMutation } from "@tanstack/react-query";

const uploadUserImage = (data: FormData) => {
  return httpClient.post(
    "/users/upload-image",
    data
  ) as Promise<UserUploadImageReqBody>;
};

export const useUploadUserImage = () => {
  return useMutation({
    mutationFn: (data: FormData) => uploadUserImage(data),
  });
};
