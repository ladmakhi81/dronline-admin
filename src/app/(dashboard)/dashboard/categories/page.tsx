"use client";

import { useGetCategories } from "@/services/category";
import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import { Card, Flex } from "antd";
import { FC, useState } from "react";
import AddOrEditCategoryDialog from "./components/add-or-edit-category-dialog";
import { Category } from "@/services/category/types";

const CategoriesPage: FC = () => {
  const { data: categoriesData, refetch: refetchCategories } = useGetCategories(
    { limit: 10, page: 0 }
  );
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
          <div>
            <p>salam</p>
          </div>
        </EmptyWrapper>
      </Card>
    </Flex>
  );
};

export default CategoriesPage;
