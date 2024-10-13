import { httpClient } from "@/core/http-client.core";
import { LoginRequestDto, LoginResponseDto } from "../types";
import { useMutation } from "@tanstack/react-query";

const loginApi = (data: LoginRequestDto) => {
  return httpClient.post("/auth/signin", data) as Promise<LoginResponseDto>;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequestDto) => loginApi(data),
  });
};
