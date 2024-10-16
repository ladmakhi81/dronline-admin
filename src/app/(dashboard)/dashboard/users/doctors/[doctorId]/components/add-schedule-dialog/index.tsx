"use client";

import { User } from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { Form } from "antd";
import { FC } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  refetchSchedules: () => void;
  doctor: User;
}

const AddScheduleDialog: FC<Props> = ({
  doctor,
  onClose,
  open,
  refetchSchedules,
}) => {
  const [form] = Form.useForm();

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {};

  return (
    <OperationDrawer
      onConfirm={() => form.submit()}
      title="افزودن آیتم جدید به چارت رزرو"
      open={open}
      onClose={handleClose}
    >
      <h1></h1>
    </OperationDrawer>
  );
};

export default AddScheduleDialog;
