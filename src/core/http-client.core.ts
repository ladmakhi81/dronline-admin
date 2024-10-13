import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import axios from "axios";

const httpClient = axios.create({ baseURL: "http://localhost:8080/api" });

httpClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  config.headers.set("Authorization", `Bearer ${accessToken}`);
  return config;
});

httpClient.interceptors.response.use(
  (value) => value.data,
  (error) => {
    useNotificationStore
      .getState()
      .addNotification(error.response.data.message, "error");
    return Promise.reject(error);
  }
);

export { httpClient };
