"use client";

import { useGetTransactions } from "@/services/transaction/get-transactions";
import { Transaction, TransactionStatus } from "@/services/transaction/types";
import { User } from "@/services/user/types";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import TableWrapper from "@/shared-components/table-wrapper";
import { PageableQuery } from "@/shared-types";
import { useNotificationStore } from "@/store/notification.store";
import { Button, Card, Divider, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";
import OrderDetailDialog from "@/shared-components/order-detail-dialog";
import TransactionDetailDialog from "@/shared-components/transaction-detail-dialog";
import { useTranslations } from "next-intl";
import { jalaliDateTimeFormater } from "@/utils/date-format";

const TransactionsPage: FC = () => {
  const t = useTranslations("transactions-page");
  const tGlobal = useTranslations("globals");
  const [apiQuery, setApiQuery] = useState<PageableQuery>({
    limit: 10,
    page: 0,
  });
  const { data: transactionsData } = useGetTransactions(apiQuery);

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [selectedTransactionToView, setSelectedTransactionToView] =
    useState<Transaction>();

  const [selectedTransactionToViewOrder, setSelectedTransactionToViewOrder] =
    useState<Transaction>();

  const transactions = useMemo(() => {
    return transactionsData?.content || [];
  }, [transactionsData?.content]);

  const handlePageChange = (page: number, limit: number) => {
    setApiQuery({ page: page - 1, limit });
  };

  const handleOpenTransactionViewDialog = (transaction: Transaction) => {
    setSelectedTransactionToView(transaction);
  };

  const handleCloseTransactionViewDialog = () => {
    setSelectedTransactionToView(undefined);
  };

  const handleOpenTransactionViewOrderDialog = (transaction: Transaction) => {
    setSelectedTransactionToViewOrder(transaction);
  };

  const handleCloseTransactionViewOrderDialog = () => {
    setSelectedTransactionToViewOrder(undefined);
  };

  const handleCopyPayLinkURL = (transaction: Transaction) => {
    navigator.clipboard.writeText(transaction.payedLink);
    showNotification(t("copy-link-successfully"), "success");
  };

  const columns = [
    {
      dataIndex: "id",
      title: t("id"),
    },
    {
      dataIndex: "customer",
      title: t("customer"),
      render: (customer: User) => customer.firstName + " " + customer.lastName,
    },
    {
      dataIndex: "doctor",
      title: t("doctor"),
      render: (doctor: User) => doctor.firstName + " " + doctor.lastName,
    },
    {
      dataIndex: "amount",
      title: t("amount"),
      render: (amount: number) =>
        `${amount.toLocaleString()} ${tGlobal("toman")}`,
    },
    {
      dataIndex: "status",
      title: t("status"),
    },
    {
      title: tGlobal("created-at"),
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: tGlobal("updated-at"),
      dataIndex: "updatedAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: tGlobal("operation"),
      width: 200,
      render: (_: unknown, record: AnyObject) => {
        const transaction = record as Transaction;
        return (
          <Flex gap="10px" justify="center" align="center">
            <Button
              onClick={handleOpenTransactionViewDialog.bind(null, transaction)}
              size="small"
              type="link"
            >
              {tGlobal("detail")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              disabled={transaction.status === TransactionStatus.Payed}
              size="small"
              type="link"
              onClick={handleCopyPayLinkURL.bind(null, transaction)}
            >
              {t("copy-link")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenTransactionViewOrderDialog.bind(
                null,
                transaction
              )}
              size="small"
              type="link"
            >
              {t("order-detail-text")}
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex style={{ height: "100%", overflow: "auto" }} vertical gap="24px">
      <EmptyWrapper
        isEmpty={transactionsData?.count === 0}
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
      >
        <TableHeader headTitle={t("title")} />
        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: "15px", height: "100%" } }}
        >
          {selectedTransactionToView && (
            <TransactionDetailDialog
              onClose={handleCloseTransactionViewDialog}
              open={!!selectedTransactionToView}
              transaction={selectedTransactionToView}
            />
          )}
          {selectedTransactionToViewOrder && (
            <OrderDetailDialog
              onClose={handleCloseTransactionViewOrderDialog}
              open={!!selectedTransactionToViewOrder}
              order={selectedTransactionToViewOrder.order}
            />
          )}
          <TableWrapper
            dataSource={transactions}
            bordered
            rowKey="id"
            size="middle"
            pagination={{
              showSizeChanger: true,
              position: ["bottomCenter"],
              total: transactionsData?.count ?? 0,
              onChange: handlePageChange,
            }}
            columns={columns}
          />
        </Card>
      </EmptyWrapper>
    </Flex>
  );
};

export default TransactionsPage;
