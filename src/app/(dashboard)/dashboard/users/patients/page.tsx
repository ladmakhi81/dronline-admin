"use client";

import { useGetUsers } from "@/services/user/get-users";
import { GetUsersQuery, User, UserType } from "@/services/user/types";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import TableWrapper from "@/shared-components/table-wrapper";
import { Button, Card, Divider, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";
import AddOrEditPatientDialog from "./components/add-or-edit-patient-dialog";
import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import { useDeleteUser } from "@/services/user/delete-user";
import { useNotificationStore } from "@/store/notification.store";
import EditPasswordDialog from "../components/edit-password-dialog";
import { useTranslations } from "next-intl";

const PatientsPage: FC = () => {
  const t = useTranslations("users.patients-page");
  const tGlobal = useTranslations("globals");
  const [queryApi, setQueryApi] = useState<GetUsersQuery>({
    type: UserType.Patient,
    limit: 10,
    page: 0,
  });

  const {
    data: patientsData,
    isLoading: isPatientsDataLoading,
    isFetching: isPatientDataFetching,
    refetch: refetchPatientsData,
  } = useGetUsers(queryApi);

  const { mutateAsync: deleteUserMutate } = useDeleteUser();

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const patients = useMemo(() => {
    return patientsData?.content || [];
  }, [patientsData?.content]);

  const [isCreateOrEditPatientDialogOpen, setCreateOrEditPatientDialogOpen] =
    useState(false);

  const [selectedUserToEdit, setSelectedUserToEdit] = useState<User>();

  const [selectedUserToDelete, setSelectedUserToDelete] = useState<User>();

  const [selectedUserToEditPassword, setSelectedUserToEditPassword] =
    useState<User>();

  const handleOpenCreatePatientDialog = () => {
    setCreateOrEditPatientDialogOpen(true);
  };

  const handleCloseCreatePatientDialog = () => {
    setCreateOrEditPatientDialogOpen(false);
    setSelectedUserToEdit(undefined);
  };

  const handleOpenEditPatientDialog = (patient: User) => {
    setSelectedUserToEdit(patient);
    setCreateOrEditPatientDialogOpen(true);
  };

  const handleOpenEditPasswordDialog = (patient: User) => {
    setSelectedUserToEditPassword(patient);
  };

  const handleCloseEditPasswordDialog = () => {
    setSelectedUserToEditPassword(undefined);
  };

  const handleOpenDeletePatientConfirmationDialog = (patient: User) => {
    setSelectedUserToDelete(patient);
  };

  const handleConfirmDeleteUser = () => {
    if (selectedUserToDelete) {
      deleteUserMutate(selectedUserToDelete?.id)
        .then(() => {
          setSelectedUserToDelete(undefined);
          showNotification(t("delete-successfully"), "success");
          refetchPatientsData();
        })
        .catch(() => {});
    }
  };

  const handleCloseDeletePatientConfirmationDialog = () => {
    setSelectedUserToDelete(undefined);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryApi((prevState) => ({
      ...prevState,
      page: page - 1,
      limit: pageSize,
    }));
  };

  const columns = [
    {
      title: t("id"),
      dataIndex: "id",
    },
    {
      title: t("fullName"),
      dataIndex: "fullName",
      render: (_: unknown, record: AnyObject) => {
        const user = record as User;
        return (
          <>
            {user.firstName} {user.lastName}
          </>
        );
      },
    },
    {
      title: t("phone"),
      dataIndex: "phone",
    },
    {
      title: t("orders-count"),
      dataIndex: "ordersCount",
      render: () => 0,
    },
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: tGlobal("operation"),
      width: 200,
      render: (_: unknown, record: AnyObject) => {
        const user = record as User;

        return (
          <Flex gap="10px" justify="center" align="center">
            <Button
              onClick={handleOpenEditPatientDialog.bind(null, user)}
              size="small"
              type="link"
            >
              {tGlobal("edit")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenEditPasswordDialog.bind(null, user)}
              size="small"
              type="link"
            >
              {t("edit-password")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenDeletePatientConfirmationDialog.bind(
                null,
                user
              )}
              size="small"
              type="link"
            >
              {tGlobal("delete")}
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex style={{ height: "100%" }} vertical gap="24px">
      <EditPasswordDialog
        onClose={handleCloseEditPasswordDialog}
        open={!!selectedUserToEditPassword}
        user={selectedUserToEditPassword}
      />
      <AddOrEditPatientDialog
        onClose={handleCloseCreatePatientDialog}
        open={isCreateOrEditPatientDialogOpen}
        refetchUsers={refetchPatientsData}
        selectedUser={selectedUserToEdit}
      />
      <DeleteConfirmation
        onClose={handleCloseDeletePatientConfirmationDialog}
        onConfirm={handleConfirmDeleteUser}
        open={!!selectedUserToDelete}
        renderBody={() => (
          <>
            {t("delete-confirmation-description", {
              user:
                selectedUserToDelete?.firstName +
                " " +
                selectedUserToDelete?.lastName,
              phone: selectedUserToDelete?.phone,
            })}
          </>
        )}
        title={t("delete-confirmation-title")}
      />

      <EmptyWrapper
        isEmpty={patientsData?.count === 0}
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
        btn={{
          click: handleOpenCreatePatientDialog,
          text: t("add-patient-btn"),
        }}
      >
        <TableHeader
          createText={t("add-patient-btn")}
          headTitle={t("title")}
          onCreate={handleOpenCreatePatientDialog}
        />
        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: "15px", height: "100%" } }}
        >
          <TableWrapper
            bordered
            size="middle"
            dataSource={patients}
            loading={isPatientsDataLoading || isPatientDataFetching}
            columns={columns}
            pagination={{
              position: ["bottomCenter"],
              total: patientsData?.count ?? 0,
              showSizeChanger: true,
              onChange: handlePageChange,
            }}
          />
        </Card>
      </EmptyWrapper>
    </Flex>
  );
};

export default PatientsPage;
