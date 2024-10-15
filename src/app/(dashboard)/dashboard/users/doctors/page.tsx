"use client";

import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";
import { useGetUsers } from "@/services/user/get-users";
import { Gender, GetUsersQuery, User, UserType } from "@/services/user/types";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import TableWrapper from "@/shared-components/table-wrapper";
import { Button, Card, Divider, Flex } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { FC, useMemo, useState } from "react";

const DoctorsPage: FC = () => {
  const [isCreateOrEditDoctorDialogOpen, setCreateOrEditDoctorDialogOpen] =
    useState(false);

  const [selectedDoctorToEdit, setSelectedDoctorToEdit] = useState<User>();

  const handleOpenCreateDoctorDialog = () => {
    setCreateOrEditDoctorDialogOpen(true);
  };

  const handleCloseCreateDoctorDialog = () => {
    setCreateOrEditDoctorDialogOpen(false);
    setSelectedDoctorToEdit(undefined);
  };

  const handleOpenEditDoctorDialog = (doctor: User) => {
    setSelectedDoctorToEdit(doctor);
    setCreateOrEditDoctorDialogOpen(true);
  };

  const [queryApi, setQueryApi] = useState<GetUsersQuery>({
    type: UserType.Doctor,
    limit: 10,
    page: 0,
  });

  const { data: doctorsData } = useGetUsers(queryApi);

  const doctors = useMemo(() => {
    return doctorsData?.content || [];
  }, [doctorsData?.content]);

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
          <TableWrapper
            rowKey="id"
            bordered
            size="middle"
            dataSource={doctors}
            columns={[
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
              {
                title: "جنسیت",
                dataIndex: "gender",
                render: (value: Gender) => {
                  switch (value) {
                    case Gender.female:
                      return "پزشک خانوم";
                    case Gender.male:
                      return "پزشک آقا";
                    default:
                      return "نامشخص";
                  }
                },
              },
              ...TABLE_DEFAULT_COLUMNS,
              {
                title: "عملیات",
                width: 200,
                render: () => {
                  return (
                    <Flex gap="10px" justify="center" align="center">
                      <Button size="small" type="link">
                        جزئیات
                      </Button>
                      <Divider style={{ height: "20px" }} type="vertical" />
                      <Button size="small" type="link">
                        چارت رزرو{" "}
                      </Button>
                      <Divider style={{ height: "20px" }} type="vertical" />
                      <Button size="small" type="link">
                        مرخصی
                      </Button>
                      <Divider style={{ height: "20px" }} type="vertical" />
                      <Button size="small" type="link">
                        ویرایش گذرواژه
                      </Button>
                      <Divider style={{ height: "20px" }} type="vertical" />
                      <Button size="small" type="link">
                        ویرایش اطلاعات پایه
                      </Button>
                      <Divider style={{ height: "20px" }} type="vertical" />
                      <Button size="small" type="link">
                        حذف
                      </Button>
                    </Flex>
                  );
                },
              },
            ]}
          />
        </EmptyWrapper>
      </Card>
    </Flex>
  );
};

export default DoctorsPage;
