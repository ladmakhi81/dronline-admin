"use client";

import { User } from "@/services/user/types";
import { jalaliDateTimeFormater } from "@/utils/date-format";
import { staticFileLoader } from "@/utils/static-file-loader";
import { Descriptions } from "antd";
import Image from "next/image";
import { FC } from "react";

interface Props {
  doctor: User;
}

const DoctorBasicInformationTab: FC<Props> = ({ doctor }) => {
  return (
    <Descriptions layout="vertical" bordered>
      <Descriptions.Item span={3} label="تصویر پروفایل کاربر">
        <Image
          src={staticFileLoader(doctor.image)}
          alt="doctor-image"
          height={100}
          width={100}
          style={{ borderRadius: "8px" }}
        />
      </Descriptions.Item>
      <Descriptions.Item label="نام و نام خانوادگی">
        {doctor.firstName} {doctor.lastName}
      </Descriptions.Item>
      <Descriptions.Item label="شماره تماس">
        {doctor.phone} - {doctor.phone2}
      </Descriptions.Item>
      <Descriptions.Item label="مدرک تحصیلی">
        {doctor.degreeOfEducation}
      </Descriptions.Item>
      <Descriptions.Item label="شماره پرونده پزشک">
        {doctor.id}
      </Descriptions.Item>
      <Descriptions.Item label="وضعیت پزشک">
        {doctor.isActive ? "فعال" : "غیرفعال"}
      </Descriptions.Item>
      <Descriptions.Item label="آدرس">{doctor.address}</Descriptions.Item>
      <Descriptions.Item label="بیوگرافی">{doctor.bio}</Descriptions.Item>
      <Descriptions.Item label="زمینه های تخصصی">
        {doctor.workingFields
          .map((workingField) => workingField.name)
          .join(" - ")}
      </Descriptions.Item>
      <Descriptions.Item label="تاریخ تشکیل پرونده">
        <span dir="ltr">{jalaliDateTimeFormater(doctor.createdAt)}</span>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DoctorBasicInformationTab;
