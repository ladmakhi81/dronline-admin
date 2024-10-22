"use client";

import { useEditPassword } from "@/services/user/edit-password";
import { User } from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { useNotificationStore } from "@/store/notification.store";
import { Form, Input } from "antd";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { EDIT_PASSWORD_VALIDATION_RULES } from "./validation-rules";

interface FieldsType {
  password: string;
}

interface Props {
  user?: User;
  open: boolean;
  onClose: () => void;
}

const EditPasswordDialog: FC<Props> = ({ onClose, open, user = {} }) => {
  const t = useTranslations("common.edit-password-modal");
  const { mutateAsync: editPasswordMutate } = useEditPassword();
  const [form] = Form.useForm<FieldsType>();
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    form.submit();
  };

  const handleSubmit = (data: FieldsType) => {
    if (user) {
      editPasswordMutate({ id: user.id!, password: data.password }).then(() => {
        handleClose();
        showNotification(t("edit-successfully"), "success");
        form.resetFields();
      });
    }
  };

  const title = t("title", { user: user?.firstName + " " + user?.lastName });

  const initialValues = {
    password: "",
  };

  return (
    <OperationDrawer
      title={title}
      onClose={handleClose}
      onConfirm={handleConfirm}
      open={open}
    >
      <Form
        onFinish={handleSubmit}
        initialValues={initialValues}
        autoComplete="off"
        requiredMark={false}
        layout="vertical"
        form={form}
      >
        <Form.Item
          rules={EDIT_PASSWORD_VALIDATION_RULES.password}
          name="password"
          label={t("password")}
        >
          <Input.Password size="large" />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default EditPasswordDialog;
