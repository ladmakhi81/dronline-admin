"use client";

import { useEditPassword } from "@/services/user/edit-password";
import { User } from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { useNotificationStore } from "@/store/notification.store";
import { Form, Input } from "antd";
import { FC } from "react";

interface FieldsType {
  password: string;
}

interface Props {
  user?: User;
  open: boolean;
  onClose: () => void;
}

const EditPasswordDialog: FC<Props> = ({ onClose, open, user = {} }) => {
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
        showNotification(
          "پسورد کاربر مورد نظر با موفقیت ویرایش گردید",
          "success"
        );
        form.resetFields();
      });
    }
  };

  const title = `تغییر گذرواژه ${user.firstName} ${user.lastName}`;

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
          rules={[
            {
              required: true,
              message: "وارد کردن گذرواژه الزامی میباشد",
            },
            {
              min: 8,
              message: "گذرواژه حداقل باید 8 کاراکتر داشته باشد",
            },
          ]}
          name="password"
          label="گذرواژه جدید"
        >
          <Input.Password size="large" />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default EditPasswordDialog;
