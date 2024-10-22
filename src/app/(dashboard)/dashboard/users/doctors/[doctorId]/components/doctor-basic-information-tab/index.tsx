"use client";

import { User } from "@/services/user/types";
import { jalaliDateTimeFormater } from "@/utils/date-format";
import { staticFileLoader } from "@/utils/static-file-loader";
import { Descriptions } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FC } from "react";

interface Props {
  doctor: User;
}

const DoctorBasicInformationTab: FC<Props> = ({ doctor }) => {
  const t = useTranslations("doctors-detail-page.basic-information-tab");
  return (
    <>
      <Descriptions layout="vertical" bordered>
        {doctor.image && (
          <Descriptions.Item span={3} label={t("profile-image")}>
            <Image
              src={staticFileLoader(doctor.image)}
              alt="doctor-image"
              height={100}
              width={100}
              style={{ borderRadius: "8px" }}
            />
          </Descriptions.Item>
        )}
        <Descriptions.Item label={t("fullName")}>
          {doctor.firstName} {doctor.lastName}
        </Descriptions.Item>
        <Descriptions.Item label={t("phone")}>
          {doctor.phone} - {doctor.phone2}
        </Descriptions.Item>
        <Descriptions.Item label={t("degree-of-education")}>
          {doctor.degreeOfEducation}
        </Descriptions.Item>
        <Descriptions.Item label={t("id")}>{doctor.id}</Descriptions.Item>
        <Descriptions.Item label={t("status")}>
          {doctor.isActive ? t("active") : t("disable")}
        </Descriptions.Item>
        <Descriptions.Item label={t("address")}>
          {doctor.address}
        </Descriptions.Item>
        <Descriptions.Item label={t("bio")}>{doctor.bio}</Descriptions.Item>
        <Descriptions.Item label={t("working-fields")}>
          {doctor.workingFields
            .map((workingField) => workingField.name)
            .join(" - ")}
        </Descriptions.Item>
        <Descriptions.Item label={t("created-at")}>
          <span dir="ltr">{jalaliDateTimeFormater(doctor.createdAt)}</span>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default DoctorBasicInformationTab;
