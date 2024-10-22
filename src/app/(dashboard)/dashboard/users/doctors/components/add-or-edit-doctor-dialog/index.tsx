"use client";

import { useGetCategories } from "@/services/category/get-categories";
import {
  CreateDoctorReqBody,
  DegtreeOfEducation,
  EditDoctorReqBody,
  Gender,
  User,
} from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { Form, Input, Radio, Select } from "antd";
import { FC, useEffect } from "react";
import { ADD_OR_EDIT_DOCTOR_VALIDATION_RULES } from "./validation-rules";
import { useTranslations } from "next-intl";
import { MAX_LIST_COUNT_SELECT } from "@/constant/max-list-item-count-dropdown";

interface Props {
  open: boolean;
  selectedDoctor?: User;
  onClose: () => void;
  onConfirm: (data: CreateDoctorReqBody | EditDoctorReqBody) => void;
}

const AddOrEditDoctorDialog: FC<Props> = ({
  selectedDoctor,
  onClose,
  onConfirm,
  open,
}) => {
  const t = useTranslations("users.doctors-page.modify-doctor-modal");
  const tGlobal = useTranslations("globals");

  const [form] = Form.useForm<CreateDoctorReqBody | EditDoctorReqBody>();

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategories({
      limit: MAX_LIST_COUNT_SELECT,
      page: 0,
    });

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const handleConfirm = (data: CreateDoctorReqBody | EditDoctorReqBody) => {
    onConfirm({
      ...data,
      password: data.phone?.toString(),
    });
    form.resetFields();
  };

  useEffect(() => {
    if (selectedDoctor) {
      form.setFieldsValue({
        firstName: selectedDoctor.firstName,
        lastName: selectedDoctor.lastName,
        phone: selectedDoctor.phone,
        phone2: selectedDoctor.phone2,
        gender: selectedDoctor.gender,
        address: selectedDoctor.address,
        bio: selectedDoctor.bio,
        workingFields: selectedDoctor.workingFields.map(
          (workingField) => workingField.id
        ),
        degreeOfEducation: selectedDoctor.degreeOfEducation,
      });
    }
  }, [form, selectedDoctor]);

  const title = selectedDoctor ? t("edit-title") : t("create-title");

  return (
    <OperationDrawer
      onClose={handleClose}
      onConfirm={() => form.submit()}
      title={title}
      open={open}
    >
      <Form
        onFinish={handleConfirm}
        requiredMark={false}
        layout="vertical"
        form={form}
        name="create-edit-doctor-profile"
      >
        <Form.Item
          name="firstName"
          label={t("firstName")}
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.firstName}
        >
          <Input placeholder={t("firstName")} size="large" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label={t("lastName")}
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.lastName}
        >
          <Input placeholder={t("lastName")} size="large" />
        </Form.Item>
        <Form.Item
          name="phone"
          label={t("phone")}
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.phone}
        >
          <Input
            style={{ width: "100%" }}
            placeholder={t("phone-1-placeholder")}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="phone2"
          label={t("phone")}
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.phone2}
        >
          <Input
            style={{ width: "100%" }}
            placeholder={t("phone-2-placeholder")}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="degreeOfEducation"
          label={t("degree-of-education")}
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.degreeOfEducation}
        >
          <Select
            options={[
              {
                label: tGlobal(DegtreeOfEducation.diploma),
                value: DegtreeOfEducation.diploma,
              },
              {
                label: tGlobal(DegtreeOfEducation.associate),
                value: DegtreeOfEducation.associate,
              },
              {
                label: tGlobal(DegtreeOfEducation.bachelor),
                value: DegtreeOfEducation.bachelor,
              },
              {
                label: tGlobal(DegtreeOfEducation.master),
                value: DegtreeOfEducation.master,
              },
              {
                label: tGlobal(DegtreeOfEducation.doctorate),
                value: DegtreeOfEducation.doctorate,
              },
            ]}
            placeholder={t("degree-of-education-placeholder")}
            size="large"
          />
        </Form.Item>
        <Form.Item
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.gender}
          name="gender"
          label={t("gender")}
        >
          <Radio.Group>
            <Radio value={Gender.male}>{t("male")}</Radio>
            <Radio value={Gender.female}>{t("female")}</Radio>
            <Radio value={Gender.unknown}>{t("unknown")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.workingFields}
          name="workingFields"
          label={t("working-fields")}
        >
          <Select
            placeholder={t("working-fields-placeholder")}
            size="large"
            options={categoriesData?.content || []}
            loading={isCategoriesLoading}
            fieldNames={{
              label: "name",
              value: "id",
            }}
            mode="multiple"
          />
        </Form.Item>
        <Form.Item
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.address}
          name="address"
          label={t("address")}
        >
          <Input.TextArea rows={4} placeholder={t("address-placeholder")} />
        </Form.Item>
        <Form.Item
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.bio}
          name="bio"
          label={t("bio")}
        >
          <Input.TextArea rows={4} placeholder={t("bio-placeholder")} />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddOrEditDoctorDialog;
