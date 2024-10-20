"use client";

import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";
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

const TransactionsPage: FC = () => {
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
    showNotification("لینک پرداخت کپی شد", "success");
  };

  const columns = [
    {
      dataIndex: "id",
      title: "سریال تراکنش",
    },
    {
      dataIndex: "customer",
      title: "مشتری",
      render: (customer: User) => customer.firstName + " " + customer.lastName,
    },
    {
      dataIndex: "doctor",
      title: "پزشک",
      render: (doctor: User) => doctor.firstName + " " + doctor.lastName,
    },
    {
      dataIndex: "amount",
      title: "مبلغ پرداخت شده",
      render: (amount: number) => `${amount.toLocaleString()} تومان`,
    },
    {
      dataIndex: "status",
      title: "وضعیت تراکنش",
    },
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: "عملیات",
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
              جزئیات
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              disabled={transaction.status === TransactionStatus.Payed}
              size="small"
              type="link"
              onClick={handleCopyPayLinkURL.bind(null, transaction)}
            >
              کپی کردن لینک پرداخت
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
              نمایش فاکتور
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
        title="لیست تراکنش ها"
        description="در این صفحه میتوانید لیست تراکنش های ایجاد شده را مشاهده کنید . در حال حاضر تراکنشی ایجاد نشده است"
      >
        <TableHeader headTitle="لیست تراکنش ها" />
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
