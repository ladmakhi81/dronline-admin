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

interface Props {
  doctor: User;
}

const DoctorReservationChartTab: FC<Props> = ({ doctor }) => {
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
          showNotification("حذف چارت رزرو با موفقیت انجام شد", "success");
          refetchSchedulesData();
          setSelectedScheduleToDelete(undefined);
        })
        .catch(() => {});
    }
  };

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
    },
    {
      title: "روز هفته",
      dataIndex: "day",
      render: (day: number) => WEEK_DAY.get(day),
    },
    {
      title: "بازه زمانی",
      dataIndex: "period",
      render: (_: unknown, record: AnyObject) => {
        const schedule = record as Schedule;
        return schedule.startHour + " _ " + schedule.endHour;
      },
    },
    {
      title: "نوع برگزاری",
      dataIndex: "type",
    },
    {
      title: "شهر",
      dataIndex: "location",
      render: (location: Location) => {
        return location.city;
      },
    },
    {
      title: "آدرس",
      dataIndex: "location",
      render: (location: Location) => {
        return location.address;
      },
    },
    {
      title: "شماره اتاق",
      dataIndex: "room",
    },
    {
      title: "عملیات",
      width: 70,
      render: (_: unknown, record: AnyObject) => {
        const schedule = record as Schedule;
        return (
          <Button
            onClick={handleOpenDeleteConfirmation.bind(null, schedule)}
            size="small"
            type="link"
          >
            حذف
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
          title="حذف چارت رزرو"
          renderBody={() => (
            <>
              آیا از حذف چارت رزرو در روز{" "}
              {WEEK_DAY.get(selectedScheduleToDelete?.day)} ساعت{" "}
              {selectedScheduleToDelete.startHour} {" - "}
              {selectedScheduleToDelete.endHour} اطمینان دارید؟
            </>
          )}
        />
      )}
      <EmptyWrapper
        isEmpty={schedulesData?.count === 0}
        title="چارت رزرو"
        description="آیتمی در چارت رزرو وجود ندارد, برای ساخت آیتم جدید از دکمه زیر استفاده کنید"
        btn={{ text: "افزودن رزرو جدید", click: handleOpenCreateSchedule }}
      >
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
