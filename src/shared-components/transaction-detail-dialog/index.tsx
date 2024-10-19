"use client";

import { Transaction, TransactionStatus } from "@/services/transaction/types";
import { Descriptions, Flex, Modal } from "antd";
import { FC } from "react";
import { jalaliDateTimeFormater } from "@/utils/date-format";
import UserDetailInfoCard from "@/shared-components/user-detail-info-card";

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const TransactionDetailDialog: FC<Props> = ({ onClose, open, transaction }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      width="660px"
      styles={{ footer: { margin: 0 } }}
      footer={<></>}
      onClose={handleClose}
      open={open}
      onCancel={handleClose}
    >
      <Flex vertical gap="24px">
        <UserDetailInfoCard
          title="اطلاعات مربوط به پرداخت کننده"
          user={transaction.customer}
        />
        <UserDetailInfoCard
          title="اطلاعات مربوط به دریافت کننده"
          user={transaction.doctor}
        />
        <Descriptions
          bordered
          layout="vertical"
          title="اطلاعات مربوط به تراکنش"
        >
          {transaction.order && (
            <Descriptions.Item label="سریال رزرو">
              {transaction.order.id}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="سریال تراکنش">
            {transaction.id}
          </Descriptions.Item>
          <Descriptions.Item label="وضعیت تراکنش">
            <span
              style={{
                color:
                  transaction.status === TransactionStatus.NotPayed
                    ? "var(--ant-red-5)"
                    : "var(--ant-green-7)",
              }}
            >
              {transaction.status === TransactionStatus.Payed
                ? "پرداخت شده"
                : "پرداخت نشده"}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="مبلغ">
            {transaction.amount.toLocaleString()} تومان
          </Descriptions.Item>
          {transaction.status === TransactionStatus.NotPayed ? (
            <Descriptions.Item label="لینک پرداخت">
              {transaction.payedLink}
            </Descriptions.Item>
          ) : (
            <>
              <Descriptions.Item label="تاریخ پرداخت">
                {jalaliDateTimeFormater(transaction.payedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="شماره پیگیری">
                {transaction.refId}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Flex>
    </Modal>
  );
};

export default TransactionDetailDialog;
