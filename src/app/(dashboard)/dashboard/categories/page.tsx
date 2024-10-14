"use client";

import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import { Button, Card, Divider, Flex } from "antd";
import { FC, useMemo, useState } from "react";
import AddOrEditCategoryDialog from "./components/add-or-edit-category-dialog";
import { Category } from "@/services/category/types";
import { useGetCategories } from "@/services/category/get-categories";
import TableWrapper from "@/shared-components/table-wrapper";
import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";
import { staticFileLoader } from "@/utils/static-file-loader";
import Image from "next/image";

const CategoriesPage: FC = () => {
  const { data: categoriesData, refetch: refetchCategories } = useGetCategories(
    { limit: 10, page: 0 }
  );

  const categories = useMemo(() => {
    return (categoriesData?.content || []).map((category, index) => ({
      ...category,
      index: index + 1,
    }));
  }, [categoriesData?.content]);

  const [isAddOrEditCategoryDialogOpen, setAddOrEditCategoryDialogOpen] =
    useState(false);

  const [selectedCategoryToEdit, setSelectedCategoryToEdit] =
    useState<Category>();

  const handleOpenAddCategoryDialog = () => {
    setAddOrEditCategoryDialogOpen(true);
  };

  const handleCloseAddOrEditCategoryDialog = () => {
    setAddOrEditCategoryDialogOpen(false);
    setSelectedCategoryToEdit(undefined);
  };

  const columns = [
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: "نام زمینه تخصصی",
      dataIndex: "name",
    },
    {
      title: "آیکن",
      dataIndex: "icon",
      render: (iconURL: string) => {
        return (
          <Flex justify="flex-start" align="center">
            <Image
              alt="categories-icon"
              src={staticFileLoader(iconURL)}
              height={20}
              width={20}
            />
          </Flex>
        );
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
      <TableHeader
        createText="افزودن زمینه تخصصی جدید"
        headTitle="لیست زمینه های تخصصی ارائه شده"
        onCreate={handleOpenAddCategoryDialog}
      />
      <AddOrEditCategoryDialog
        onClose={handleCloseAddOrEditCategoryDialog}
        open={isAddOrEditCategoryDialogOpen}
        refetchCategories={refetchCategories}
        selectedCategory={selectedCategoryToEdit}
      />
      <Card
        style={{ flex: 1 }}
        styles={{ body: { padding: "15px", height: "100%" } }}
      >
        <EmptyWrapper
          isEmpty={categoriesData?.count === 0}
          title="لیست زمینه های تخصصی"
          description="آیتمی وجود ندارد, از طریق دکمه افزودن زمینه تخصصی جدید, یک آیتم جدید ایجاد کنید"
        >
          <TableWrapper
            size="middle"
            bordered
            rowKey="id"
            dataSource={categories}
            columns={columns}
          />
        </EmptyWrapper>
      </Card>
    </Flex>
  );
};

export default CategoriesPage;
