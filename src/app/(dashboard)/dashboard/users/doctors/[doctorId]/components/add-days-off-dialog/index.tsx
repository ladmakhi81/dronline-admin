"use client";

import { WEEK_DAY } from "@/constant/weekday.constant";
import { useGetScheduleByDoctorId } from "@/services/schedule/get-schedule-by-doctor-id";
import { User } from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { convertJalaliToGregorian } from "@/utils/date-format";
import { Form, Select } from "antd";
import { DatePicker } from "antd-jalali";
import { FC, useMemo } from "react";
import { ADD_DAYS_OFF_VALIDATION_RULES } from "./validation-rules";
import { useAddDaysOff } from "@/services/days-off/add-days-off";
import { Dayjs } from "dayjs";
import { useNotificationStore } from "@/store/notification.store";

interface Props {
  open: boolean;
  onClose: () => void;
  refetchDaysOff: () => void;
  doctor: User;
}

interface FieldTypes {
  schedule: number;
  date: Dayjs;
}

const MAX_LIST_COUNT = 1000000;

const AddDaysOffDialog: FC<Props> = ({
  onClose,
  open,
  refetchDaysOff,
  doctor,
}) => {
  const [form] = Form.useForm<FieldTypes>();

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { mutateAsync: addDaysOffMutate } = useAddDaysOff();

  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useGetScheduleByDoctorId(doctor.id, {
      limit: MAX_LIST_COUNT,
      page: 0,
    });

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = (data: FieldTypes) => {
    addDaysOffMutate({
      date: convertJalaliToGregorian(data.date.format("YYYY-MM-DD")),
      schedule: data.schedule,
    })
      .then(() => {
        refetchDaysOff();
        handleClose();
        showNotification("درخواست مرخصی با موفقیت ثبت شد", "success");
        form.resetFields();
      })
      .catch(() => {});
  };

  const schedulesOptions = useMemo(() => {
    return schedulesData?.content?.map((schedule) => {
      const scheduleDayOfWeek = WEEK_DAY.get(schedule.day);
      const schedulesPeriodTime = schedule.startHour + "_" + schedule.endHour;
      const scheduleLocation =
        schedule.location.city + " " + schedule.location.address;

      return {
        id: schedule.id,
        label: `${scheduleDayOfWeek} - ${schedulesPeriodTime} - ${scheduleLocation}`,
      };
    });
  }, [schedulesData?.content]);

  return (
    <OperationDrawer
      open={open}
      onClose={handleClose}
      title="ثبت درخواست مرخصی"
      onConfirm={() => form.submit()}
    >
      <Form
        requiredMark={false}
        onFinish={handleConfirm}
        layout="vertical"
        form={form}
      >
        <Form.Item
          rules={ADD_DAYS_OFF_VALIDATION_RULES.schedule}
          label="گزینه رزرو برای مرخصی"
          name="schedule"
        >
          <Select
            fieldNames={{
              label: "label",
              value: "id",
            }}
            options={schedulesOptions}
            disabled={isSchedulesLoading}
            size="large"
          />
        </Form.Item>
        <Form.Item
          rules={ADD_DAYS_OFF_VALIDATION_RULES.date}
          name="date"
          label="تاریخ درخواست مرخصی"
        >
          <DatePicker size="large" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddDaysOffDialog;
