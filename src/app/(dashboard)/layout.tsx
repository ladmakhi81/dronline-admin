"use client";

import AuthenticationUserProvider from "@/providers/authentication-user.provider";
import DashboardSidebar from "@/shared-components/dashboard-sidebar";
import { Layout } from "antd";
import { FC, PropsWithChildren } from "react";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthenticationUserProvider>
      <Layout hasSider style={{ height: "100vh", width: "100%" }}>
        <DashboardSidebar />
        <Layout.Content style={{ padding: "20px" }}>{children}</Layout.Content>
      </Layout>
    </AuthenticationUserProvider>
  );
};

export default DashboardLayout;
