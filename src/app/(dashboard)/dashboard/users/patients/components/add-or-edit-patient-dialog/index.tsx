"use client";

import {
  CreatePatientReqBody,
  EditPatientReqBody,
  User,
  UserType,
} from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { Form, Input } from "antd";
import { FC, useEffect } from "react";
import { CREATE_OR_EDIT_PATIENT_VALIDATION_RULES } from "./validation-rules";
import { useCreateUser } from "@/services/user/create-user";
import { useNotificationStore } from "@/store/notification.store";
import { useEditUser } from "@/services/user/edit-user";

interface Props {
  selectedUser?: User;
  open: boolean;
  onClose: () => void;
  refetchUsers: () => void;
}

interface FieldsType {
  firstName: string;
  lastName: string;
  phone: string;
}

const AddOrEditPatientDialog: FC<Props> = ({
  onClose,
  open,
  refetchUsers,
  selectedUser,
}) => {
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const { mutateAsync: createUserMutate } = useCreateUser();
  const { mutateAsync: editUserMutate } = useEditUser();
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedUser) {
      form.setFieldValue("firstName", selectedUser.firstName);
      form.setFieldValue("lastName", selectedUser.lastName);
      form.setFieldValue("phone", selectedUser.phone);
    }
  }, [form, selectedUser]);

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const handleConfirm = () => {
    form.submit();
  };

  const handleSubmit = (data: FieldsType) => {
    if (selectedUser) {
      const payload: EditPatientReqBody = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      };
      editUserMutate({
        ...payload,
        id: selectedUser.id,
        type: UserType.Patient,
      }).then(() => {
        refetchUsers();
        handleClose();
        showNotification("بیمار مورد نظر با موفقیت ویرایش گردید", "success");
      });
    } else {
      const payload: CreatePatientReqBody = {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.phone,
        phone: data.phone,
      };
      createUserMutate({ type: UserType.Patient, ...payload })
        .then(() => {
          refetchUsers();
          handleClose();
          showNotification("بیمار مورد نظر با موفقیت ایجاد گردید", "success");
        })
        .catch(() => {});
    }
  };

  const title = selectedUser ? "ویرایش بیمار" : "افزودن بیمار جدید";

  const initialValue: FieldsType = {
    firstName: "",
    lastName: "",
    phone: "",
  };

  return (
    <OperationDrawer
      open={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={title}
    >
      <Form
        initialValues={initialValue}
        name="create-edit-user"
        form={form}
        autoComplete="off"
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          rules={CREATE_OR_EDIT_PATIENT_VALIDATION_RULES.firstName}
          name="firstName"
          label="نام بیمار"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          rules={CREATE_OR_EDIT_PATIENT_VALIDATION_RULES.lastName}
          name="lastName"
          label="نام خانوادگی بیمار"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          rules={CREATE_OR_EDIT_PATIENT_VALIDATION_RULES.phone}
          name="phone"
          label="شماره تماس بیمار"
        >
          <Input size="large" />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddOrEditPatientDialog;
