"use client";

import { FC, PropsWithChildren } from "react";
import { ConfigProvider } from "antd";
import { vazirFont } from "@/core/vazir-font.core";

export const AntDesignProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          ...vazirFont.style,
        },
      }}
      direction="rtl"
    >
      {children}
    </ConfigProvider>
  );
};
