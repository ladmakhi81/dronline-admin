"use client";

import { WEEK_DAY } from "@/constant/weekday.constant";
import { Location } from "@/services/location/types";
import { useDeleteScheduleById } from "@/services/schedule/delete-schedule-by-id";
import { useGetScheduleByDoctorId } from "@/services/schedule/get-schedule-by-doctor-id";
import { Schedule } from "@/services/schedule/types";
import { User } from "@/services/user/types";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableWrapper from "@/shared-components/table-wrapper";
import { PageableQuery } from "@/shared-types";
import { useNotificationStore } from "@/store/notification.store";
import { Button, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";
import AddScheduleDialog from "../add-schedule-dialog";
import { useTranslations } from "next-intl";

interface Props {
  doctor: User;
}

const DoctorReservationChartTab: FC<Props> = ({ doctor }) => {
  const t = useTranslations("users.doctor-detail-page.reservation-chart-tab");
  const tGlobal = useTranslations("globals");

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const [selectedScheduleToDelete, setSelectedScheduleToDelete] =
    useState<Schedule>();

  const [isCreateScheduleDialogOpen, setCreateScheduleDialogOpen] =
    useState(false);

  const handleOpenCreateSchedule = () => {
    setCreateScheduleDialogOpen(true);
  };

  const handleCloseCreateSchedule = () => {
    setCreateScheduleDialogOpen(false);
  };

  const [apiQuery, setApiQuery] = useState<PageableQuery>({
    limit: 10,
    page: 0,
  });

  const {
    data: schedulesData,
    refetch: refetchSchedulesData,
    isFetching: isFetchingSchedules,
    isLoading: isSchedulesLoading,
  } = useGetScheduleByDoctorId(doctor.id, apiQuery);

  const { mutateAsync: deleteScheduleMutate } = useDeleteScheduleById();

  const handleOpenDeleteConfirmation = (schedule: Schedule) => {
    setSelectedScheduleToDelete(schedule);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedScheduleToDelete(undefined);
  };

  const handleConfirmDeleteSchedule = () => {
    if (selectedScheduleToDelete) {
      deleteScheduleMutate(selectedScheduleToDelete.id)
        .then(() => {
          showNotification(t("delete-successfully"), "success");
          refetchSchedulesData();
          setSelectedScheduleToDelete(undefined);
        })
        .catch(() => {});
    }
  };

  const columns = [
    {
      title: t("row"),
      dataIndex: "index",
    },
    {
      title: t("day"),
      dataIndex: "day",
      render: (day: number) => WEEK_DAY.get(day),
    },
    {
      title: t("period"),
      dataIndex: "period",
      render: (_: unknown, record: AnyObject) => {
        const schedule = record as Schedule;
        return schedule.startHour + " _ " + schedule.endHour;
      },
    },
    {
      title: t("type"),
      dataIndex: "type",
    },
    {
      title: t("city"),
      dataIndex: "location",
      render: (location: Location) => {
        return location?.city;
      },
    },
    {
      title: t("address"),
      dataIndex: "location",
      render: (location: Location) => {
        return location?.address;
      },
    },
    {
      title: t("room"),
      dataIndex: "room",
    },
    {
      title: tGlobal("operation"),
      width: 70,
      render: (_: unknown, record: AnyObject) => {
        const schedule = record as Schedule;
        return (
          <Button
            onClick={handleOpenDeleteConfirmation.bind(null, schedule)}
            size="small"
            type="link"
          >
            {tGlobal("delete")}
          </Button>
        );
      },
    },
  ];

  const handleChangePage = (page: number, pageSize: number) => {
    setApiQuery((prevState) => ({
      ...prevState,
      page: page - 1,
      limit: pageSize,
    }));
  };

  const schedules = useMemo(() => {
    return (
      schedulesData?.content?.map((schedule, scheduleIndex) => ({
        ...schedule,
        index: scheduleIndex + 1,
      })) || []
    );
  }, [schedulesData?.content]);

  return (
    <Flex vertical style={{ height: "100%", width: "100%", overflowY: "auto" }}>
      <AddScheduleDialog
        doctor={doctor}
        onClose={handleCloseCreateSchedule}
        open={isCreateScheduleDialogOpen}
        refetchSchedules={refetchSchedulesData}
      />
      {selectedScheduleToDelete && (
        <DeleteConfirmation
          onConfirm={handleConfirmDeleteSchedule}
          onClose={handleCloseDeleteConfirmation}
          open={!!selectedScheduleToDelete}
          title={t("delete-confirmation-title")}
          renderBody={() => (
            <>
              {t("delete-confirmation-description", {
                day: WEEK_DAY.get(selectedScheduleToDelete?.day),
                hour:
                  selectedScheduleToDelete.startHour +
                  " - " +
                  selectedScheduleToDelete.endHour,
              })}
            </>
          )}
        />
      )}
      <EmptyWrapper
        isEmpty={schedulesData?.count === 0}
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
        btn={{ text: t("add-new-schedule"), click: handleOpenCreateSchedule }}
      >
        <Flex
          onClick={handleOpenCreateSchedule}
          style={{ marginBottom: "14px" }}
          justify="flex-end"
          align="center"
        >
          <Button type="primary">{t("add-new-schedule")}</Button>
        </Flex>
        <TableWrapper
          loading={isFetchingSchedules || isSchedulesLoading}
          bordered
          dataSource={schedules}
          size="middle"
          rowKey="id"
          columns={columns}
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true,
            onChange: handleChangePage,
            total: schedulesData?.count ?? 0,
          }}
        />
      </EmptyWrapper>
    </Flex>
  );
};

export default DoctorReservationChartTab;
