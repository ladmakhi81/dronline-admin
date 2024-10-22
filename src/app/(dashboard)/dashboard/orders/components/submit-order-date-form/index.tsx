"use client";

import { GEOGRIAN_WEEK_DAY, WEEK_DAY } from "@/constant/weekday.constant";
import { Order, SubmitOrderReqBody } from "@/services/order/types";
import { Schedule, ScheduleType } from "@/services/schedule/types";
import { User } from "@/services/user/types";
import { convertJalaliToGregorian } from "@/utils/date-format";
import { DatePicker, Form, FormInstance, Select } from "antd";
import { Dayjs } from "dayjs";
import moment, { now } from "moment-jalaali";
import { useTranslations } from "next-intl";
import { FC, useEffect, useMemo } from "react";

interface Props {
  onFinish: (data: SubmitOrderReqBody) => void;
  form: FormInstance;
  patients: User[];
  isPatientLoading: boolean;
  schedules: Schedule[];
  isScheduleLoading: boolean;
  handleChangeScheduleApiQuery: (state: Record<string, unknown>) => void;
  orders: Order[];
  handleChangeOrderApiQuery: (state: Record<string, unknown>) => void;
}

interface FieldsType {
  patient: number;
  type: ScheduleType;
  schedule: number;
  date: Dayjs;
}

const SubmitOrderDateForm: FC<Props> = ({
  form,
  onFinish,
  isPatientLoading,
  patients,
  handleChangeScheduleApiQuery,
  isScheduleLoading,
  schedules,
  handleChangeOrderApiQuery,
  orders,
}) => {
  const t = useTranslations(
    "orders-page.submit-order-modal.submit-by-date-modal"
  );

  const ordersDate = orders.map((order) => order.date);

  const formWatched = Form.useWatch([], form);

  const selectedDayFormItem = formWatched?.day;

  const selectedScheduleFormItem = formWatched?.schedule;

  const selectedSchedule = useMemo(() => {
    return schedules.find(
      (schedule) => schedule.id === selectedScheduleFormItem
    );
  }, [schedules, selectedScheduleFormItem]);

  useEffect(() => {
    if (selectedDayFormItem) {
      handleChangeScheduleApiQuery({
        day: selectedDayFormItem,
      });
    }
  }, [selectedDayFormItem]);

  useEffect(() => {
    if (selectedSchedule) {
      handleChangeOrderApiQuery({
        doctor: selectedSchedule.doctor.id,
        startHour: selectedSchedule.startHour,
        endHour: selectedSchedule.endHour,
      });
    }
  }, [selectedSchedule]);

  const scheduleTypeOptions = useMemo(() => {
    if (!selectedSchedule) return [];
    if (selectedSchedule.type === ScheduleType.both) {
      return [
        {
          label: ScheduleType.online,
          value: ScheduleType.online,
        },
        {
          label: ScheduleType.onsite,
          value: ScheduleType.onsite,
        },
      ];
    }
    return [
      {
        label: selectedSchedule.type,
        value: selectedSchedule.type,
      },
    ];
  }, [selectedSchedule]);

  const daysOffSelectedSchedules = useMemo(() => {
    return selectedSchedule?.daysOff?.map((daysOff) => daysOff.date) || [];
  }, [selectedSchedule]);

  const patientsOptions = patients.map((patient) => ({
    label: patient.firstName + " " + patient.lastName,
    value: patient.id,
  }));

  const weekdaysOptions = Array.from(WEEK_DAY.entries()).map(
    ([value, label]) => ({
      label,
      value,
    })
  );

  const schedulesOptions = schedules.map((schedule) => ({
    label: `${schedule.startHour}_${schedule.endHour} - ${schedule.doctor.firstName} ${schedule.doctor.lastName} - ${schedule.location.address}`,
    value: schedule.id,
  }));

  const getDisabledDayInDatePicker = (date: Dayjs) => {
    const formatedDate = moment(date.format("YYYY-MM-DD"), "jYYYY-jMM-jDD");
    const isNotSameDay =
      GEOGRIAN_WEEK_DAY.get(formatedDate.format("dddd")) !==
      selectedDayFormItem;
    const isPast = formatedDate.isBefore(now());
    const isDaysOff = daysOffSelectedSchedules.includes(
      formatedDate.format("YYYY-MM-DD")
    );
    const submitedBefore = ordersDate.includes(
      formatedDate.format("YYYY-MM-DD")
    );
    return isNotSameDay || isPast || isDaysOff || submitedBefore;
  };

  const handleFinish = (data: FieldsType) => {
    onFinish({
      date: convertJalaliToGregorian(data.date.format("YYYY-MM-DD")),
      patient: data.patient,
      schedule: data.schedule,
      type: data.type,
    });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      form={form}
      name="submit-order-form"
      initialValues={{
        patient: undefined,
        day: undefined,
        schedule: undefined,
        type: undefined,
        date: undefined,
      }}
    >
      <Form.Item name="patient" label={t("patient")}>
        <Select
          loading={isPatientLoading}
          options={patientsOptions}
          placeholder={t("patient-placeholder")}
          size="large"
        />
      </Form.Item>
      <Form.Item name="day" label={t("day")}>
        <Select
          loading={isPatientLoading}
          options={weekdaysOptions}
          placeholder={t("day-placeholder")}
          size="large"
        />
      </Form.Item>
      <Form.Item name="schedule" label={t("schedule")}>
        <Select
          options={schedulesOptions}
          placeholder={t("schedule-placeholder")}
          size="large"
          disabled={!selectedDayFormItem}
          loading={isScheduleLoading}
        />
      </Form.Item>
      <Form.Item name="type" label={t("type")}>
        <Select
          options={scheduleTypeOptions}
          placeholder={t("type-placeholder")}
          size="large"
          disabled={!selectedSchedule}
        />
      </Form.Item>
      <Form.Item name="date" label={t("date")}>
        <DatePicker
          disabledDate={getDisabledDayInDatePicker}
          style={{ width: "100%" }}
          size="large"
        />
      </Form.Item>
    </Form>
  );
};

export default SubmitOrderDateForm;
