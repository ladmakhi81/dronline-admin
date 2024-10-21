"use client";

import { Flex, Typography } from "antd";
import Link from "next/link";
import { FC } from "react";

const NotFoundPage: FC = () => {
  return (
    <Flex style={{ height: "100vh" }} vertical justify="center" align="center">
      <Typography.Title style={{ margin: 0, fontSize: "40px" }}>
        404
      </Typography.Title>
      <Typography.Title style={{ margin: 0, fontSize: "35px" }}>
        صفحه مورد نظر یافت نشد
      </Typography.Title>
      <Link style={{ marginTop: "20px" }} href="/dashboard">
        بازگشت به صفحه اصلی
      </Link>
    </Flex>
  );
};

export default NotFoundPage;
