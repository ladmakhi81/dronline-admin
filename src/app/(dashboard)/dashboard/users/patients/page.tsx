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

const PatientsPage: FC = () => {
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
          showNotification("بیمار مورد نظر با موفقیت حذف گردید", "success");
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
      title: "شماره پرونده",
      dataIndex: "id",
    },
    {
      title: "نام و نام خانوادگی بیمار",
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
      title: "شماره تماس بیمار",
      dataIndex: "phone",
    },
    {
      title: "تعداد رزرو های ثبت شده",
      dataIndex: "ordersCount",
      render: () => 0,
    },
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: "عملیات",
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
              ویرایش
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenEditPasswordDialog.bind(null, user)}
              size="small"
              type="link"
            >
              تغییر گذرواژه
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
              حذف
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
            آیا از حذف بیمار {selectedUserToDelete?.firstName}{" "}
            {selectedUserToDelete?.lastName} با شماره تماس{" "}
            {selectedUserToDelete?.phone} اطمینان دارید؟
          </>
        )}
        title="حذف بیمار"
      />

      <EmptyWrapper
        isEmpty={patientsData?.count === 0}
        title="لیست بیماران"
        description="بیماری ایجاد نشده است, برای ساخت بیمار روی افزودن بیمار کلیک کنید"
        btn={{
          click: handleOpenCreatePatientDialog,
          text: "افزودن بیمار جدید",
        }}
      >
        <TableHeader
          createText="افزودن بیمار جدید"
          headTitle="لیست بیماران"
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
