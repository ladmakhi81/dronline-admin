"use client";

import { WEEK_DAY } from "@/constant/weekday.constant";
import { useCancelOrder } from "@/services/order/cancel-order";
import { useDeleteOrder } from "@/services/order/delete-order";
import { useGetOrders } from "@/services/order/get-orders";
import { GetOrderQuery, Order, OrderStatus } from "@/services/order/types";
import { User } from "@/services/user/types";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import OrderDetailDialog from "@/shared-components/order-detail-dialog";
import TableHeader from "@/shared-components/table-header";
import TableWrapper from "@/shared-components/table-wrapper";
import TransactionDetailDialog from "@/shared-components/transaction-detail-dialog";
import { useNotificationStore } from "@/store/notification.store";
import {
  jalaliDateFormater,
  jalaliDateTimeFormater,
} from "@/utils/date-format";
import { Button, Card, Divider, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";
import SubmitOrderDialog from "./components/submit-order-dialog";
import { useTranslations } from "next-intl";

const OrdersPage: FC = () => {
  const t = useTranslations("orders-page");
  const tGlobal = useTranslations("globals");

  const [apiQuery, setApiQuery] = useState<GetOrderQuery>({
    limit: 10,
    page: 0,
  });

  const { data: ordersData, refetch: refetchOrders } = useGetOrders(apiQuery);

  const [selectedOrderToDelete, setSelectedOrderToDelete] = useState<Order>();

  const [isSubmitOrderDialogOpen, setSubmitOrderDialogOpen] = useState(false);

  const { mutateAsync: cancelOrderMutate } = useCancelOrder();

  const { mutateAsync: deleteOrderMutate } = useDeleteOrder();

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [selectedOrderToView, setSelectedOrderToView] = useState<Order>();

  const [selectedTransactionOrderToView, setSelectedTransactionOrderToView] =
    useState<Order>();

  const orders = useMemo(() => {
    return ordersData?.content || [];
  }, [ordersData?.content]);

  const handleOpenSubmitOrderDialog = () => {
    setSubmitOrderDialogOpen(true);
  };

  const handleCloseSubmitOrderDialog = () => {
    setSubmitOrderDialogOpen(false);
  };

  const handleOpenViewOrderDialog = (order: Order) => {
    setSelectedOrderToView(order);
  };

  const handleCloseViewOrderDialog = () => {
    setSelectedOrderToView(undefined);
  };

  const handleOpenViewTransactionOrderDialog = (order: Order) => {
    setSelectedTransactionOrderToView(order);
  };

  const handleCancelOrder = (id: number) => {
    cancelOrderMutate(id).then(() => {
      refetchOrders();
      showNotification(`رزرو با سریال ${id} با موفقیت کنسل شد`, "success");
    });
  };

  const handleCloseViewTransactionOrderDialog = () => {
    setSelectedTransactionOrderToView(undefined);
  };

  const handleOpenDeleteOrderConfirmation = (order: Order) => {
    setSelectedOrderToDelete(order);
  };

  const handleCloseDeleteOrderConfirmation = () => {
    setSelectedOrderToDelete(undefined);
  };

  const handleConfirmDeleteOrder = () => {
    if (selectedOrderToDelete?.id) {
      deleteOrderMutate(selectedOrderToDelete.id)
        .then(() => {
          refetchOrders();
          showNotification("حذف نوبت رزرو با موفقیت انجام گردید", "success");
          setSelectedOrderToDelete(undefined);
        })
        .catch(() => {});
    }
  };

  const handlePageChange = (page: number, limit: number) => {
    setApiQuery({ page: page - 1, limit });
  };

  const columns = [
    {
      dataIndex: "id",
      title: t("id"),
    },
    {
      dataIndex: "patient",
      title: t("patient"),
      render: (patient: User) => patient.firstName + " " + patient.lastName,
    },
    {
      dataIndex: "doctor",
      title: t("doctor"),
      render: (doctor: User) => doctor.firstName + " " + doctor.lastName,
    },
    {
      dataIndex: "date",
      title: t("date"),
      render: (date: Date) => jalaliDateFormater(date),
    },
    {
      dataIndex: "time",
      title: t("time"),
      render: (_: unknown, record: AnyObject) => {
        const order = record as Order;
        return order.startHour + "_" + order.endHour;
      },
    },
    {
      dataIndex: "day",
      title: t("day"),
      render: (day: number) => WEEK_DAY.get(day),
    },
    {
      dataIndex: "status",
      title: t("status"),
    },
    {
      dataIndex: "type",
      title: t("type"),
    },
    {
      title: t("created-at"),
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: t("updated-at"),
      dataIndex: "updatedAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: tGlobal("operation"),
      width: 200,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fixed: "right" as any,
      render: (_: unknown, record: AnyObject) => {
        const order = record as Order;
        console.log({ order });
        return (
          <Flex gap="10px" justify="center" align="center">
            <Button
              disabled={order.status === OrderStatus.NotPayed}
              size="small"
              type="link"
              onClick={handleOpenViewTransactionOrderDialog.bind(null, order)}
            >
              {t("transaction")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              disabled={order.status === OrderStatus.Cancel}
              onClick={handleCancelOrder.bind(null, order.id)}
              size="small"
              type="link"
            >
              {t("cancel")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenDeleteOrderConfirmation.bind(null, order)}
              size="small"
              type="link"
            >
              {tGlobal("delete")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenViewOrderDialog.bind(null, order)}
              size="small"
              type="link"
            >
              {tGlobal("detail")}
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex style={{ height: "100%", overflow: "auto" }} vertical gap="24px">
      <SubmitOrderDialog
        onClose={handleCloseSubmitOrderDialog}
        open={isSubmitOrderDialogOpen}
        refetchOrders={refetchOrders}
      />
      <EmptyWrapper
        isEmpty={ordersData?.count === 0}
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
        btn={{ click: handleOpenSubmitOrderDialog, text: t("add-new-btn") }}
      >
        <TableHeader
          headTitle={t("title")}
          createText={t("add-new-btn")}
          onCreate={handleOpenSubmitOrderDialog}
        />
        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: "15px", height: "100%" } }}
        >
          {selectedOrderToView && (
            <OrderDetailDialog
              onClose={handleCloseViewOrderDialog}
              open={!!selectedOrderToView}
              order={selectedOrderToView}
            />
          )}

          {!!selectedTransactionOrderToView && (
            <TransactionDetailDialog
              onClose={handleCloseViewTransactionOrderDialog}
              open={!!selectedTransactionOrderToView}
              transaction={selectedTransactionOrderToView.transaction}
            />
          )}
          <DeleteConfirmation
            onClose={handleCloseDeleteOrderConfirmation}
            onConfirm={handleConfirmDeleteOrder}
            open={!!selectedOrderToDelete}
            title={t("delete-confirmation-title")}
            renderBody={() => (
              <>
                {t("delete-confirmation-text", {
                  user: `${selectedOrderToDelete?.patient?.firstName} ${selectedOrderToDelete?.patient?.lastName}`,
                  id: selectedOrderToDelete?.id,
                })}
              </>
            )}
          />
          <TableWrapper
            dataSource={orders}
            bordered
            rowKey="id"
            size="middle"
            pagination={{
              showSizeChanger: true,
              position: ["bottomCenter"],
              total: ordersData?.count ?? 0,
              onChange: handlePageChange,
            }}
            columns={columns}
          />
        </Card>
      </EmptyWrapper>
    </Flex>
  );
};

export default OrdersPage;
