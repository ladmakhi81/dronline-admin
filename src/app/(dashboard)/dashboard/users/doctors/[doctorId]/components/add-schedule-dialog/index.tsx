"use client";

import { WEEK_DAY } from "@/constant/weekday.constant";
import { useGetLocations } from "@/services/location/get-locations";
import { useAddSchedule } from "@/services/schedule/add-schedule";
import { ScheduleType } from "@/services/schedule/types";
import { User } from "@/services/user/types";
import OperationDrawer from "@/shared-components/operation-drawer";
import { useNotificationStore } from "@/store/notification.store";
import { Form, Input, Select, TimePicker } from "antd";
import { Dayjs } from "dayjs";
import { FC, useMemo } from "react";
import { ADD_SCHEDULE_VALIDATION_RULES } from "./validation-rules";

interface Props {
  open: boolean;
  onClose: () => void;
  refetchSchedules: () => void;
  doctor: User;
}

interface FieldTypes {
  day: number;
  endHour: Dayjs;
  startHour: Dayjs;
  location: number;
  room: number;
  type: ScheduleType;
}

const MAX_LIMIT_COUNT = 10000;

const AddScheduleDialog: FC<Props> = ({
  doctor,
  onClose,
  open,
  refetchSchedules,
}) => {
  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { mutateAsync: addScheduleMutate } = useAddSchedule();

  const [form] = Form.useForm<FieldTypes>();

  const formWatched = Form.useWatch([], form);

  const { data: locationsData, isLoading: isLocationDataLoading } =
    useGetLocations({ limit: MAX_LIMIT_COUNT, page: 0 });

  const locations = useMemo(() => {
    return (
      locationsData?.content?.map((location) => ({
        label: location.city + " " + location.address,
        value: location.id,
      })) || []
    );
  }, [locationsData?.content]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = (data: FieldTypes) => {
    addScheduleMutate({
      day: data.day,
      doctor: doctor.id,
      endHour: data.endHour.format("HH:mm"),
      startHour: data.startHour.format("HH:mm"),
      location: data.location,
      room: Number(data.room),
      type: data.type,
    })
      .then(() => {
        handleClose();
        form.resetFields();
        refetchSchedules();
        showNotification("اطلاعات جدید رزرو ثبت شد", "success");
      })
      .catch(() => {});
  };

  const WEEK_OPTIONS = Array.from(WEEK_DAY.entries()).map(
    ([dayId, dayLabel]) => ({
      label: dayLabel,
      value: dayId,
    })
  );

  const SCHEDULE_TYPE_OPTIONS = [
    { label: "حضوری و آنلاین", value: ScheduleType.both },
    { label: "حضوری", value: ScheduleType.onsite },
    { label: "آنلاین", value: ScheduleType.online },
  ];

  const canSelectRoomAndLocation = [
    ScheduleType.both,
    ScheduleType.onsite,
  ].includes(formWatched?.type);

  return (
    <OperationDrawer
      onConfirm={() => form.submit()}
      title="افزودن آیتم جدید به چارت رزرو"
      open={open}
      onClose={handleClose}
    >
      <Form
        onFinish={handleConfirm}
        layout="vertical"
        form={form}
        name="add-schedule-form"
        requiredMark={false}
      >
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.day}
          name="day"
          label="روز هفته"
        >
          <Select
            placeholder="انتخاب روز هفته"
            size="large"
            options={WEEK_OPTIONS}
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.type}
          name="type"
          label="نوع برگزاری جلسه"
        >
          <Select
            placeholder="حضوری یا آنلاین"
            size="large"
            options={SCHEDULE_TYPE_OPTIONS}
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.location(
            canSelectRoomAndLocation
          )}
          name="location"
          label="محل برگزاری"
        >
          <Select
            disabled={!canSelectRoomAndLocation}
            placeholder="انتخاب محل برگزاری"
            size="large"
            options={locations}
            loading={isLocationDataLoading}
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.room(canSelectRoomAndLocation)}
          name="room"
          label="اتاق"
        >
          <Input
            disabled={!canSelectRoomAndLocation}
            placeholder="اتاق مربوط به برگزاری جلسه"
            size="large"
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.startHour}
          name="startHour"
          label="زمان شروع جلسه"
        >
          <TimePicker size="large" format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.endHour}
          name="endHour"
          label="زمان پایان جلسه"
        >
          <TimePicker size="large" format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddScheduleDialog;
