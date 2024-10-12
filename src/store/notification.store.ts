import { create } from "zustand";

interface Notification {
  type: "error" | "success";
  message: string;
}

interface NotificationStore {
  notification?: Notification;
  addNotification: (message: string, type: "error" | "success") => void;
  clearNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((setState) => ({
  addNotification: (message: string, type: "error" | "success") => {
    setState((state) => ({ ...state, notification: { message, type } }));
  },
  clearNotification: () =>
    setState((state) => ({ ...state, notification: undefined })),
}));
