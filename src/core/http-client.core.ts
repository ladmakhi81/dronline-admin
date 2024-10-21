import { getRefreshToken } from "@/services/auth/refresh-token";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import axios from "axios";

const httpClient = axios.create({ baseURL: process.env.API_URL });

httpClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

const handleRefreshToken = async (): Promise<boolean> => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return Promise.reject(false);
  return getRefreshToken(refreshToken)
    .then(({ data }) => data)
    .then((refreshTokenResponse) => {
      if (
        refreshTokenResponse.accessToken &&
        refreshTokenResponse.refreshToken
      ) {
        useAuthStore
          .getState()
          .setToken(
            refreshTokenResponse.accessToken,
            refreshTokenResponse.refreshToken
          );
        return true;
      }
      return false;
    })
    .catch(() => {
      return false;
    });
};

httpClient.interceptors.response.use(
  (value) => value.data,
  async (error) => {
    if (error.response.status === 401) {
      const isRefreshedToken = await handleRefreshToken();
      console.log("is  refresh token", isRefreshedToken);
      if (!isRefreshedToken) {
        useAuthStore.getState().resetAuth();
        window.location.href = "/auth/sign-in";
      }
      return Promise.reject(error);
    }

    useNotificationStore
      .getState()
      .addNotification(error.response.data.message, "error");
    return Promise.reject(error);
  }
);

export { httpClient };
