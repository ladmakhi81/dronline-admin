"use client";

import { Button, Card, Flex, Form, Input, Space, Typography } from "antd";
import { FC } from "react";
import UserIcon from "@/assets/icons/interface/outline/user.svg";
import KeyIcon from "@/assets/icons/interface/outline/lock.svg";
import LoginIcon from "@/assets/icons/interface/outline/login.svg";
import { SIGN_IN_VALIDATION_RULES } from "./validation-rules";
import { useLogin } from "@/services/auth/login";
import { useNotificationStore } from "@/store/notification.store";
import { useRouter } from "nextjs-toploader/app";
import { useAuthStore } from "@/store/auth.store";
import { useTranslations } from "next-intl";

interface FieldsType {
  phone: string;
  password: string;
}

const SigninPage: FC = () => {
  const t = useTranslations("login-page");
  const [form] = Form.useForm<FieldsType>();
  const { mutateAsync: loginMutate } = useLogin();
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const setAuthStore = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const onSubmitLogin = (data: FieldsType) => {
    loginMutate({
      phone: data.phone,
      password: data.password,
      type: "Admin",
    })
      .then((data) => {
        showNotification(t("login-successfully"), "success");
        setAuthStore(data.accessToken, data.refreshToken);
        router.push("/");
      })
      .catch(() => {});
  };

  return (
    <Card
      style={{
        width: "400px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Flex
        justify="center"
        align="center"
        gap="5px"
        style={{ marginBottom: "40px" }}
      >
        <LoginIcon />
        <Typography.Title style={{ margin: 0, textAlign: "center" }} level={5}>
          {t("title")}
        </Typography.Title>
      </Flex>
      <Form
        initialValues={{ phone: "", password: "" }}
        onFinish={onSubmitLogin}
        form={form}
        name="sign-in-form"
        layout="vertical"
        requiredMark={false}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Flex vertical>
            <Form.Item
              label={t("phone")}
              name="phone"
              rules={SIGN_IN_VALIDATION_RULES.phoneNumber}
            >
              <Input
                size="large"
                placeholder={t("phone-placeholder")}
                prefix={<UserIcon />}
              />
            </Form.Item>
            <Form.Item
              rules={SIGN_IN_VALIDATION_RULES.password}
              label={t("password")}
              name="password"
            >
              <Input
                size="large"
                placeholder={t("password-placeholder")}
                prefix={<KeyIcon />}
                type="password"
              />
            </Form.Item>
          </Flex>
          <Button
            htmlType="submit"
            size="large"
            type="primary"
            style={{ width: "100%" }}
          >
            {t("login-btn")}
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default SigninPage;
