"use client";

import { useNotificationStore } from "@/store/notification.store";
import { message } from "antd";
import { FC, PropsWithChildren, useEffect } from "react";

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const notification = useNotificationStore((state) => state.notification);
  const clearNotification = useNotificationStore(
    (state) => state.clearNotification
  );
  const [notify, contentHolder] = message.useMessage();

  useEffect(() => {
    if (notification?.message) {
      notify
        .open({ type: notification?.type, content: notification?.message })
        .then(() => {
          clearNotification();
        });
    }
  }, [clearNotification, notification, notify]);

  return (
    <>
      {contentHolder}
      {children}
    </>
  );
};

export default NotificationProvider;
