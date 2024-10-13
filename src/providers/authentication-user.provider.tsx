"use client";

import { useGetProfile } from "@/services/auth/profile";
import { useAuthStore } from "@/store/auth.store";
import { FC, PropsWithChildren, useEffect } from "react";

const AuthenticationUserProvider: FC<PropsWithChildren> = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const { data } = useGetProfile();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return <>{children}</>;
};

export default AuthenticationUserProvider;
