import { useNotificationStore } from "@/store/notification.store";
import axios from "axios";

const httpClient = axios.create({ baseURL: "http://localhost:8080/api" });

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
