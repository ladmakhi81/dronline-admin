"use client";

import { DASHBOARD_MENU_URLS } from "@/constant/dashboard-urls.constant";
import { Layout, Menu } from "antd";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { FC } from "react";

const DashboardSidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Layout.Sider style={{ backgroundColor: "#fff" }} width="250px">
      <Menu
        mode="inline"
        items={DASHBOARD_MENU_URLS}
        selectedKeys={[pathname]}
        style={{ padding: "10px" }}
        onSelect={(info) => router.push(info.key)}
      />
    </Layout.Sider>
  );
};

export default DashboardSidebar;
