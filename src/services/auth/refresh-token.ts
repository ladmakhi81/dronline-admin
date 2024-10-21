import { useAuthStore } from "@/store/auth.store";
import { GetRefreshTokenResponse } from "./types";
import axios, { AxiosResponse } from "axios";

export const getRefreshToken = (refreshTokenCode: string) => {
  return axios.post(
    `${process.env.API_URL}/auth/refresh-token`,
    {},
    {
      params: { "refresh-token": refreshTokenCode },
      headers: {
        Authorization: `Bearer ${useAuthStore.getInitialState()?.accessToken}`,
      },
    }
  ) as Promise<AxiosResponse<GetRefreshTokenResponse>>;
};
