"use client";

import { Button, Card, Flex, Typography } from "antd";
import { FC } from "react";

interface Props {
  onCreate: () => void;
  createText: string;
  headTitle: string;
}

const TableHeader: FC<Props> = ({ onCreate, createText, headTitle }) => {
  const handleCreate = () => {
    onCreate();
  };

  return (
    <Card styles={{ body: { padding: "15px" } }}>
      <Flex justify="space-between" align="center">
        <Typography.Title style={{ margin: 0 }} level={5}>
          {headTitle}
        </Typography.Title>
        <Button onClick={handleCreate} type="primary">
          {createText}
        </Button>
      </Flex>
    </Card>
  );
};

export default TableHeader;
