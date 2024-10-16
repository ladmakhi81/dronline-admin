"use client";

import { useDeleteDaysOffById } from "@/services/days-off/delete-days-off-by-id";
import { useGetDaysOffByDoctorId } from "@/services/days-off/get-days-off-by-doctor-id";
import { DaysOff } from "@/services/days-off/types";
import { Schedule } from "@/services/schedule/types";
import { User } from "@/services/user/types";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import TableWrapper from "@/shared-components/table-wrapper";
import { useNotificationStore } from "@/store/notification.store";
import {
  jalaliDateFormater,
  jalaliDateTimeFormater,
} from "@/utils/date-format";
import { Button, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";
import AddDaysOffDialog from "../add-days-off-dialog";
import EmptyWrapper from "@/shared-components/empty-wrapper";

interface Props {
  doctor: User;
}

const DoctorsDaysOffTab: FC<Props> = ({ doctor }) => {
  const { mutateAsync: deleteDaysOffMutate } = useDeleteDaysOffById();

  const {
    data: daysOffData,
    isLoading: isDaysOffLoading,
    isFetching: isDaysOffFetching,
    refetch: refetchDaysOff,
  } = useGetDaysOffByDoctorId(doctor.id);

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [selectedDaysoffToDelete, setSelectedDaysOffToDelete] =
    useState<DaysOff>();

  const [isCreateDaysoffDialogOpen, setCreateDaysoffDialogOpen] =
    useState(false);

  const handleOpenCreateDaysOffDialog = () => {
    setCreateDaysoffDialogOpen(true);
  };

  const handleCloseCreateDaysOffDialog = () => {
    setCreateDaysoffDialogOpen(false);
  };

  const handleOpenDeleteConfirmation = (daysoffItem: DaysOff) => {
    setSelectedDaysOffToDelete(daysoffItem);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedDaysOffToDelete(undefined);
  };

  const handleConfirmDelete = () => {
    if (selectedDaysoffToDelete) {
      deleteDaysOffMutate(selectedDaysoffToDelete.id)
        .then(() => {
          refetchDaysOff();
          setSelectedDaysOffToDelete(undefined);
          showNotification(
            "حذف درخواست مرخصی با موفقیت انجام گردید",
            "success"
          );
        })
        .catch(() => {});
    }
  };

  const daysOff = useMemo(() => {
    return (
      daysOffData?.map((daysoffItem, daysoffIndex) => ({
        ...daysoffItem,
        index: daysoffIndex + 1,
      })) || []
    );
  }, [daysOffData]);

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
    },
    {
      title: "تاریخ مرخصی",
      dataIndex: "date",
      render: (value: Date) => jalaliDateFormater(value),
    },
    {
      title: "ساعت مرخصی",
      dataIndex: "schedule",
      render: (value: Schedule) => value.startHour + " _ " + value.endHour,
    },
    {
      title: "تاریخ ثبت درخواست",
      dataIndex: "createdAt",
      render: (createdAt: Date) => jalaliDateTimeFormater(createdAt),
    },
    {
      title: "عملیات",
      render: (_: unknown, record: AnyObject) => {
        const daysoffItem = record as DaysOff;
        return (
          <Button
            onClick={handleOpenDeleteConfirmation.bind(null, daysoffItem)}
            size="small"
            type="link"
          >
            حذف
          </Button>
        );
      },
    },
  ];

  return (
    <Flex vertical style={{ height: "100%", width: "100%", overflowY: "auto" }}>
      {selectedDaysoffToDelete && (
        <DeleteConfirmation
          onClose={handleCloseDeleteConfirmation}
          onConfirm={handleConfirmDelete}
          open={!!selectedDaysoffToDelete}
          title="حذف درخواست مرخصی"
          renderBody={() => (
            <>
              آیا از حذف درخواست مرخصی در تاریخ{" "}
              <span style={{ marginInline: "5px" }} dir="ltr">
                {jalaliDateFormater(new Date(selectedDaysoffToDelete.date))}
              </span>
              برای ساعت {selectedDaysoffToDelete.schedule.startHour}_
              {selectedDaysoffToDelete.schedule.endHour} اطمینان دارید ؟
            </>
          )}
        />
      )}
      <AddDaysOffDialog
        onClose={handleCloseCreateDaysOffDialog}
        open={isCreateDaysoffDialogOpen}
        refetchDaysOff={refetchDaysOff}
        doctor={doctor}
      />
      <EmptyWrapper
        isEmpty={daysOff.length === 0}
        title="درخواست مرخصی"
        description="درخواست مرخصی موجود نیست, برای ایجاد درخواست مرخصی باید روی دکمه زیر کلیک کنید"
        btn={{
          text: "درخواست مرخصی جدید",
          click: handleOpenCreateDaysOffDialog,
        }}
      >
        <Flex
          onClick={handleOpenCreateDaysOffDialog}
          style={{ marginBottom: "14px" }}
          justify="flex-end"
          align="center"
        >
          <Button type="primary">ثبت درخواست مرخصی</Button>
        </Flex>
        <TableWrapper
          loading={isDaysOffLoading || isDaysOffFetching}
          bordered
          dataSource={daysOff}
          size="middle"
          rowKey="id"
          columns={columns}
          pagination={false}
        />
      </EmptyWrapper>
    </Flex>
  );
};

export default DoctorsDaysOffTab;
