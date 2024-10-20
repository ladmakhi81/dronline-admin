"use client";

import { MAX_LIST_COUNT_SELECT } from "@/constant/max-list-item-count-dropdown";
import { Order, SubmitOrderReqBody } from "@/services/order/types";
import { Schedule, ScheduleType } from "@/services/schedule/types";
import { useGetUsers } from "@/services/user/get-users";
import { User, UserType } from "@/services/user/types";
import { convertJalaliToGregorian } from "@/utils/date-format";
import { DatePicker, Form, FormInstance, Select } from "antd";
import { Dayjs } from "dayjs";
import moment, { now } from "moment-jalaali";
import { FC, useEffect, useMemo } from "react";

interface Props {
  form: FormInstance;
  onFinish: (data: SubmitOrderReqBody) => void;
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
  doctor: number;
}

const SubmitOrderDoctorForm: FC<Props> = ({
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
  const formWatched = Form.useWatch([], form);

  const { data: doctorsData, isLoading: isDoctorLoading } = useGetUsers({
    type: UserType.Doctor,
    limit: MAX_LIST_COUNT_SELECT,
    page: 0,
  });

  const doctors = doctorsData?.content || [];

  const patientsOptions = patients.map((patient) => ({
    label: patient.firstName + " " + patient.lastName,
    value: patient.id,
  }));

  const doctorsOptions = doctors.map((doctor) => ({
    label: doctor.firstName + " " + doctor.lastName,
    value: doctor.id,
  }));

  const ordersDate = orders.map((order) => order.date);

  const selectedDoctorFormItem = formWatched?.doctor;

  const selectedScheduleTypeFormItem = formWatched?.type;

  const selectedScheduleFormItem = formWatched?.schedule;

  const selectedSchedule = schedules?.find(
    (schedule) => schedule.id === selectedScheduleFormItem
  );

  useEffect(() => {
    handleChangeScheduleApiQuery({
      doctor: selectedDoctorFormItem,
      type: selectedScheduleTypeFormItem,
    });
  }, [selectedDoctorFormItem, selectedScheduleTypeFormItem]);

  useEffect(() => {
    handleChangeOrderApiQuery({
      doctor: selectedDoctorFormItem,
      startHour: selectedSchedule?.startHour,
      endHour: selectedSchedule?.endHour,
    });
  }, [selectedDoctorFormItem, selectedSchedule]);

  const scheduleTypeOptions = [
    {
      label: ScheduleType.online,
      value: ScheduleType.online,
    },
    {
      label: ScheduleType.onsite,
      value: ScheduleType.onsite,
    },
  ];

  const schedulesOptions = schedules?.map((schedule) => ({
    label: schedule.startHour + " _ " + schedule.endHour,
    value: schedule.id,
  }));

  const daysOffSelectedSchedules = useMemo(() => {
    return selectedSchedule?.daysOff?.map((daysOff) => daysOff.date) || [];
  }, [selectedSchedule]);

  const getDisabledDayInDatePicker = (date: Dayjs) => {
    const formatedDate = moment(date.format("YYYY-MM-DD"), "jYYYY-jMM-jDD");
    const isPast = formatedDate.isBefore(now());
    const isDaysOff = daysOffSelectedSchedules?.includes(
      formatedDate.format("YYYY-MM-DD")
    );
    const submitedBefore = ordersDate.includes(
      formatedDate.format("YYYY-MM-DD")
    );
    return isPast || isDaysOff || submitedBefore;
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
      form={form}
      onFinish={handleFinish}
      name="submit-order-by-doctor"
    >
      <Form.Item name="patient" label="بیمار یا مراجعه کننده">
        <Select
          size="large"
          placeholder="بیمار یا مراجعه کننده را انتخاب کنید"
          options={patientsOptions}
          loading={isPatientLoading}
        />
      </Form.Item>
      <Form.Item name="doctor" label="پزشک">
        <Select
          size="large"
          placeholder="پزشک مورد نظر را انتخاب کنید"
          options={doctorsOptions}
          loading={isDoctorLoading}
        />
      </Form.Item>
      <Form.Item name="type" label="نحوه برگزاری جلسه">
        <Select
          options={scheduleTypeOptions}
          size="large"
          placeholder="نحوه برگزاری جلسه را انتخاب کنید"
        />
      </Form.Item>
      <Form.Item
        help={
          selectedSchedule?.type === ScheduleType.onsite
            ? selectedSchedule.location.address
            : ""
        }
        name="schedule"
        label="نوبت باز برای رزرو"
      >
        <Select
          disabled={!selectedDoctorFormItem || !selectedScheduleTypeFormItem}
          loading={isScheduleLoading}
          options={schedulesOptions}
          size="large"
          placeholder="نوبت باز برای رزرو را انتخاب کنید"
        />
      </Form.Item>
      <Form.Item name="date" label="تاریخ ثبت رزرو">
        <DatePicker
          disabledDate={getDisabledDayInDatePicker}
          size="large"
          style={{ width: "100%" }}
          disabled={!selectedSchedule}
        />
      </Form.Item>
    </Form>
  );
};

export default SubmitOrderDoctorForm;
