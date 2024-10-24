"use client";

import { GEOGRIAN_WEEK_DAY, WEEK_DAY } from "@/constant/weekday.constant";
import { useGetScheduleByDoctorId } from "@/services/schedule/get-schedule-by-doctor-id";
import { User } from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { convertJalaliToGregorian } from "@/utils/date-format";
import { DatePicker, Form, Select } from "antd";
import { FC, useMemo } from "react";
import { ADD_DAYS_OFF_VALIDATION_RULES } from "./validation-rules";
import { useAddDaysOff } from "@/services/days-off/add-days-off";
import { Dayjs } from "dayjs";
import { useNotificationStore } from "@/store/notification.store";
import moment, { now } from "moment-jalaali";
import { MAX_LIST_COUNT_SELECT } from "@/constant/max-list-item-count-dropdown";
import { useTranslations } from "next-intl";

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

const AddDaysOffDialog: FC<Props> = ({
  onClose,
  open,
  refetchDaysOff,
  doctor,
}) => {
  const t = useTranslations(
    "users.doctor-detail-page.daysoff-tab.add-daysoff-modal"
  );

  const [form] = Form.useForm<FieldTypes>();

  const formWatched = Form.useWatch([], form);

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { mutateAsync: addDaysOffMutate } = useAddDaysOff();

  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useGetScheduleByDoctorId(doctor.id, {
      limit: MAX_LIST_COUNT_SELECT,
      page: 0,
    });

  const selectedScheduleFormItem = formWatched?.schedule;

  const selectedSchedule = useMemo(() => {
    return schedulesData?.content?.find(
      (schedule) => schedule.id === selectedScheduleFormItem
    );
  }, [schedulesData?.content, selectedScheduleFormItem]);

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
        showNotification(t("add-successfully"), "success");
        form.resetFields();
      })
      .catch(() => {});
  };

  const getDisabledDate = (date: Dayjs) => {
    const isNotSameDay =
      GEOGRIAN_WEEK_DAY.get(date.format("dddd")) !== selectedSchedule?.day;
    const isPast = moment(date.format("YYYY-MM-DD"), "jYYYY-jMM-jDD").isBefore(
      now()
    );

    return isNotSameDay || isPast;
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
      title={t("title")}
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
          label={t("schedule-item")}
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
          label={t("date")}
        >
          <DatePicker
            disabled={!selectedScheduleFormItem}
            disabledDate={getDisabledDate}
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddDaysOffDialog;
