"use client";

import { Category } from "@/services/category/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { Button, Form, Input, Upload } from "antd";
import { FC, useEffect } from "react";
import { Container } from "./styles";
import { CREATE_EDIT_CATEGORY_VALIDATION_RULES } from "./validation-rules";
import { useAuthStore } from "@/store/auth.store";
import { useCreateCategory } from "@/services/category/create-category";
import { useNotificationStore } from "@/store/notification.store";
import { useEditCategory } from "@/services/category/edit-category";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("categories-page.modify-category-modal");
  const { mutateAsync: editCategoryMutate } = useEditCategory();
  const { mutateAsync: createCategoryMutate } = useCreateCategory();
  const [form] = Form.useForm();
  const fieldsWatch = Form.useWatch([], form);
  const accessToken = useAuthStore((state) => state.accessToken);
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  useEffect(() => {
    if (selectedCategory) {
      form.setFieldValue("name", selectedCategory.name);
    }
  }, [form, selectedCategory]);

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
      editCategoryMutate({
        name: formData.name,
        icon: selectedCategory.icon,
        id: selectedCategory.id,
      })
        .then(() => {
          showNotification(t("edit-successfully"), "success");
          refetchCategories();
          handleClose();
        })
        .catch(() => {});
    } else {
      createCategoryMutate({
        icon: formData.icon.at(-1)?.response.fileName as string,
        name: formData.name,
      })
        .then(() => {
          showNotification(t("create-successfully"), "success");
          refetchCategories();
          handleClose();
        })
        .catch(() => {});
    }
  };

  const title = selectedCategory ? t("edit-title") : t("create-title");

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
          label={t("name")}
        >
          <Input size="large" />
        </Form.Item>
        {!selectedCategory && (
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
                {t("add-icon")}
              </Button>
            </Upload>
          </Form.Item>
        )}
      </Container>
    </OperationDrawer>
  );
};

export default AddOrEditCategoryDialog;
