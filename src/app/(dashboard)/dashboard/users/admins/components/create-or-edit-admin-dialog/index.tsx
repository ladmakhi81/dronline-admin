"use client";

import { useCreateUser } from "@/services/user/create-user";
import { useEditUser } from "@/services/user/edit-user";
import {
  CreateAdminReqBody,
  EditAdminReqBody,
  User,
  UserType,
} from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { useNotificationStore } from "@/store/notification.store";
import { Checkbox, Form, Input } from "antd";
import { FC, useEffect } from "react";
import { CREATE_OR_EDIT_ADMIN_VALIDATION_RULES } from "./validation-rules";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedAdmin?: User;
  refetchAdmins: () => void;
}

const CreateOrEditAdminDialog: FC<Props> = ({
  onClose,
  open,
  selectedAdmin,
  refetchAdmins,
}) => {
  const [form] = Form.useForm();

  const showNotification = useNotificationStore(
    (store) => store.addNotification
  );

  const { mutateAsync: createAdminMutate } = useCreateUser();

  const { mutateAsync: editAdminMutate } = useEditUser();

  useEffect(() => {
    if (selectedAdmin) {
      form.setFieldsValue({
        firstName: selectedAdmin.firstName,
        lastName: selectedAdmin.lastName,
        phone: selectedAdmin.phone,
        isActive: selectedAdmin.isActive,
      });
    }
  }, [selectedAdmin, form]);

  const handleConfirm = (data: CreateAdminReqBody | EditAdminReqBody) => {
    if (selectedAdmin) {
      editAdminMutate({
        ...(data as EditAdminReqBody),
        type: UserType.Admin,
        id: selectedAdmin.id,
      })
        .then(() => {
          showNotification("ویرایش ادمین با موفقیت انجام شد", "success");
          handleClose();
          refetchAdmins();
        })
        .catch(() => {});
    } else {
      createAdminMutate({
        ...(data as CreateAdminReqBody),
        type: UserType.Admin,
      })
        .then(() => {
          showNotification("ساخت ادمین با موفقیت انجام شد", "success");
          handleClose();
          refetchAdmins();
        })
        .catch(() => {});
    }
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const title = selectedAdmin ? "ویرایش حساب ادمین" : "ساخت حساب ادمین";

  const isEditMode = !!selectedAdmin;

  return (
    <OperationDrawer
      onClose={handleClose}
      onConfirm={() => form.submit()}
      open={open}
      title={title}
    >
      <Form
        requiredMark={false}
        layout="vertical"
        form={form}
        onFinish={handleConfirm}
      >
        <Form.Item
          rules={CREATE_OR_EDIT_ADMIN_VALIDATION_RULES.firstName}
          name="firstName"
          label="نام"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          rules={CREATE_OR_EDIT_ADMIN_VALIDATION_RULES.lastName}
          name="lastName"
          label="نام خانوادگی"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          rules={CREATE_OR_EDIT_ADMIN_VALIDATION_RULES.phone}
          name="phone"
          label="شماره تماس"
        >
          <Input style={{ width: "100%" }} size="large" />
        </Form.Item>
        {!isEditMode && (
          <Form.Item
            rules={CREATE_OR_EDIT_ADMIN_VALIDATION_RULES.password}
            name="password"
            label="گذرواژه"
          >
            <Input.Password size="large" />
          </Form.Item>
        )}
        <Form.Item layout="horizontal" name="isActive" valuePropName="checked">
          <Checkbox>حساب کاربری فعال باشد</Checkbox>
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default CreateOrEditAdminDialog;
