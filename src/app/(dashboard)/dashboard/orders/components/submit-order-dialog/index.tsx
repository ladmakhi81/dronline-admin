"use client";

import OperationDrawer from "@/shared-components/operation-drawer";
import { Form, Tabs } from "antd";
import { FC, useState } from "react";
import SubmitOrderDateForm from "../submit-order-date-form";
import SubmitOrderDoctorForm from "../submit-order-doctor-form";
import { useNotificationStore } from "@/store/notification.store";
import { useSubmitOrder } from "@/services/order/submit-order";
import { GetOrderQuery, SubmitOrderReqBody } from "@/services/order/types";
import { useGetUsers } from "@/services/user/get-users";
import { UserType } from "@/services/user/types";
import { MAX_LIST_COUNT_SELECT } from "@/constant/max-list-item-count-dropdown";
import { GetSchedulesQuery } from "@/services/schedule/types";
import { useGetSchedules } from "@/services/schedule/get-schedules";
import moment from "moment-jalaali";
import { useGetOrders } from "@/services/order/get-orders";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  refetchOrders: () => void;
}

enum SubmitOrderType {
  Date = "Date",
  Doctor = "Doctor",
}

const SubmitOrderDialog: FC<Props> = ({ onClose, open, refetchOrders }) => {
  const t = useTranslations("orders-page.submit-order-modal");
  const { data: patientsData, isLoading: isPatientsLoading } = useGetUsers({
    type: UserType.Patient,
    limit: MAX_LIST_COUNT_SELECT,
    page: 0,
  });

  const [schedulesApiQuery, setSchedulesApiQuery] = useState<GetSchedulesQuery>(
    {
      page: 0,
      limit: MAX_LIST_COUNT_SELECT,
    }
  );

  const [ordersApiQuery, setOrdersApiQuery] = useState<GetOrderQuery>({
    limit: MAX_LIST_COUNT_SELECT,
    page: 0,
    "date.gte": moment().format("YYYY-MM-DD"),
  });

  const { data: ordersData, refetch: refetchSubmitedOrders } =
    useGetOrders(ordersApiQuery);

  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useGetSchedules(schedulesApiQuery);

  const [activeTabKey, setActiveTabKey] = useState<SubmitOrderType>(
    SubmitOrderType.Date
  );

  const { mutateAsync: submitOrderMutate } = useSubmitOrder();

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [submitOrderFormByDate] = Form.useForm();

  const [submitOrderFormByDoctor] = Form.useForm();

  const handleClose = () => {
    onClose();
    submitOrderFormByDate.resetFields();
    submitOrderFormByDoctor.resetFields();
  };

  const handleConfirm = () => {
    if (activeTabKey === SubmitOrderType.Date) {
      submitOrderFormByDate.submit();
    } else if (activeTabKey === SubmitOrderType.Doctor) {
      submitOrderFormByDoctor.submit();
    } else {
      throw new Error("invalid active type");
    }
  };

  const handleFinish = (data: SubmitOrderReqBody) => {
    submitOrderMutate(data)
      .then(() => {
        showNotification(t("submit-successfully"), "success");
        refetchOrders();
        handleClose();
        refetchSubmitedOrders();
      })
      .catch(() => {});
  };

  const handleChangeScheduleApiQuery = (state: Record<string, unknown>) => {
    setSchedulesApiQuery((prevApiQuery) => ({ ...prevApiQuery, ...state }));
  };

  const handleChangeOrderApiQuery = (state: Record<string, unknown>) => {
    setOrdersApiQuery((prevApiQuery) => ({ ...prevApiQuery, ...state }));
  };

  return (
    <OperationDrawer
      open={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={t("title")}
    >
      <Tabs
        activeKey={activeTabKey}
        onChange={(activeKey: string) =>
          setActiveTabKey(activeKey as SubmitOrderType)
        }
        destroyInactiveTabPane
        items={[
          {
            key: SubmitOrderType.Date,
            label: t("submit-by-date"),
            children: (
              <SubmitOrderDateForm
                form={submitOrderFormByDate}
                onFinish={handleFinish}
                patients={patientsData?.content || []}
                isPatientLoading={isPatientsLoading}
                schedules={schedulesData?.content || []}
                isScheduleLoading={isSchedulesLoading}
                handleChangeScheduleApiQuery={handleChangeScheduleApiQuery}
                orders={ordersData?.content || []}
                handleChangeOrderApiQuery={handleChangeOrderApiQuery}
              />
            ),
          },
          {
            key: SubmitOrderType.Doctor,
            label: t("submit-by-doctor"),
            children: (
              <SubmitOrderDoctorForm
                form={submitOrderFormByDoctor}
                onFinish={handleFinish}
                patients={patientsData?.content || []}
                isPatientLoading={isPatientsLoading}
                schedules={schedulesData?.content || []}
                isScheduleLoading={isSchedulesLoading}
                handleChangeScheduleApiQuery={handleChangeScheduleApiQuery}
                orders={ordersData?.content || []}
                handleChangeOrderApiQuery={handleChangeOrderApiQuery}
              />
            ),
          },
        ]}
      ></Tabs>
    </OperationDrawer>
  );
};

export default SubmitOrderDialog;
