"use client";

import { Button, Drawer, Flex } from "antd";
import { FC, ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  title: string;
  width?: string;
}

const OperationDrawer: FC<Props> = ({
  onClose,
  onConfirm,
  open,
  children,
  title,
  width = "400px",
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Drawer
      width={width}
      placement="left"
      open={open}
      onClose={handleClose}
      title={title}
      footer={
        <Flex justify="space-between" gap="12px" align="center">
          <Button onClick={handleClose} size="large" style={{ flex: 1 }}>
            انصراف
          </Button>
          <Button
            onClick={handleConfirm}
            type="primary"
            size="large"
            style={{ flex: 1 }}
          >
            تایید
          </Button>
        </Flex>
      }
    >
      {children}
    </Drawer>
  );
};

export default OperationDrawer;
