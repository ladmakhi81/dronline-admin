"use client";

import { Category } from "@/services/category/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { Button, Form, Input, Upload } from "antd";
import { FC } from "react";
import { Container } from "./styles";
import { CREATE_EDIT_CATEGORY_VALIDATION_RULES } from "./validation-rules";
import { useAuthStore } from "@/store/auth.store";
import { useCreateCategory } from "@/services/category/create-category";
import { useNotificationStore } from "@/store/notification.store";

interface FieldsType {
  name: string;
  icon: { response: { fileName: string } }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCategory?: Category;
  refetchCategories: () => void;
}

const AddOrEditCategoryDialog: FC<Props> = ({
  onClose,
  open,
  selectedCategory,
  refetchCategories,
}) => {
  const { mutateAsync: createCategoryMutate } = useCreateCategory();
  const [form] = Form.useForm();
  const fieldsWatch = Form.useWatch([], form);
  const accessToken = useAuthStore((state) => state.accessToken);
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const handleConfirm = () => {
    form.submit();
  };

  const handleSubmit = (data: unknown) => {
    const formData = data as FieldsType;

    if (selectedCategory) {
    } else {
      createCategoryMutate({
        icon: formData.icon.at(-1)?.response.fileName as string,
        name: formData.name,
      })
        .then(() => {
          showNotification("زمینه تخصصی با موفقیت ایجاد گردید", "success");
          refetchCategories();
          handleClose();
        })
        .catch(() => {});
    }
  };

  const title = selectedCategory
    ? "ویرایش زمینه تخصصی"
    : "ساخت زمینه تخصصی جدید";

  const isSelectIcon = !!fieldsWatch?.icon;

  const normFile = (e: unknown) => {
    if (Array.isArray(e)) {
      return e;
    }
    return (e as Record<string, unknown>)?.fileList;
  };

  return (
    <OperationDrawer
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={title}
      open={open}
    >
      <Container
        onFinish={handleSubmit}
        layout="vertical"
        name="create-edit-categories"
        form={form}
        requiredMark={false}
      >
        <Form.Item
          rules={CREATE_EDIT_CATEGORY_VALIDATION_RULES.name}
          name="name"
          label="نام زمینه تخصصی"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="icon"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={CREATE_EDIT_CATEGORY_VALIDATION_RULES.icon}
        >
          <Upload
            action={`${process.env.API_URL}/categories/upload-icon`}
            multiple={false}
            listType="picture"
            maxCount={1}
            name="icon"
            headers={{
              Authorization: `Bearer ${accessToken}`,
            }}
          >
            <Button
              hidden={isSelectIcon}
              size="large"
              type="dashed"
              className="upload-button"
            >
              افزودن آیکن مربوط به دسته بندی
            </Button>
          </Upload>
        </Form.Item>
      </Container>
    </OperationDrawer>
  );
};

export default AddOrEditCategoryDialog;
