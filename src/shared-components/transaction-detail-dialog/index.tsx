"use client";

import { Transaction, TransactionStatus } from "@/services/transaction/types";
import { Descriptions, Flex, Modal } from "antd";
import { FC } from "react";
import { jalaliDateTimeFormater } from "@/utils/date-format";
import UserDetailInfoCard from "@/shared-components/user-detail-info-card";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const TransactionDetailDialog: FC<Props> = ({ onClose, open, transaction }) => {
  const t = useTranslations("common.transaction-detail-modal");

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
          title={t("info-patient")}
          user={transaction.customer}
        />
        <UserDetailInfoCard
          title={t("info-doctor")}
          user={transaction.doctor}
        />
        <Descriptions bordered layout="vertical" title={t("info-transaction")}>
          {transaction.order && (
            <Descriptions.Item label={t("order-id")}>
              {transaction.order.id}
            </Descriptions.Item>
          )}
          <Descriptions.Item label={t("transaction-id")}>
            {transaction.id}
          </Descriptions.Item>
          <Descriptions.Item label={t("status")}>
            <span
              style={{
                color:
                  transaction.status === TransactionStatus.NotPayed
                    ? "var(--ant-red-5)"
                    : "var(--ant-green-7)",
              }}
            >
              {transaction.status === TransactionStatus.Payed
                ? t("payed")
                : t("not-payed")}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={t("price")}>
            {transaction.amount.toLocaleString()} {t("toman")}
          </Descriptions.Item>
          {transaction.status === TransactionStatus.NotPayed ? (
            <Descriptions.Item label={t("pay-link")}>
              {transaction.payedLink}
            </Descriptions.Item>
          ) : (
            <>
              <Descriptions.Item label={t("payed-date")}>
                {jalaliDateTimeFormater(transaction.payedAt)}
              </Descriptions.Item>
              <Descriptions.Item label={t("ref-id")}>
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
