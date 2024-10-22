"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC } from "react";

const NotFoundPage: FC = () => {
  const t = useTranslations("not-found-page");
  return (
    <Flex style={{ height: "100vh" }} vertical justify="center" align="center">
      <Typography.Title style={{ margin: 0, fontSize: "40px" }}>
        {t("title")}
      </Typography.Title>
      <Typography.Title style={{ margin: 0, fontSize: "35px" }}>
        {t("description")}
      </Typography.Title>
      <Link style={{ marginTop: "20px" }} href="/dashboard">
        {t("btn-link")}
      </Link>
    </Flex>
  );
};

export default NotFoundPage;
