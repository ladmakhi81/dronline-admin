"use client";

import EmptyWrapper from "@/shared-components/empty-wrapper";
import TableHeader from "@/shared-components/table-header";
import { Button, Card, Divider, Flex } from "antd";
import { FC, useMemo, useState } from "react";
import AddOrEditCategoryDialog from "./components/add-or-edit-category-dialog";
import { Category, GetCategoriesQuery } from "@/services/category/types";
import { useGetCategories } from "@/services/category/get-categories";
import TableWrapper from "@/shared-components/table-wrapper";
import { staticFileLoader } from "@/utils/static-file-loader";
import Image from "next/image";
import { AnyObject } from "antd/es/_util/type";
import DeleteConfirmation from "@/shared-components/delete-confirmation";
import { useDeleteCategory } from "@/services/category/delete-category";
import { useNotificationStore } from "@/store/notification.store";
import { useTranslations } from "next-intl";
import { jalaliDateTimeFormater } from "@/utils/date-format";

const CategoriesPage: FC = () => {
  const { mutateAsync: deleteCategoryMutate } = useDeleteCategory();
  const t = useTranslations("categories-page");
  const tGlobal = useTranslations("globals");

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
          showNotification(t("delete-successfully"), "success");
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
      title: t("category-icon"),
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
      title: t("category-name"),
      dataIndex: "name",
    },
    {
      title: tGlobal("created-at"),
      dataIndex: "createdAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: tGlobal("updated-at"),
      dataIndex: "updatedAt",
      width: 200,
      render: (value: string) => {
        return jalaliDateTimeFormater(new Date(value));
      },
    },
    {
      title: tGlobal("operation"),
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
              {tGlobal("edit")}
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
              {tGlobal("delete")}
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex style={{ height: "100%" }} vertical gap="24px">
      <DeleteConfirmation
        open={!!selectedCategoryToDelete}
        title={t("delete-confirmation-title")}
        renderBody={() => (
          <>
            {t("delete-confirmation-text", {
              name: selectedCategoryToDelete?.name,
            })}
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

      <EmptyWrapper
        isEmpty={categoriesData?.count === 0}
        title={t("empty-wrapper-title")}
        description={t("empty-wrapper-description")}
        btn={{
          click: handleOpenAddCategoryDialog,
          text: t("add-new-title"),
        }}
      >
        <TableHeader
          createText={t("add-new-title")}
          headTitle={t("title")}
          onCreate={handleOpenAddCategoryDialog}
        />
        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: "15px", height: "100%" } }}
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
        </Card>
      </EmptyWrapper>
    </Flex>
  );
};

export default CategoriesPage;
