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
import { MAX_LIST_COUNT_SELECT } from "@/constant/max-list-item-count-dropdown";
import { useTranslations } from "next-intl";

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

const AddScheduleDialog: FC<Props> = ({
  doctor,
  onClose,
  open,
  refetchSchedules,
}) => {
  const t = useTranslations(
    "users.doctor-detail-page.reservation-chart-tab.add-new-schedule-modal"
  );

  const tGlobals = useTranslations("globals");

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { mutateAsync: addScheduleMutate } = useAddSchedule();

  const [form] = Form.useForm<FieldTypes>();

  const formWatched = Form.useWatch([], form);

  const { data: locationsData, isLoading: isLocationDataLoading } =
    useGetLocations({ limit: MAX_LIST_COUNT_SELECT, page: 0 });

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
        showNotification(t("added-successfully"), "success");
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
    { label: tGlobals(ScheduleType.both), value: ScheduleType.both },
    { label: tGlobals(ScheduleType.onsite), value: ScheduleType.onsite },
    { label: tGlobals(ScheduleType.online), value: ScheduleType.online },
  ];

  const canSelectRoomAndLocation = [
    ScheduleType.both,
    ScheduleType.onsite,
  ].includes(formWatched?.type);

  return (
    <OperationDrawer
      onConfirm={() => form.submit()}
      title={t("title")}
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
          label={t("day")}
        >
          <Select
            placeholder={t("day-placeholder")}
            size="large"
            options={WEEK_OPTIONS}
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.type}
          name="type"
          label={t("type")}
        >
          <Select
            placeholder={t("type-placeholder")}
            size="large"
            options={SCHEDULE_TYPE_OPTIONS}
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.location(
            canSelectRoomAndLocation
          )}
          name="location"
          label={t("location")}
        >
          <Select
            disabled={!canSelectRoomAndLocation}
            placeholder={t("location-placeholder")}
            size="large"
            options={locations}
            loading={isLocationDataLoading}
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.room(canSelectRoomAndLocation)}
          name="room"
          label={t("room")}
        >
          <Input
            disabled={!canSelectRoomAndLocation}
            placeholder={t("room-placeholder")}
            size="large"
          />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.startHour}
          name="startHour"
          label={t("start-hour")}
        >
          <TimePicker size="large" format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          rules={ADD_SCHEDULE_VALIDATION_RULES.endHour}
          name="endHour"
          label={t("end-hour")}
        >
          <TimePicker size="large" format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </OperationDrawer>
  );
};

export default AddScheduleDialog;
