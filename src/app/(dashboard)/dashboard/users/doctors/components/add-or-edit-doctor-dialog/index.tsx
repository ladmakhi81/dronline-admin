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
import { Form, Input, InputNumber, Radio, Select } from "antd";
import { FC, useEffect } from "react";
import { ADD_OR_EDIT_DOCTOR_VALIDATION_RULES } from "./validation-rules";

interface Props {
  open: boolean;
  selectedDoctor?: User;
  onClose: () => void;
  onConfirm: (data: CreateDoctorReqBody | EditDoctorReqBody) => void;
}

const MAX_COUNT_LIST = 10000000;

const AddOrEditDoctorDialog: FC<Props> = ({
  selectedDoctor,
  onClose,
  onConfirm,
  open,
}) => {
  const [form] = Form.useForm<CreateDoctorReqBody | EditDoctorReqBody>();

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategories({
      limit: MAX_COUNT_LIST,
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
      phone: data.phone?.toString(),
      phone2: data.phone2?.toString(),
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

  const title = selectedDoctor ? "ویرایش پروفایل پزشک" : "ساخت پزشک جدید";

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
          label="نام پزشک"
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.firstName}
        >
          <Input placeholder="نام پزشک" size="large" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="نام خانوادگی پزشک"
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.lastName}
        >
          <Input placeholder="نام خانوادگی پزشک" size="large" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="شماره تماس پزشک"
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.phone}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="شماره تماس 1"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="phone2"
          label="شماره تماس پزشک"
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.phone2}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="شماره تماس 2"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="degreeOfEducation"
          label="مدرک تحصیلی پزشک"
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.degreeOfEducation}
        >
          <Select
            options={[
              {
                label: DegtreeOfEducation.diploma,
                value: DegtreeOfEducation.diploma,
              },
              {
                label: DegtreeOfEducation.associate,
                value: DegtreeOfEducation.associate,
              },
              {
                label: DegtreeOfEducation.bachelor,
                value: DegtreeOfEducation.bachelor,
              },
              {
                label: DegtreeOfEducation.master,
                value: DegtreeOfEducation.master,
              },
              {
                label: DegtreeOfEducation.doctorate,
                value: DegtreeOfEducation.doctorate,
              },
            ]}
            placeholder="دیپلم یا فوق دیپلم یا ..."
            size="large"
          />
        </Form.Item>
        <Form.Item
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.gender}
          name="gender"
          label="جنسیت"
        >
          <Radio.Group>
            <Radio value={Gender.male}>مرد</Radio>
            <Radio value={Gender.female}>زن</Radio>
            <Radio value={Gender.unknown}>نامشخص</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.workingFields}
          name="workingFields"
          label="زمینه های تخصصی"
        >
          <Select
            placeholder="زمینه های تخصصی که پزشک دارد"
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
          label="آدرس"
        >
          <Input.TextArea rows={4} placeholder="آدرس مطب پزشک" />
        </Form.Item>
        <Form.Item
          rules={ADD_OR_EDIT_DOCTOR_VALIDATION_RULES.bio}
          name="bio"
          label="بیوگرافی"
        >
          <Input.TextArea
            rows={4}
            placeholder="خلاصه ای از پزشک و نحوه درمانش"
          />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddOrEditDoctorDialog;
