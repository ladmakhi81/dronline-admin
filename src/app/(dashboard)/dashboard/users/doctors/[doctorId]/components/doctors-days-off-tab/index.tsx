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
import { useTranslations } from "next-intl";

interface Props {
  doctor: User;
}

const DoctorsDaysOffTab: FC<Props> = ({ doctor }) => {
  const t = useTranslations("users.doctor-detail-page.daysoff-tab");
  const tGlobal = useTranslations("globals");

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
          showNotification(t("delete-successfully"), "success");
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
      title: t("row"),
      dataIndex: "index",
    },
    {
      title: t("date"),
      dataIndex: "date",
      render: (value: Date) => jalaliDateFormater(value),
    },
    {
      title: t("hour"),
      dataIndex: "schedule",
      render: (value: Schedule) => value.startHour + " _ " + value.endHour,
    },
    {
      title: t("created-at"),
      dataIndex: "createdAt",
      render: (createdAt: Date) => jalaliDateTimeFormater(createdAt),
    },
    {
      title: tGlobal("operation"),
      render: (_: unknown, record: AnyObject) => {
        const daysoffItem = record as DaysOff;
        return (
          <Button
            onClick={handleOpenDeleteConfirmation.bind(null, daysoffItem)}
            size="small"
            type="link"
          >
            {tGlobal("delete")}
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
          title={t("delete-confirmation-title")}
          renderBody={() => (
            <>
              {t("delete-confirmation-description", {
                date: jalaliDateFormater(
                  new Date(selectedDaysoffToDelete.date)
                ),
                hour:
                  selectedDaysoffToDelete.schedule.startHour +
                  "_" +
                  selectedDaysoffToDelete.schedule.endHour,
              })}
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
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
        btn={{
          text: t("add-new-daysoff"),
          click: handleOpenCreateDaysOffDialog,
        }}
      >
        <Flex
          onClick={handleOpenCreateDaysOffDialog}
          style={{ marginBottom: "14px" }}
          justify="flex-end"
          align="center"
        >
          <Button type="primary">{t("add-new-daysoff")}</Button>
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
