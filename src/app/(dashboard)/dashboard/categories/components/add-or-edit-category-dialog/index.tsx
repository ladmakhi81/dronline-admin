"use client";

import { Category } from "@/services/category/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { Button, Form, Input, Upload } from "antd";
import { FC } from "react";
import { Container } from "./styles";

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
  const [form] = Form.useForm();
  const fieldsWatch = Form.useWatch([], form);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    refetchCategories();
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
      <Container layout="vertical" name="create-edit-categories" form={form}>
        <Form.Item name="name" label="نام زمینه تخصصی">
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="icon"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          <Upload multiple={false} listType="picture" maxCount={1}>
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
