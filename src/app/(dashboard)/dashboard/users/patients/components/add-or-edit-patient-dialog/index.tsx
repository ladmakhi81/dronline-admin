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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("users.patients-page.modify-patient-dialog");
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const { mutateAsync: createUserMutate } = useCreateUser();
  const { mutateAsync: editUserMutate } = useEditUser();
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        phone: selectedUser.phone,
      });
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
        showNotification(t("edit-patient-successfully"), "success");
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
          showNotification(t("create-patient-successfully"), "success");
        })
        .catch(() => {});
    }
  };

  const title = selectedUser ? t("edit-title") : t("create-title");

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
          label={t("firstName")}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          rules={CREATE_OR_EDIT_PATIENT_VALIDATION_RULES.lastName}
          name="lastName"
          label={t("lastName")}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          rules={CREATE_OR_EDIT_PATIENT_VALIDATION_RULES.phone}
          name="phone"
          label={t("phone")}
        >
          <Input size="large" />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddOrEditPatientDialog;
