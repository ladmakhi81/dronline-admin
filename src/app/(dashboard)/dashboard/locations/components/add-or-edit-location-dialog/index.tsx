"use client";

import OperationDrawer from "@/shared-components/operation-drawer";
import { Form, Input } from "antd";
import { FC, useEffect } from "react";
import { CREATE_OR_EDIT_LOCATION_VALIDATION_RULES } from "./validation-rules";
import { Location } from "@/services/location/types";
import { useCreateLocation } from "@/services/location/create-location";
import { useNotificationStore } from "@/store/notification.store";
import { useEditLocation } from "@/services/location/edit-location";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedLocation?: Location;
  refetchLocation: () => void;
}

interface FieldsType {
  city: string;
  address: string;
}

const AddOrEditLocationDialog: FC<Props> = ({
  onClose,
  open,
  selectedLocation,
  refetchLocation,
}) => {
  const t = useTranslations("locations-page.modify-location-modal");
  const [form] = Form.useForm<FieldsType>();
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const { mutateAsync: createLocationMutation } = useCreateLocation();
  const { mutateAsync: editLocationMutation } = useEditLocation();

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const handleConfirm = () => {
    form.submit();
  };

  useEffect(() => {
    if (selectedLocation) {
      form.setFieldValue("city", selectedLocation?.city);
      form.setFieldValue("address", selectedLocation?.address);
    }
  }, [selectedLocation, form]);

  const title = selectedLocation ? t("edit-title") : t("create-title");

  const initialValues: FieldsType = {
    address: "",
    city: "",
  };

  const handleFinish = (value: FieldsType) => {
    if (selectedLocation) {
      editLocationMutation({
        city: value.city,
        address: value.address,
        id: selectedLocation?.id,
      })
        .then(() => {
          showNotification(t("edit-successfully"), "success");
          handleClose();
          refetchLocation();
        })
        .catch(() => {});
    } else {
      createLocationMutation({ address: value.address, city: value.city })
        .then(() => {
          showNotification(t("create-successfully"), "success");
          handleClose();
          refetchLocation();
        })
        .catch(() => {});
    }
  };

  return (
    <OperationDrawer
      onClose={handleClose}
      onConfirm={handleConfirm}
      open={open}
      title={title}
    >
      <Form
        initialValues={initialValues}
        autoComplete="off"
        layout="vertical"
        form={form}
        name="add-edit-location"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          rules={CREATE_OR_EDIT_LOCATION_VALIDATION_RULES.city}
          label={t("city")}
          name="city"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          rules={CREATE_OR_EDIT_LOCATION_VALIDATION_RULES.address}
          label={t("address")}
          name="address"
        >
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddOrEditLocationDialog;
