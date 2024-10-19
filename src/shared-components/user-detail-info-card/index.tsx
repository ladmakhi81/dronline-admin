"use client";

import { User } from "@/services/user/types";
import { Descriptions } from "antd";
import { FC } from "react";

interface Props {
  user: User;
  title: string;
}

const UserDetailInfoCard: FC<Props> = ({ user, title }) => {
  return (
    <Descriptions bordered layout="vertical" title={title}>
      <Descriptions.Item label="سریال کاربر">{user.id}</Descriptions.Item>
      <Descriptions.Item label="نام و نام خانوادگی">
        {user.firstName} {user.lastName}
      </Descriptions.Item>
      <Descriptions.Item label="شماره تماس">{user.phone}</Descriptions.Item>
    </Descriptions>
  );
};

export default UserDetailInfoCard;
