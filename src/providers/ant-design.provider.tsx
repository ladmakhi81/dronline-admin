"use client";

import { FC, PropsWithChildren } from "react";
import { ConfigProvider } from "antd";
import { vazirFont } from "@/core/vazir-font.core";
import fa_IR from "antd/lib/locale/fa_IR";
import dayjs from "dayjs";
import { JalaliLocaleListener } from "antd-jalali";

dayjs.locale("fa_IR");

export const AntDesignProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          ...vazirFont.style,
        },
      }}
      direction="rtl"
      locale={fa_IR}
    >
      <JalaliLocaleListener />
      {children}
    </ConfigProvider>
  );
};
