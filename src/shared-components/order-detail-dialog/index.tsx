"use client";

import { Descriptions, Flex, Modal } from "antd";
import { FC } from "react";
import { Order } from "@/services/order/types";
import { jalaliDateFormater } from "@/utils/date-format";
import { WEEK_DAY } from "@/constant/weekday.constant";
import { ScheduleType } from "@/services/schedule/types";
import UserDetailInfoCard from "../user-detail-info-card";

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order;
}

const OrderDetailDialog: FC<Props> = ({ onClose, open, order }) => {
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
          title="اطلاعات مربوط به مراجعه کننده"
          user={order.patient}
        />
        <UserDetailInfoCard title="اطلاعات مربوط به پزشک" user={order.doctor} />
        <Descriptions title="اطلاعات مربوط به رزرو" bordered layout="vertical">
          <Descriptions.Item label="شماره سریال نوبت رزرو">
            {order.id}
          </Descriptions.Item>
          <Descriptions.Item label="تاریخ رزرو">
            <span dir="ltr">{jalaliDateFormater(new Date(order.date))}</span>
          </Descriptions.Item>
          <Descriptions.Item label="روز برگزاری">
            {WEEK_DAY.get(order.day)}
          </Descriptions.Item>
          <Descriptions.Item label="بازه زمانی رزرو">
            {order.startHour} _ {order.endHour}
          </Descriptions.Item>
          <Descriptions.Item label="وضعیت نوبت">
            {order.status}
          </Descriptions.Item>
          <Descriptions.Item label="نحوه برگزاری">
            {order.type}
          </Descriptions.Item>
          {order.type !== ScheduleType.online && (
            <>
              <Descriptions.Item label="محل برگزاری">
                {order.city} - {order.address} - اتاق {order.room}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Flex>
    </Modal>
  );
};

export default OrderDetailDialog;
