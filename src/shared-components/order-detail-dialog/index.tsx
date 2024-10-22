"use client";

import { Descriptions, Flex, Modal } from "antd";
import { FC } from "react";
import { Order } from "@/services/order/types";
import { jalaliDateFormater } from "@/utils/date-format";
import { WEEK_DAY } from "@/constant/weekday.constant";
import { ScheduleType } from "@/services/schedule/types";
import UserDetailInfoCard from "../user-detail-info-card";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order;
}

const OrderDetailDialog: FC<Props> = ({ onClose, open, order }) => {
  const t = useTranslations("common.order-detail-modal");
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      styles={{ footer: { padding: 0 } }}
      onCancel={handleClose}
      onClose={handleClose}
      open={open}
      footer={<></>}
      width="660px"
    >
      <Flex vertical gap="20px">
        <UserDetailInfoCard
          title={t("patient-info-title")}
          user={order.patient}
        />
        <UserDetailInfoCard
          title={t("doctor-info-title")}
          user={order.doctor}
        />
        <Descriptions title={t("order-info-title")} bordered layout="vertical">
          <Descriptions.Item label={t("order-id")}>
            {order.id}
          </Descriptions.Item>
          <Descriptions.Item label={t("order-date")}>
            <span dir="ltr">{jalaliDateFormater(new Date(order.date))}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t("day")}>
            {WEEK_DAY.get(order.day)}
          </Descriptions.Item>
          <Descriptions.Item label={t("period")}>
            {order.startHour} _ {order.endHour}
          </Descriptions.Item>
          <Descriptions.Item label={t("status")}>
            {order.status}
          </Descriptions.Item>
          <Descriptions.Item label={t("type")}>{order.type}</Descriptions.Item>
          {order.type !== ScheduleType.online && (
            <>
              <Descriptions.Item label={t("location")}>
                {order.city} - {order.address} - {t("room")} {order.room}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Flex>
    </Modal>
  );
};

export default OrderDetailDialog;
