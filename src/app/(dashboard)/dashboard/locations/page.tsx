"use client";

import { useGetLocations } from "@/services/location/get-locations";
import { Schedule } from "@/services/schedule/types";
import TableWrapper from "@/shared-components/table-wrapper";
import { Button, Card, Divider, Flex, Typography } from "antd";
import { FC, useMemo, useState } from "react";
import AddOrEditLocationDialog from "./components/add-or-edit-location-dialog";
import { GetLocationsQuery, Location } from "@/services/location/types";
import { AnyObject } from "antd/es/_util/type";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import { useDeleteLocation } from "@/services/location/delete-location";
import { useNotificationStore } from "@/store/notification.store";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";

const LocationsPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<GetLocationsQuery>({});

  const { mutateAsync: deleteLocationMutate } = useDeleteLocation();

  const {
    data: locationsData,
    refetch: refetchLocations,
    isLoading: isLocationLoading,
    isFetching: isFetchingLocation,
  } = useGetLocations({
    ...searchQuery,
  });

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const locations = useMemo(() => {
    return (locationsData?.content || []).map((location, locationIndex) => ({
      ...location,
      index: locationIndex + 1,
    }));
  }, [locationsData?.content]);

  const [isAddOrEditLocationDialogOpen, setAddOrEditLocationDialogOpen] =
    useState(false);

  const [selectedLocationToEdit, setSelectedLocationToEdit] =
    useState<Location>();

  const [selectedLocationToDelete, setSelectedLocationToDelete] =
    useState<Location>();

  const handleCreateLocation = () => {
    setAddOrEditLocationDialogOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocationToEdit(location);
    setAddOrEditLocationDialogOpen(true);
  };

  const handleDeleteLocation = (location: Location) => {
    setSelectedLocationToDelete(location);
  };

  const handleCloseCreateOrEditLocationDialog = () => {
    setAddOrEditLocationDialogOpen(false);
    setSelectedLocationToEdit(undefined);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedLocationToDelete(undefined);
  };

  const handleConfirmDeleteLocation = () => {
    if (selectedLocationToDelete?.id) {
      deleteLocationMutate(selectedLocationToDelete?.id).then(() => {
        handleCloseDeleteConfirmation();
        showNotification("حذف لوکیشن با موفقیت انجام گردید", "success");
        refetchLocations();
      });
    }
  };

  const handlePagination = (page: number, pageSize: number) => {
    setSearchQuery((prevState) => ({
      ...prevState,
      limit: pageSize,
      page: page - 1,
    }));
  };

  const columns = [
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
      render: (value: Schedule[]) => {
        return value.length;
      },
    },
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: "عملیات",
      width: 200,
      render: (_: unknown, record: AnyObject) => {
        return (
          <Flex gap="10px" justify="center" align="center">
            <Button
              onClick={handleEditLocation.bind(null, record as Location)}
              size="small"
              type="link"
            >
              ویرایش
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleDeleteLocation.bind(null, record as Location)}
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
      <AddOrEditLocationDialog
        open={isAddOrEditLocationDialogOpen}
        onClose={handleCloseCreateOrEditLocationDialog}
        refetchLocation={refetchLocations}
        selectedLocation={selectedLocationToEdit}
      />
      <DeleteConfirmation
        open={!!selectedLocationToDelete}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDeleteLocation}
        title="حذف لوکیشن"
        renderBody={() => (
          <Typography.Text>
            آیا از حذف شهر {selectedLocationToDelete?.city} آدرس{" "}
            {selectedLocationToDelete?.address} اطمینان دارید؟
          </Typography.Text>
        )}
      />

      <EmptyWrapper
        description="ابتدا باید لوکیشن سرویس دهنده ای ایجاد کنید"
        title="لوکیشن سرویس دهنده"
        isEmpty={locations.length === 0}
        btn={{
          click: handleCreateLocation,
          text: "ساخت لوکیشن",
        }}
      >
        <TableHeader
          createText="ساخت لوکیشن"
          headTitle="لیست لوکیشن های سرویس دهنده"
          onCreate={handleCreateLocation}
        />
        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: "15px", height: "100%" } }}
        >
          <TableWrapper
            loading={isLocationLoading || isFetchingLocation}
            rowKey="id"
            dataSource={locations}
            bordered
            size="middle"
            columns={columns}
            pagination={{
              position: ["bottomCenter"],
              showSizeChanger: true,
              total: locationsData?.count ?? 0,
              onChange: handlePagination,
            }}
          />
        </Card>
      </EmptyWrapper>
    </Flex>
  );
};

export default LocationsPage;
