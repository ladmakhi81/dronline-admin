"use client";

import { useGetUserById } from "@/services/user/get-user-by-id";
import { Flex, Spin, Tabs } from "antd";
import { FC } from "react";
import DoctorBasicInformationTab from "./components/doctor-basic-information-tab";
import DoctorReservationChartTab from "./components/doctor-reservation-chart-tab";
import { Container } from "./components/styles";
import DoctorsDaysOffTab from "./components/doctors-days-off-tab";
import { useTranslations } from "next-intl";

interface Props {
  params: { doctorId: number };
}

const Orders = () => <p>Orders</p>;

const DoctorDetailPage: FC<Props> = ({ params }) => {
  const t = useTranslations("doctor-detail-page");
  const { data: userDetailInfo, isLoading: isUserDetailLoading } =
    useGetUserById(params.doctorId);

  return (
    <Container styles={{ body: { height: "100%", width: "100%" } }}>
      {isUserDetailLoading && (
        <Flex
          style={{ width: "100%", height: "100%" }}
          vertical
          align="center"
          justify="center"
          gap="middle"
        >
          <Spin size="large" />
        </Flex>
      )}
      {userDetailInfo && !isUserDetailLoading && (
        <Tabs
          items={[
            {
              key: "1",
              label: t("tabs.basic-information"),
              children: <DoctorBasicInformationTab doctor={userDetailInfo} />,
            },
            {
              key: "2",
              label: t("tabs.reservation-chart"),
              children: <DoctorReservationChartTab doctor={userDetailInfo} />,
            },
            {
              key: "3",
              label: t("daysoff"),
              children: <DoctorsDaysOffTab doctor={userDetailInfo} />,
            },
            {
              key: "4",
              label: t("reserved-orders"),
              children: <Orders />,
            },
          ]}
        />
      )}
    </Container>
  );
};

export default DoctorDetailPage;
