"use client";

import { Empty, Flex, Typography } from "antd";
import { FC, PropsWithChildren } from "react";
import { Container } from "./styles";

interface Props extends PropsWithChildren {
  isEmpty: boolean;
  title: string;
  description: string;
}

const EmptyWrapper: FC<Props> = ({ description, isEmpty, title, children }) => {
  if (!isEmpty) return children;
  return (
    <Container vertical>
      <Empty
        description={
          <Flex vertical>
            <Typography.Title level={5}>{title}</Typography.Title>
            <Typography.Text>{description}</Typography.Text>
          </Flex>
        }
      />
    </Container>
  );
};

export default EmptyWrapper;
