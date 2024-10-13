import "./global.css";

import { Metadata } from "next";
import { FC, PropsWithChildren } from "react";
import { AntDesignProvider } from "@/providers/ant-design.provider";
import { vazirFont } from "@/core/vazir-font.core";
import ReactQueryProvider from "@/providers/react-query.provider";
import NotificationProvider from "@/providers/notification-provider";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "پنل مدیریت دکتر آنلاین",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirFont.className}>
        <ReactQueryProvider>
          <NotificationProvider>
            <AntDesignProvider>
              <NextTopLoader />
              {children}
            </AntDesignProvider>
          </NotificationProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
