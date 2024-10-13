"use client";

import AuthenticationUserProvider from "@/providers/authentication-user.provider";
import { FC, PropsWithChildren } from "react";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return <AuthenticationUserProvider>{children}</AuthenticationUserProvider>;
};

export default DashboardLayout;
