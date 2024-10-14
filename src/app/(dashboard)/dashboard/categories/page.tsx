"use client";

import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import { Button, Card, Divider, Flex } from "antd";
import { FC, useMemo, useState } from "react";
import AddOrEditCategoryDialog from "./components/add-or-edit-category-dialog";
import { Category, GetCategoriesQuery } from "@/services/category/types";
import { useGetCategories } from "@/services/category/get-categories";
import TableWrapper from "@/shared-components/table-wrapper";
import { TABLE_DEFAULT_COLUMNS } from "@/constant/table-default-columns.constant";
import { staticFileLoader } from "@/utils/static-file-loader";
import Image from "next/image";
import { AnyObject } from "antd/es/_util/type";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import { useDeleteCategory } from "@/services/category/delete-category";
import { useNotificationStore } from "@/store/notification.store";

const CategoriesPage: FC = () => {
  const { mutateAsync: deleteCategoryMutate } = useDeleteCategory();

  const [apiQuery, setApiQuery] = useState<GetCategoriesQuery>({
    limit: 10,
    page: 0,
  });

  const {
    data: categoriesData,
    refetch: refetchCategories,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
  } = useGetCategories(apiQuery);

  const showNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [selectedCategoryToDelete, setSelectedCategoryToDelete] =
    useState<Category>();

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

  const handleOpenEditCategoryDialog = (category: Category) => {
    setSelectedCategoryToEdit(category);
    setAddOrEditCategoryDialogOpen(true);
  };

  const handleCloseAddOrEditCategoryDialog = () => {
    setAddOrEditCategoryDialogOpen(false);
    setSelectedCategoryToEdit(undefined);
  };

  const handleSelectedCategoryToDelete = (category: Category) => {
    setSelectedCategoryToDelete(category);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedCategoryToDelete(undefined);
  };

  const handleConfirmDeleteCategory = () => {
    if (selectedCategoryToDelete?.id) {
      deleteCategoryMutate(selectedCategoryToDelete?.id)
        .then(() => {
          showNotification("حذف زمینه تخصصی با موفقیت انجام گردید", "success");
          handleCloseDeleteConfirmation();
          refetchCategories();
        })
        .catch(() => {});
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setApiQuery({ limit: pageSize, page: page - 1 });
  };

  const columns = [
    {
      title: "آیکن",
      dataIndex: "icon",
      render: (iconURL: string) => {
        return (
          <Flex justify="flex-start" align="center">
            <Image
              alt="categories-icon"
              src={staticFileLoader(iconURL)}
              height={25}
              width={25}
            />
          </Flex>
        );
      },
    },
    {
      title: "نام زمینه تخصصی",
      dataIndex: "name",
    },
    ...TABLE_DEFAULT_COLUMNS,
    {
      title: "عملیات",
      width: 200,
      render: (_: unknown, record: AnyObject) => {
        return (
          <Flex gap="10px" justify="center" align="center">
            <Button
              onClick={handleOpenEditCategoryDialog.bind(
                null,
                record as Category
              )}
              size="small"
              type="link"
            >
              ویرایش
            </Button>
            <Divider style={{ height: "20px" }} type="vertical" />
            <Button
              onClick={handleSelectedCategoryToDelete.bind(
                null,
                record as Category
              )}
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
      <TableHeader
        createText="افزودن زمینه تخصصی جدید"
        headTitle="لیست زمینه های تخصصی ارائه شده"
        onCreate={handleOpenAddCategoryDialog}
      />
      <DeleteConfirmation
        open={!!selectedCategoryToDelete}
        title="حذف زمینه تخصصی"
        renderBody={() => (
          <>
            آیا از حذف زمینه تخصصی {selectedCategoryToDelete?.name} اطمینان
            دارید؟
          </>
        )}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDeleteCategory}
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
            loading={isCategoriesFetching || isCategoriesLoading}
            size="middle"
            bordered
            rowKey="id"
            dataSource={categories}
            columns={columns}
            pagination={{
              position: ["bottomCenter"],
              total: categoriesData?.count ?? 0,
              showSizeChanger: true,
              onChange: handlePageChange,
            }}
          />
        </EmptyWrapper>
      </Card>
    </Flex>
  );
};

export default CategoriesPage;
