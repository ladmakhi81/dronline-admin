"use client";

import { DASHBOARD_URLS } from "@/constant/dashboard-urls.constant";
import { useGetUsers } from "@/services/user/get-users";
import {
  CreateDoctorReqBody,
  EditDoctorReqBody,
  GetUsersQuery,
  User,
  UserType,
} from "@/services/user/types";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import TableWrapper from "@/shared-components/table-wrapper";
import { Button, Card, Divider, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { useRouter } from "nextjs-toploader/app";
import { ChangeEvent, FC, useMemo, useState } from "react";
import AddOrEditDoctorDialog from "./components/add-or-edit-doctor-dialog";
import EditPasswordDialog from "../components/edit-password-dialog";
import { useCreateUser } from "@/services/user/create-user";
import { useEditUser } from "@/services/user/edit-user";
import { useNotificationStore } from "@/store/notification.store";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import { useDeleteUser } from "@/services/user/delete-user";
import { useUploadUserImage } from "@/services/user/upload-image";
import { useTranslations } from "next-intl";
import { jalaliDateTimeFormater } from "@/utils/date-format";

const DoctorsPage: FC = () => {
  const t = useTranslations("users.admins-page");
  const tGlobal = useTranslations("globals");

  const [queryApi, setQueryApi] = useState<GetUsersQuery>({
    type: UserType.Doctor,
    limit: 10,
    page: 0,
  });

  const { data: doctorsData, refetch: refetchDoctors } = useGetUsers(queryApi);

  const { mutateAsync: deleteDoctorMutate } = useDeleteUser();

  const { mutateAsync: createDoctorMutate } = useCreateUser();

  const { mutateAsync: editDoctorMutate } = useEditUser();

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [isCreateOrEditDoctorDialogOpen, setCreateOrEditDoctorDialogOpen] =
    useState(false);

  const [selectedDoctorToEdit, setSelectedDoctorToEdit] = useState<User>();

  const [selectedDoctorToDelete, setSelectedDoctorToDelete] = useState<User>();

  const [selectedDoctorToEditPassword, setSelectedDoctorToEditPassword] =
    useState<User>();

  const router = useRouter();

  const { mutateAsync: uploadDoctorImage } = useUploadUserImage();

  const handleOpenCreateDoctorDialog = () => {
    setCreateOrEditDoctorDialogOpen(true);
  };

  const handleOpenDeleteDoctorConfirmation = (doctor: User) => {
    setSelectedDoctorToDelete(doctor);
  };

  const handleCloseDeleteDoctorConfirmation = () => {
    setSelectedDoctorToDelete(undefined);
  };

  const handleConfirmDeleteDoctor = () => {
    if (selectedDoctorToDelete) {
      deleteDoctorMutate(selectedDoctorToDelete.id)
        .then(() => {
          showNotification(t("delete-doctor-successfully"), "success");
          handleCloseDeleteDoctorConfirmation();
          refetchDoctors();
        })
        .catch(() => {});
    }
  };

  const handleOpenEditDoctorPassword = (doctor: User) => {
    setSelectedDoctorToEditPassword(doctor);
  };

  const handleCloseEditDoctorPassword = () => {
    setSelectedDoctorToEditPassword(undefined);
  };

  const handleViewDoctorDetail = (doctor: User) => {
    router.push(DASHBOARD_URLS.doctors_users_detail(doctor.id));
  };

  const handleCloseCreateOrEditDoctorDialog = () => {
    setCreateOrEditDoctorDialogOpen(false);
    setSelectedDoctorToEdit(undefined);
  };

  const handleOpenEditDoctorDialog = (doctor: User) => {
    setSelectedDoctorToEdit(doctor);
    setCreateOrEditDoctorDialogOpen(true);
  };

  const handleConfirmCreateOrEditDoctor = (
    data: CreateDoctorReqBody | EditDoctorReqBody
  ) => {
    if (selectedDoctorToEdit) {
      editDoctorMutate({
        ...(data as EditDoctorReqBody),
        id: selectedDoctorToEdit.id,
        type: UserType.Doctor,
      })
        .then(() => {
          refetchDoctors();
          handleCloseCreateOrEditDoctorDialog();
          showNotification(t("edit-doctor-successfully"), "success");
        })
        .catch(() => {});
    } else {
      createDoctorMutate({
        ...(data as CreateDoctorReqBody),
        type: UserType.Doctor,
      })
        .then(() => {
          refetchDoctors();
          handleCloseCreateOrEditDoctorDialog();
          showNotification(t("create-doctor-successfully"), "success");
        })
        .catch(() => {});
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryApi((prevState) => ({
      ...prevState,
      limit: pageSize,
      page: page - 1,
    }));
  };

  const handleChangeProfile = (
    id: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = Array.from(event.target.files || []).at(0);
    if (file) {
      const payload = new FormData();
      payload.append("image", file);
      uploadDoctorImage(payload)
        .then((uploadResponse) => {
          if (uploadResponse?.filePath) {
            return editDoctorMutate({
              image: uploadResponse.filePath,
              type: UserType.Doctor,
              id,
            });
          }
        })
        .then(() => {
          refetchDoctors();
          showNotification(t("upload-profile-image-successfully"), "success");
        })
        .catch(() => {});
    }
  };

  const doctors = useMemo(() => {
    return doctorsData?.content || [];
  }, [doctorsData?.content]);

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
      title: t("phone-1"),
      dataIndex: "phone",
    },
    {
      title: t("phone-2"),
      dataIndex: "phone2",
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
      render: (_: unknown, record: AnyObject) => {
        const doctor = record as User;
        return (
          <Flex gap="10px" justify="center" align="center">
            <Button
              onClick={handleViewDoctorDetail.bind(null, doctor)}
              size="small"
              type="link"
            >
              {tGlobal("detail")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenEditDoctorPassword.bind(null, doctor)}
              size="small"
              type="link"
            >
              {t("edit-password-text")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenEditDoctorDialog.bind(null, doctor)}
              size="small"
              type="link"
            >
              {t("edit-account-text")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button size="small" type="link" style={{ position: "relative" }}>
              <input
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  opacity: 0,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                type="file"
                accept="image/*"
                onChange={handleChangeProfile.bind(null, doctor.id)}
              />
              {t("upload-profile-text")}
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenDeleteDoctorConfirmation.bind(null, doctor)}
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
    <Flex vertical style={{ height: "100%" }} gap="24px">
      <EditPasswordDialog
        onClose={handleCloseEditDoctorPassword}
        open={!!selectedDoctorToEditPassword}
        user={selectedDoctorToEditPassword}
      />
      <AddOrEditDoctorDialog
        open={isCreateOrEditDoctorDialogOpen}
        onClose={handleCloseCreateOrEditDoctorDialog}
        onConfirm={handleConfirmCreateOrEditDoctor}
        selectedDoctor={selectedDoctorToEdit}
      />
      <DeleteConfirmation
        title={t("delete-confirmation-title")}
        renderBody={() => (
          <>
            {t("delete-confirmation-description", {
              user:
                selectedDoctorToDelete?.firstName +
                " " +
                selectedDoctorToDelete?.lastName,
              id: selectedDoctorToDelete?.id,
            })}
          </>
        )}
        onClose={handleCloseDeleteDoctorConfirmation}
        onConfirm={handleConfirmDeleteDoctor}
        open={!!selectedDoctorToDelete}
      />

      <EmptyWrapper
        isEmpty={doctorsData?.count === 0}
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
        btn={{
          text: t("add-doctor-btn"),
          click: handleOpenCreateDoctorDialog,
        }}
      >
        <TableHeader
          headTitle={t("title")}
          createText={t("add-doctor-btn")}
          onCreate={handleOpenCreateDoctorDialog}
        />
        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: "15px", height: "100%" } }}
        >
          <TableWrapper
            rowKey="id"
            bordered
            size="middle"
            dataSource={doctors}
            columns={columns}
            pagination={{
              position: ["bottomCenter"],
              showSizeChanger: true,
              onChange: handlePageChange,
              total: doctorsData?.count ?? 0,
            }}
          />
        </Card>
      </EmptyWrapper>
    </Flex>
  );
};

export default DoctorsPage;
