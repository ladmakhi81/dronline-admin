"use client";

import { useGetLocations } from "@/services/location/get-locations";
import TableWrapper from "@/shared-components/table-wrapper";
import { Button, Card, Divider, Flex, Typography } from "antd";
import { FC, useMemo } from "react";

const LocationsPage: FC = () => {
  const { data: locationsData } = useGetLocations({ limit: 10, page: 0 });
  const locations = useMemo(() => {
    return (locationsData?.content || []).map((location, locationIndex) => ({
      ...location,
      index: locationIndex + 1,
    }));
  }, [locationsData?.content]);

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
    },
    {
      title: "شهر",
      dataIndex: "city",
    },
    {
      title: "آدرس",
      dataIndex: "address",
    },
    {
      title: "تعداد شیفت های موجود",
      dataIndex: "doctorSchedules",
      width: 200,
      render: (value) => {
        return value.length;
      },
    },
    {
      title: "عملیات",
      width: 200,
      render: () => {
        return (
          <Flex gap="10px" justify="center" align="center">
            <Button size="small" type="link">
              ویرایش
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button size="small" type="link">
              حذف
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex style={{ height: "100%" }} vertical gap="24px">
      <Card styles={{ body: { padding: "15px" } }}>
        <Flex justify="space-between" align="center">
          <Typography.Title style={{ margin: 0 }} level={5}>
            لیست لوکیشن های سرویس دهنده
          </Typography.Title>
          <Button type="primary">ساخت لوکیشن</Button>
        </Flex>
      </Card>
      <Card
        style={{ flex: 1 }}
        styles={{ body: { padding: "15px", height: "100%" } }}
      >
        <TableWrapper
          rowKey="id"
          dataSource={locations}
          bordered
          size="middle"
          columns={columns}
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true,
          }}
        />
      </Card>
    </Flex>
  );
};

export default LocationsPage;
