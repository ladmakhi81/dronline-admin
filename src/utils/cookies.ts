import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constant/token.constant";
import cookies from "js-cookie";

export const setTokenCookie = (accessToken: string, refreshToken: string) => {
  cookies.set(ACCESS_TOKEN, accessToken);
  cookies.set(REFRESH_TOKEN, refreshToken);
};

export const getTokenCookie = () => {
  return {
    accessToken: cookies.get(ACCESS_TOKEN),
    refreshToken: cookies.get(REFRESH_TOKEN),
  };
};
