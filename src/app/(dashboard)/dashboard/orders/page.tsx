"use client";

import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";
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
import { jalaliDateFormater } from "@/utils/date-format";
import { Button, Card, Divider, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";
import SubmitOrderDialog from "./components/submit-order-dialog";

const OrdersPage: FC = () => {
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
      title: "سریال نوبت",
    },
    {
      dataIndex: "patient",
      title: "مراجعه کننده",
      render: (patient: User) => patient.firstName + " " + patient.lastName,
    },
    {
      dataIndex: "doctor",
      title: "پزشک",
      render: (doctor: User) => doctor.firstName + " " + doctor.lastName,
    },
    {
      dataIndex: "date",
      title: "تاریخ نوبت",
      render: (date: Date) => jalaliDateFormater(date),
    },
    {
      dataIndex: "time",
      title: "زمان نوبت",
      render: (_: unknown, record: AnyObject) => {
        const order = record as Order;
        return order.startHour + "_" + order.endHour;
      },
    },
    {
      dataIndex: "day",
      title: "روز هفته",
      render: (day: number) => WEEK_DAY.get(day),
    },
    {
      dataIndex: "status",
      title: "وضعیت رزرو",
    },
    {
      dataIndex: "type",
      title: "نحوه برگزاری",
    },
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: "عملیات",
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
              تراکنش
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              disabled={order.status === OrderStatus.Cancel}
              onClick={handleCancelOrder.bind(null, order.id)}
              size="small"
              type="link"
            >
              کنسل کردن
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenDeleteOrderConfirmation.bind(null, order)}
              size="small"
              type="link"
            >
              حذف
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenViewOrderDialog.bind(null, order)}
              size="small"
              type="link"
            >
              جزئیات
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
        title="لیست نوبت های رزرو شده"
        description="نوبت رزرو شده ای یافت نشد, برای ثبت رزرو نوبت از دکمه زیر استفاده کنید"
        btn={{ click: handleOpenSubmitOrderDialog, text: "ثبت رزرو نوبت" }}
      >
        <TableHeader
          headTitle="لیست نوبت های رزرو شده"
          createText="ثبت نوبت جدید"
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
            title="حذف رزرو نوبت"
            renderBody={() => (
              <>
                آیا از حذف نوبت رزرو برای{" "}
                {selectedOrderToDelete?.patient?.firstName}{" "}
                {selectedOrderToDelete?.patient?.lastName} با سریال{" "}
                {selectedOrderToDelete?.id} اطمینان دارید؟
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
