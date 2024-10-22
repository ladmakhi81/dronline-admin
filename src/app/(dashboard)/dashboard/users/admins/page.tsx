"use client";

import { useGetUsers } from "@/services/user/get-users";
import { GetUsersQuery, User, UserType } from "@/services/user/types";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import TableWrapper from "@/shared-components/table-wrapper";
import { Button, Card, Divider, Flex, Switch } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";
import EditPasswordDialog from "../components/edit-password-dialog";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import { useDeleteUser } from "@/services/user/delete-user";
import { useNotificationStore } from "@/store/notification.store";
import { useEditUser } from "@/services/user/edit-user";
import CreateOrEditAdminDialog from "./components/create-or-edit-admin-dialog";
import { useTranslations } from "next-intl";
import { jalaliDateTimeFormater } from "@/utils/date-format";

const AdminsPage: FC = () => {
  const t = useTranslations("users.admins-page");
  const tGlobal = useTranslations("globals");

  const [queryApi, setQueryApi] = useState<GetUsersQuery>({
    type: UserType.Admin,
    limit: 10,
    page: 0,
  });

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { data: adminsData, refetch: refetchAdmins } = useGetUsers(queryApi);

  const { mutateAsync: editUserMutate } = useEditUser();

  const { mutateAsync: deleteAdminMutate } = useDeleteUser();

  const [selectedAdminToEditPassword, setSelectedAdminToEditPassword] =
    useState<User>();

  const [selectedAdminToEdit, setSelectedAdminToEdit] = useState<User>();

  const [selectedAdminToDelete, setSelectedAdminToDelete] = useState<User>();

  const [isCreateOrEditAdminDialogOpen, setCreateOrEditAdminDialogOpen] =
    useState(false);

  const handleOpenCreateAdminDialog = () => {
    setCreateOrEditAdminDialogOpen(true);
  };

  const handleCloseCreateOrEditAdminDialog = () => {
    setCreateOrEditAdminDialogOpen(false);
    setSelectedAdminToEdit(undefined);
  };

  const handleOpenEditAdminDialog = (admin: User) => {
    setSelectedAdminToEdit(admin);
    setCreateOrEditAdminDialogOpen(true);
  };

  const handleOpenDeleteAdminConfirmation = (admin: User) => {
    setSelectedAdminToDelete(admin);
  };

  const handleCloseDeleteAdminConfirmation = () => {
    setSelectedAdminToDelete(undefined);
  };

  const handleEditUserActiveStatus = (admin: User, isActive: boolean) => {
    editUserMutate({ type: UserType.Admin, isActive, id: admin.id })
      .then(() => {
        refetchAdmins();
        showNotification(t("edit-status-successfully"), "success");
      })
      .catch(() => {});
  };

  const handleConfirmDeleteAdmin = () => {
    if (selectedAdminToDelete?.id) {
      deleteAdminMutate(selectedAdminToDelete.id)
        .then(() => {
          showNotification(t("delete-successfully"), "success");
          handleCloseDeleteAdminConfirmation();
          refetchAdmins();
        })
        .catch(() => {});
    }
  };

  const handleOpenEditPasswordDialog = (admin: User) => {
    setSelectedAdminToEditPassword(admin);
  };

  const handleCloseEditPasswordDialog = () => {
    setSelectedAdminToEditPassword(undefined);
  };

  const handlePageChange = (page: number, limit: number) => {
    setQueryApi((prevState) => ({ ...prevState, page: page - 1, limit }));
  };

  const admins = useMemo(() => {
    return (
      adminsData?.content?.map((admin, adminIndex) => ({
        ...admin,
        index: adminIndex + 1,
      })) || []
    );
  }, [adminsData?.content]);

  const columns = [
    { dataIndex: "index", title: t("row") },
    {
      dataIndex: "fullName",
      title: t("fullName"),
      render: (_: unknown, record: AnyObject) => {
        const admin = record as User;
        return admin.firstName + " " + admin.lastName;
      },
    },
    {
      dataIndex: "phone",
      title: t("phone"),
    },
    {
      dataIndex: "isActive",
      title: t("isActive"),
      render: (isActive: boolean, record: AnyObject) => (
        <Switch
          onChange={handleEditUserActiveStatus.bind(
            null,
            record as User,
            !isActive
          )}
          checked={isActive}
        />
      ),
      width: 150,
    },
    {
      title: tGlobal("created-at"),
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: tGlobal("updated-at"),
      dataIndex: "updatedAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: tGlobal("operation"),
      width: 200,
      render: (_: unknown, doctor: AnyObject) => {
        const admin = doctor as User;

        return (
          <Flex gap="10px" justify="center" align="center">
            <Button
              onClick={handleOpenEditAdminDialog.bind(null, admin)}
              size="small"
              type="link"
            >
              {tGlobal("edit")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenDeleteAdminConfirmation.bind(null, admin)}
              size="small"
              type="link"
            >
              {tGlobal("delete")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenEditPasswordDialog.bind(null, admin)}
              size="small"
              type="link"
            >
              {t("change-password-text")}
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex style={{ height: "100%" }} vertical gap="24px">
      <EmptyWrapper
        isEmpty={adminsData?.count === 0}
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
        btn={{
          click: handleOpenCreateAdminDialog,
          text: t("add-new-admin-btn"),
        }}
      >
        <CreateOrEditAdminDialog
          onClose={handleCloseCreateOrEditAdminDialog}
          open={isCreateOrEditAdminDialogOpen}
          selectedAdmin={selectedAdminToEdit}
          refetchAdmins={refetchAdmins}
        />
        <EditPasswordDialog
          onClose={handleCloseEditPasswordDialog}
          open={!!selectedAdminToEditPassword}
          user={selectedAdminToEditPassword}
        />
        <DeleteConfirmation
          onClose={handleCloseDeleteAdminConfirmation}
          onConfirm={handleConfirmDeleteAdmin}
          title={t("delete-confirmation-title")}
          open={!!selectedAdminToDelete}
          renderBody={() => (
            <>
              {t("delete-confirmation-description", {
                user:
                  selectedAdminToDelete?.firstName +
                  " " +
                  selectedAdminToDelete?.lastName,
                id: selectedAdminToDelete?.id,
              })}
            </>
          )}
        />
        <TableHeader
          createText={t("add-new-admin-btn")}
          headTitle={t("title")}
          onCreate={handleOpenCreateAdminDialog}
        />
        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: "15px", height: "100%" } }}
        >
          <TableWrapper
            dataSource={admins}
            bordered
            rowKey="id"
            size="middle"
            pagination={{
              showSizeChanger: true,
              position: ["bottomCenter"],
              total: adminsData?.count ?? 0,
              onChange: handlePageChange,
            }}
            columns={columns}
          />
        </Card>
      </EmptyWrapper>
    </Flex>
  );
};

export default AdminsPage;
