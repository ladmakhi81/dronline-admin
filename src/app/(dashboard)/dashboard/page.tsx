"use client";

import { useAuthStore } from "@/store/auth.store";
import { Button, Flex } from "antd";
import { FC } from "react";

const HomePage: FC = () => {
  const user = useAuthStore((state) => state.user);
  console.log("user", user);
  return (
    <Flex>
      <Button type="primary">روی دکمه کلیک کنید</Button>
    </Flex>
  );
};

export default HomePage;
