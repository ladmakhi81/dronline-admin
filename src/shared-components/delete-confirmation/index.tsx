"use client";

import { Button, Flex, Modal, Typography } from "antd";
import { FC, ReactNode } from "react";
import WarningIcon from "@/assets/icons/interface/outline/warning.svg";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  renderBody: () => ReactNode;
}

const DeleteConfirmation: FC<Props> = ({
  onClose,
  onConfirm,
  open,
  title,
  renderBody,
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      width="660px"
      footer={
        <Flex gap="12px" justify="flex-end">
          <Button
            onClick={handleClose}
            type="link"
            danger
            style={{ width: "150px" }}
            size="large"
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirm}
            type="primary"
            style={{ width: "150px" }}
            size="large"
          >
            تایید و حذف
          </Button>
        </Flex>
      }
    >
      <Flex justify="flex-start" align="center" gap="12px">
        <WarningIcon />
        <Typography.Title style={{ margin: 0 }} level={5}>
          {title}
        </Typography.Title>
      </Flex>
      <Flex style={{ marginBlock: "10px 40px" }}>{renderBody()}</Flex>
    </Modal>
  );
};

export default DeleteConfirmation;
