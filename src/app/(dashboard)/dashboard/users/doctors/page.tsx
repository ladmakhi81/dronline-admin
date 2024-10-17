"use client";

import { DASHBOARD_URLS } from "@/constant/dashboard-urls.constant";
import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";
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

const DoctorsPage: FC = () => {
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
          showNotification("حذف پزشک با موفقیت انجام شد", "success");
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
          showNotification("ویرایش پزشک با موفقیت انجام شد", "success");
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
          showNotification("ساخت پزشک با موفقیت انجام شد", "success");
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
          showNotification(
            "پروفایل پزشک با موفقیت آپلود و ذخیره شد",
            "success"
          );
        })
        .catch(() => {});
    }
  };

  const doctors = useMemo(() => {
    return doctorsData?.content || [];
  }, [doctorsData?.content]);

  const columns = [
    {
      title: "سریال پزشک",
      dataIndex: "id",
    },
    {
      title: "نام و نام خانوادگی",
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
      title: "شماره تماس 1",
      dataIndex: "phone",
    },
    {
      title: "شماره تماس 2",
      dataIndex: "phone2",
    },
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: "عملیات",
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
              جزئیات
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenEditDoctorPassword.bind(null, doctor)}
              size="small"
              type="link"
            >
              ویرایش گذرواژه
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenEditDoctorDialog.bind(null, doctor)}
              size="small"
              type="link"
            >
              ویرایش حساب کاربری
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
              آپلود تصویر پروفایل
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleOpenDeleteDoctorConfirmation.bind(null, doctor)}
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
    <Flex vertical style={{ height: "100%" }} gap="24px">
      <TableHeader
        headTitle="لیست پزشکان سایت"
        createText="افزودن پزشک جدید"
        onCreate={handleOpenCreateDoctorDialog}
      />
      <Card
        style={{ flex: 1 }}
        styles={{ body: { padding: "15px", height: "100%" } }}
      >
        <EmptyWrapper
          isEmpty={doctorsData?.count === 0}
          title="لیست پزشکان"
          description="پزشکی ایجاد نشده,برای ساخت پزشک روی افزودن پزشک جدید کلیک کنید "
        >
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
            title="حذف پزشک"
            renderBody={() => (
              <>
                آیا از حذف پزشک {selectedDoctorToDelete?.firstName}{" "}
                {selectedDoctorToDelete?.lastName} با شماره پرونده{" "}
                {selectedDoctorToDelete?.id} اطمینان دارید؟
              </>
            )}
            onClose={handleCloseDeleteDoctorConfirmation}
            onConfirm={handleConfirmDeleteDoctor}
            open={!!selectedDoctorToDelete}
          />
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
        </EmptyWrapper>
      </Card>
    </Flex>
  );
};

export default DoctorsPage;
