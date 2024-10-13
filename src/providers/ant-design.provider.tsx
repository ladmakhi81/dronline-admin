"use client";

import { FC, PropsWithChildren } from "react";
import { ConfigProvider } from "antd";
import { vazirFont } from "@/core/vazir-font.core";
import locale from "antd/locale/fa_IR";

export const AntDesignProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          ...vazirFont.style,
        },
      }}
      direction="rtl"
      locale={locale}
    >
      {children}
    </ConfigProvider>
  );
};
